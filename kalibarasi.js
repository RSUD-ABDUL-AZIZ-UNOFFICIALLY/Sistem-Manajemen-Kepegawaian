
function unique(array) {
    let uniqueArray = [];
    for (let i of array) {
        let isDuplicate = false;
        for (let j of uniqueArray) {
            if (i.id === j.id) {
                isDuplicate = true;
                break;
            }
        }
        if (!isDuplicate) {
            uniqueArray.push(i);
        }
    }
    return uniqueArray;
}

function calculateLevenshteinDistance(str1, str2) {
    const m = str1.length;
    const n = str2.length;
    const dp = [];

    for (let i = 0; i <= m; i++) {
        dp[i] = [i];
    }

    for (let j = 0; j <= n; j++) {
        dp[0][j] = j;
    }

    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
            dp[i][j] = Math.min(
                dp[i - 1][j] + 1,
                dp[i][j - 1] + 1,
                dp[i - 1][j - 1] + cost
            );
        }
    }

    const maxLen = Math.max(m, n);
    const distance = dp[m][n];
    const similarityPercentage = ((maxLen - distance) / maxLen) * 100;

    return similarityPercentage;
}

function findSimilarity(param, data) {
    let nama = param.toLowerCase().trim();
    let persentaseKecocokanTerbaik = 0;
    let idTerbaik = null;
    let result = {};

    for (let i of data) {
        let namaDiData = i.nama.toLowerCase();
        let persentaseKecocokan = calculateLevenshteinDistance(namaDiData, nama);

        if (persentaseKecocokan > persentaseKecocokanTerbaik) {
            persentaseKecocokanTerbaik = persentaseKecocokan;
            idTerbaik = i.nik;
            result = {
                nik: i.nik,
                nama: i.nama,
                tgl_lahir: i.tgl_lahir,
                jk: i.jk,
                jbtn: i.jbtn,
                persentase: persentaseKecocokanTerbaik
            };
        }
    }
    return result;
}

const { User } = require("./models");
const axios = require('axios');
const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_KHNZA;
const payload = {
    gid: "Server Side",
};
// {
//     "nama": "TARUNA PRATAMA FITRA",
//     "no_ktp": "0000000000000000",
//     "jk": "Pria",
//     "tmp_lahir": "-",
//     "tgl_lahir": "1993-09-01",
//     "photo": "pages/pegawai/photo/"
// }
async function findUser() {
    let users = await User.findAll({
        attributes: ['nik', 'nama', 'tgl_lahir'],
        // where: {
        //     status: 'PNS'
        // },
        // limit: 10
    })
    // console.log(users)
    let obj = parsing(users)
    for (let i of obj) {
        // console.log(i)
        let x = await cari(i)
        if (x.length == 0) {
            console.log('tidak ada')
        } else {
            let y = findSimilarity(i.nama, x)
            console.log("data Mirip di kanza ada " + x.length + "|" + i.nama + "| kemiripan :" + y.persentase + "%");
            let hasil = {
                nik: i.nik,
                nama: i.nama,
                tgl_lahir: i.tgl_lahir,
                nik_khnza: y.nik,
                nama_khnza: y.nama,
                jk_khnza: y.jk,
                jbtn_khnza: y.jbtn,
                tgl_lahir_khnza: y.tgl_lahir,
                persentase: y.persentase
            }
            console.log(hasil)
        }

    }
}
findUser()

function parsing(data) {
    let result = [];
    for (let i of data) {
        let obj = {
            nik: i.nik,
            nama: i.nama,
            tgl_lahir: i.tgl_lahir
        }
        result.push(obj)
    }
    return result;
}
function pecah(nama) {
    // Mengubah nama menjadi huruf kecil
    nama = nama.toLowerCase();
    // Memisahkan nama berdasarkan spasi atau tanda titik (.)
    let ArrName = nama.split(/[ .,]+/);
    return ArrName;
}
// pecah('Nurul Afifah, A. Md. Kep')

async function cari(obj) {
    let result = [];
    let nama = pecah(obj.nama)
    for (let i of nama) {
        let hasil = await find(i)
        result.push(hasil.data)
    }
    // console.log(result)
    let uniqueArray = unique(result);
    // console.log(result.length)
    // console.log(uniqueArray.length)
    // console.log(uniqueArray)
    return uniqueArray[0];
}
async function find(nama) {
    let token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
    let config = {
        method: "GET",
        url: process.env.HOSTKHNZA + "/api/users/cari?search=" + nama,
        headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
        }
    };
    let hasil = await axios(config)
    return hasil.data
}
// find('nurul')