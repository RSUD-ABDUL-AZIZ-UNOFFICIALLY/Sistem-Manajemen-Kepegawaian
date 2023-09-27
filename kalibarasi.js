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
                tmp_lahir: i.tmp_lahir,
                photo: i.photo,
                no_ktp: i.no_ktp,
                persentase: persentaseKecocokanTerbaik
            };
        }
    }
    return result;
}

const { User } = require("./models");
const axios = require('axios');
const jwt = require("jsonwebtoken");
const fs = require("fs");
const secretKey = process.env.SECRET_KHNZA;
const payload = {
    gid: "Server Side",
};
async function findUser() {
    let users = await User.findAll({
        attributes: ['nik', 'nama', 'tgl_lahir', 'JnsKel'],
        // where: {
        //     status: 'PNS'
        // },
        // limit: 5
    })
    // console.log(users)
    let tidakAda = [];
    let under = [];
    let obj = parsing(users)
    for (let i of obj) {
        // console.log(i)
        let jk = i.JnsKel == 'Laki-laki' ? 'Pria' : 'Wanita'
        let x = await cari(i)
        if (x.length == 0) {
            console.log('tidak ada')
            tidakAda.push(i)
        } else {
            let y = findSimilarity(i.nama, x)
            console.log("data Mirip di kanza ada " + x.length + "|" + i.nama + "| kemiripan :" + y.persentase + "%");
            let hasil = {
                nik: i.nik,
                nama: i.nama,
                tgl_lahir: i.tgl_lahir,
                jk: jk,
                nip_khnza: y.nik,
                nama_khnza: y.nama,
                jk_khnza: y.jk,
                jbtn_khnza: y.jbtn,
                tgl_lahir_khnza: y.tgl_lahir,
                tmp_lahir_khnza: y.tmp_lahir,
                no_ktp_khnza: y.no_ktp,
                photo_khnza: y.photo,
                persentase: y.persentase
            }
            if (y.persentase < 55) {
                under.push(hasil)
            } else {
                console.log(hasil)
                updateData(hasil)
            }
        }
    }
    fs.writeFileSync("./tidakAda.json", JSON.stringify(tidakAda));
    fs.writeFileSync("./under.json", JSON.stringify(under));
    console.log('Under 55% : ' + under.length)
    console.log('Tidak ada : ' + tidakAda.length)
}
findUser()

function parsing(data) {
    let result = [];
    for (let i of data) {
        let obj = {
            nik: i.nik,
            nama: i.nama,
            tgl_lahir: i.tgl_lahir,
            JnsKel: i.JnsKel
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
    let uniqueArray = unique(result);
    return uniqueArray[0];
}
async function find(nama) {
    let token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
    let config = {
        method: "GET",
        url: process.env.HOSTKHNZA + "/api/users/cari?search=" + nama + "&limit=100",
        headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
        }
    };
    let hasil = await axios(config)
    return hasil.data
}
async function updateData(data) {
    let token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
    let upload = JSON.stringify(
        {
            "nama": data.nama_khnza,
            "no_ktp": `${data.nik}`,
            "jk": data.jk,
            "tmp_lahir": data.tmp_lahir_khnza,
            "tgl_lahir": data.tgl_lahir,
            "photo": "pages/pegawai/photo/"
        });
    console.log(upload)
    let config = {
        method: "PUT",
        url: process.env.HOSTKHNZA + "/api/users/update/" + data.nik_khnza,
        headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
        },
        data: upload
    };
    let hasil = await axios(config)
    console.log(hasil.data)
    return hasil
}
// find('nurul')