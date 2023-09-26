const { User } = require("./models");
const axios = require('axios');
const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_KHNZA;
const payload = {
    gid: "Server Side",
};
async function findUser(dep) {
    let users = await User.findAll({
        where: {
            dep: dep
        },
        attributes: ['nama', 'nik'],
    })
    return users;
}

findUser(9)

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
    // console.log(nama)
    if (hasil.data.data.length == 0) {
        return null
    }
    return hasil.data.data[0].nik
}
async function findPassword(nip) {
    let token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
    let config = {
        method: "GET",
        url: process.env.HOSTKHNZA + "/api/users/password/" + nip,
        headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
        }
    };
    try {
        let hasil = await axios(config)
        console.log(hasil.data.data)
        return hasil.data.data
    }
    catch (error) {
        return null
    }
}
// findPassword("RM1")
// find('6107010908880001')
// 8	Dokter Spesialis
// 9	Dokter Umum
// 10	Dokter Gigi
// cek(8)
async function cek(data) {
    console.log(data)
    let pegawi = await findUser(data)
    console.log(pegawi.length)
    for (let i of pegawi) {
        // console.log(i.nik)
        let hasil = await find(i.nik)
        if (hasil == null) {
            console.log(i.nama)
        }
        console.log(hasil)
        let cek = await findPassword(hasil)
        console.log(cek)
        console.log('------------------------')
    }
}
cek(process.argv[2]);