let fs = require('fs');
const axios = require('axios');
const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_KHNZA;
const payload = {
    gid: "Server Side",
};
let hak_akses = fs.readFileSync('PerawatInap.json', 'utf8');
hak_akses = JSON.parse(hak_akses);
let data = Object.keys(hak_akses);
let vaule = Object.values(hak_akses);
// for (let i = 0; i < data.length; i++) {
//     if (vaule[i] == "true") {
//         console.log(data[i])
//     }
// }
let nipUser = [
    "PRPIGD21",
]
async function update() {
    for (let i of nipUser) {
        console.log(i)  
        await ubahhakakses(i)
    }  
}
update()

async function ubahhakakses(user) {
    let data = Object.keys(hak_akses);
    let vaule = Object.values(hak_akses);
    for (let i = 0; i < data.length; i++) {
        if (vaule[i] == "true") {
            // console.log(data[i])
            await UbahAkses(user, data[i], "true")
        }
        else if (vaule[i] == "false") {
            // console.log(data[i])
            await UbahAkses(user, data[i], "false")
        }
    }
}
async function UbahAkses(nip, hak, state) {
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
        data: data
    };
    try {
        let hasil = await axios(config)
        return hasil.data.data
    }
    catch (error) {
        return null
    }
}