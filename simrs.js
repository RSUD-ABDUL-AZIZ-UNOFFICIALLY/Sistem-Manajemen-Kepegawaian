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
    if (hasil.data.data.length == 0) {
        return null
    }
    return hasil.data.data[0]
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
        return hasil.data.data
    }
    catch (error) {
        return null
    }
}
async function createPassword(nip) {
    let token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
    let config = {
        method: "POST",
        url: process.env.HOSTKHNZA + "/api/users/password/" + nip,
        headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
        }
    };
    try {
        let hasil = await axios(config)
        return hasil.data.data
    }
    catch (error) {
        return null
    }
}
async function cek(dep) {
let pegawi = await findUser(dep)
for (let i of pegawi) {
    let hasil = await find(i.nik)
    if (hasil == null) {
        // console.log("Tidak ada = " + i.nama)
    }
    else {
        console.log(i.nama)
        // console.log(hasil.nik + " = " + hasil.nama)
        let password = await findPassword(hasil.nik)
        // console.log(password)
        // await ubahhakakses(password.user)
        if (password == null) {
            console.log("Tidak ada password")
            // await createPassword(i.nik)
        }
    }
}
}
cek(41)
let fs = require('fs');
let hak_akses = fs.readFileSync('gizi.json', 'utf8');
 hak_akses = JSON.parse(hak_akses);
 console.log(hak_akses.length)
 let data = Object.keys(hak_akses);
 let vaule = Object.values(hak_akses);
 for (let i = 0; i < data.length; i++) {
    if (vaule[i] == "true") {
        console.log(data[i])
    }
 }


async function ubahhakakses(user){
let data = Object.keys(hak_akses);
let vaule = Object.values(hak_akses);
    for (let i = 0; i < data.length; i++) {
        if (vaule[i] == "true") {
            // console.log(data[i])
           await UbahAkses(user ,data[i] ,"true")
        }
        else if (vaule[i] == "false") {
            // console.log(data[i])
           await UbahAkses(user ,data[i] ,"false")
        }
    }
}
async function UbahAkses(nip ,hak ,state) {
    let token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
    let data = JSON.stringify({
        "hak": hak,
        "state": state
      });
    let config = {
        method: "PUT",
        url: process.env.HOSTKHNZA + "/api/users/hakases/" + nip,
        headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
        },
        data:data
    };
    try {
        let hasil = await axios(config)
        return hasil.data.data
    }
    catch (error) {
        return null
    }
}