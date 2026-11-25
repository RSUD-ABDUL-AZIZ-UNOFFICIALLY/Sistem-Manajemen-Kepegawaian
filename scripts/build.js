const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');

const pkg = require('../package.json');
const APP_VERSION = pkg.version || '1.0.0';

const CONFIG = {
    viewsDir: path.resolve(__dirname, '../views'),
    publicDir: path.resolve(__dirname, '../public'),
    // Prefix URL dari express.static
    urlPrefix: '/asset',
    // Subfolder tujuan hasil build di dalam publicDir (public/src/...)
    outputSubdir: 'src',
    manifestPath: path.resolve(__dirname, '../public/js-manifest.json'),
    viewExtensions: ['.ejs', '.html', '.pug', '.hbs'],
    cleanOldBuilds: true,
    rewriteViewsInPlace: process.argv.includes('--rewrite'),
};

function walkDir(dir, fileList = []) {
    if (!fs.existsSync(dir)) return fileList;
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            walkDir(fullPath, fileList);
        } else if (CONFIG.viewExtensions.includes(path.extname(entry.name).toLowerCase())) {
            fileList.push(fullPath);
        }
    }
    return fileList;
}

/**
 * Bersihkan file *.v*.*min.js lama khusus di dalam folder outputSubdir (public/src)
 */
function cleanOldMinifiedFiles(dir) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const oldBuildRegex = /\.v\d+\.\d+\.\d+.*\.min\.js$/;

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            cleanOldMinifiedFiles(fullPath);
        } else if (oldBuildRegex.test(entry.name)) {
            fs.unlinkSync(fullPath);
        }
    }
}

/**
 * Ambil path relatif terhadap publicDir dari URL di view
 * Contoh: /asset/js/simrs-antrian.js -> js/simrs-antrian.js
 */
function getRelativeAssetPath(urlPath) {
    let relPath = urlPath;
    if (CONFIG.urlPrefix && relPath.startsWith(CONFIG.urlPrefix)) {
        relPath = relPath.slice(CONFIG.urlPrefix.length);
    }
    return relPath.replace(/^\/+/, '');
}

function extractJsReferences(viewFiles) {
    const referencedJs = new Set();
    const scriptRegex = /<script\b[^>]*\bsrc\s*=\s*["']([^"']+\.js)(?:\?[^"']*)?["'][^>]*>/gi;

    for (const file of viewFiles) {
        const content = fs.readFileSync(file, 'utf8');
        let match;

        while ((match = scriptRegex.exec(content)) !== null) {
            const rawSrc = match[1].trim();

            if (
                rawSrc.startsWith('http://') ||
                rawSrc.startsWith('https://') ||
                rawSrc.startsWith('//') ||
                rawSrc.includes('<%') ||
                /\.min\.js$/i.test(rawSrc)
            ) {
                continue;
            }

            const normalizedUrl = rawSrc.startsWith('/') ? rawSrc : `/${rawSrc}`;
            if (CONFIG.urlPrefix && !normalizedUrl.startsWith(`${CONFIG.urlPrefix}/`)) {
                continue;
            }

            referencedJs.add(normalizedUrl);
        }
    }

    return Array.from(referencedJs);
}

async function buildMinifiedAssets(jsUrls) {
    const manifest = {};

    for (const urlPath of jsUrls) {
        // Contoh: js/simrs-antrian.js
        const relAssetPath = getRelativeAssetPath(urlPath);
        const sourceFilePath = path.join(CONFIG.publicDir, relAssetPath);

        if (!fs.existsSync(sourceFilePath)) {
            console.warn(`[SKIP] File tidak ditemukan: ${sourceFilePath}`);
            continue;
        }

        const parsedRel = path.posix.parse(relAssetPath);
        const minFileName = `${parsedRel.name}.v${APP_VERSION}.min.js`;

        // Path relatif hasil build: src/js/simrs-antrian.v1.0.0.min.js
        const outputRelPath = path.posix.join(CONFIG.outputSubdir, parsedRel.dir, minFileName);
        // Path fisik: public/src/js/simrs-antrian.v1.0.0.min.js
        const outputFilePath = path.join(CONFIG.publicDir, outputRelPath);
        // URL publik: /asset/src/js/simrs-antrian.v1.0.0.min.js
        const outputUrlPath = path.posix.join(CONFIG.urlPrefix || '/', outputRelPath);

        try {
            await esbuild.build({
                entryPoints: [sourceFilePath],
                outfile: outputFilePath, // esbuild otomatis membuat folder tujuan jika belum ada
                minify: true,
                bundle: false,
                target: ['es2020'],
                sourcemap: false,
                legalComments: 'none',
            });

            manifest[urlPath] = outputUrlPath;
            const origSize = (fs.statSync(sourceFilePath).size / 1024).toFixed(2);
            const minSize = (fs.statSync(outputFilePath).size / 1024).toFixed(2);
            console.log(`[OK] ${relAssetPath} -> ${outputRelPath} (${origSize} KB -> ${minSize} KB)`);
        } catch (err) {
            console.error(`[ERROR] Gagal minify ${urlPath}:`, err.message);
        }
    }

    return manifest;
}

function rewriteViewFiles(viewFiles, manifest) {
    for (const file of viewFiles) {
        let content = fs.readFileSync(file, 'utf8');
        let modified = false;

        for (const [origUrl, minUrl] of Object.entries(manifest)) {
            const escapedOrig = origUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const replaceRegex = new RegExp(
                `(<script\\b[^>]*\\bsrc\\s*=\\s*["'])${escapedOrig}(?:\\?[^"']*)?(["'][^>]*>)`,
                'gi'
            );

            if (replaceRegex.test(content)) {
                content = content.replace(replaceRegex, `$1${minUrl}$2`);
                modified = true;
            }
        }

        if (modified) {
            fs.writeFileSync(file, content, 'utf8');
            console.log(`[VIEW UPDATED] ${path.relative(process.cwd(), file)}`);
        }
    }
}

async function run() {
    console.log(`=== JS Asset Builder (App Version: v${APP_VERSION}) ===`);

    if (CONFIG.cleanOldBuilds) {
        const targetCleanDir = path.join(CONFIG.publicDir, CONFIG.outputSubdir);
        cleanOldMinifiedFiles(targetCleanDir);
    }

    const viewFiles = walkDir(CONFIG.viewsDir);
    console.log(`Memindai ${viewFiles.length} file view...`);

    const jsUrls = extractJsReferences(viewFiles);
    console.log(`Ditemukan ${jsUrls.length} referensi file JS unik.\n`);

    const manifest = await buildMinifiedAssets(jsUrls);

    fs.writeFileSync(CONFIG.manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
    console.log(`\nManifest tersimpan di: ${path.relative(process.cwd(), CONFIG.manifestPath)}`);

    if (CONFIG.rewriteViewsInPlace) {
        console.log('\nMemperbarui referensi di folder views...');
        rewriteViewFiles(viewFiles, manifest);
    }
}

run();