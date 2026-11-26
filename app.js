const http = require('node:http');
const path = require('node:path');
const express = require('express');
const cookieParser = require('cookie-parser');
const favicon = require('serve-favicon');
const morgan = require('morgan');
const useragent = require('express-useragent');
const { createClient } = require('redis');
const pkg = require('./package.json');
const fs = require('fs');
const app = express();
const server = http.createServer(app);
const isDev = process.env.NODE_ENV !== 'production';
const publicDir = path.join(__dirname, 'public');

console.log(`${pkg.name} v${pkg.version} | mode=${process.env.NODE_ENV} | isDev=${isDev}`);

// 1. Konfigurasi dasar & Proxy (otomatis mengisi req.ip dari X-Forwarded-For / X-Real-IP)
app.set('trust proxy', 1);
app.set('view engine', 'ejs');

// 2. Aset statis di paling atas agar tidak membebani middleware parser & logger
app.use(favicon(path.join(publicDir, 'favicon.ico')));
app.use('/asset', express.static(publicDir, {
    index: false // Mencegah akses langsung ke index.html jika ada
}));
// Load manifest sekali saat startup
let jsManifest = {};
const manifestPath = path.join(publicDir, 'js-manifest.json');
if (fs.existsSync(manifestPath)) {
    jsManifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
}

app.use((req, res, next) => {
    res.locals.assetJs = (urlPath) => {
        if (process.env.NODE_ENV === 'production' && jsManifest[urlPath]) {
            return jsManifest[urlPath];
        }
        return urlPath;
    };
    next();
});

// 3. Service Worker route (sebelum logger jika tidak ingin memenuhi log)
const swKillSwitch = `
  self.addEventListener('install', () => self.skipWaiting());
  self.addEventListener('activate', (e) => {
    e.waitUntil(self.registration.unregister().then(() => self.clients.claim()));
  });
`;

app.get('/service-worker.js', (req, res) => {
    if (isDev) {
        res.set({
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
            'Content-Type': 'application/javascript'
        });
        return res.send(swKillSwitch);
    }
    res.sendFile(path.join(publicDir, 'js', 'service-worker.js'));
}); 

// 4. User-Agent & Logger
app.use(useragent.express());

morgan.token('real-ip', (req) => req.headers['x-real-ip'] || req.ip);
morgan.token('device', (req) => {
    const ua = req.useragent;
    if (!ua) return 'Unknown-Device';
    if (ua.isMobile) return 'Mobile';
    if (ua.isTablet) return 'Tablet';
    if (ua.isDesktop) return 'Desktop';
    if (ua.isBot) return 'Bot';
    return 'Unknown-Device';
});

app.use(morgan(':real-ip :device :method :url :status :response-time ms'));

// 5. Body & Cookie Parsers (Native Express)
app.use(express.json({ type: ['application/json', 'application/*+json'] }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// 6. Routes
app.use('/', require('./routes'));
app.use('/rest', require('./routes/rest'));
app.use('/rest/hardin', require('./routes/hardin'));

// 7. Error & 404 Handlers
app.use((req, res) => {
    res.status(404).sendFile(path.join(publicDir, '404.html'));
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// 8. Inisialisasi Redis & Startup Server secara berurutan
async function bootstrap() {
    const redisClient = createClient({
        password: process.env.REDIS_PASSWORD,
        socket: {
            host: process.env.REDIS_URL,
            port: Number(process.env.REDIS_URL_PORT) || 6379
        }
    });

    redisClient.on('error', (err) => console.error('Redis Client Error:', err));

    await redisClient.connect();
    console.log('Redis client connected');

    // Tersedia di semua route via req.app.locals.cache tanpa middleware tambahan
    app.locals.cache = redisClient;

    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
        console.log(`Listening on *:${PORT}`);
    });
}

bootstrap().catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
});