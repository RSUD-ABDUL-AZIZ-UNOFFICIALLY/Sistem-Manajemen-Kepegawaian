"use strict";
const { sendWa } = require('./helper/message.js')
const { User, Profile, Atasan } = require("./models");
const { Op } = require("sequelize");

async function findUser(status, dep) {
    let users = await User.findAll({
        where: {
            status: status,
            dep: dep
        },
        attributes: ['nama', 'wa', 'tgl_lahir', 'dep', 'jab', 'JnsKel'],
    })
    users.forEach(async element => {
        console.log(element.nama + ' ' + element.JnsKel + ' ' + element.jab)
        let data = JSON.stringify({
            message: pesan1(element.nama, element.wa, element.JnsKel),
            telp: element.wa
        });
        console.log(data)
        // await sendWa(data);
    });
    console.log(users.length)
    return;
}
async function findSubmitUser() {
    let atasan = await Atasan.findAll();
    console.log(atasan.length)
    atasan.forEach(element => {
        console.log(element.user)
    });
}
findSubmitUser()
// findUser('PNS', null)
async function findUserHBD() {
    let date = new Date();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let today = `${month}-${day}`;
    let age
    let users = await User.findAll({
        where: {
            tgl_lahir: {
                [Op.endsWith]: `${today}`
            }
        },
        attributes: ['nama', 'wa', 'tgl_lahir', 'dep', 'jab'],
    })
    console.log(today);

    users.forEach(async element => {
        console.log(element.nama + ' ' + element.dep + ' ' + element.jab)
        let birthday = new Date(element.tgl_lahir);
        let year = 0;
        if (date.getMonth() < birthday.getMonth()) {
            year = 1;
        } else if (
            date.getMonth() == birthday.getMonth() &&
            date.getDate() < birthday.getDate()
        ) {
            year = 1;
        }
        age = date.getFullYear() - birthday.getFullYear() - year;
        console.log(age);
        // let data = JSON.stringify({
        //     message: pesanHBD(element.nama, element.wa, element.JnsKel),
        //     telp: element.wa
        // });
        // await sendWa(data);
    });
    console.log(users.length)
    return;
}
// console.log(findUserHBD())
function pesan1(nama, nomorWhatsApp, JnsKel) {
    let jenis = JnsKel == 'Laki-laki' ? 'Bapak' : 'Ibu';
    let pesan = "Salam hormat " + jenis + " " + nama + ",\n\n" +
        "Mohon untuk segera mengisi Laporan Kinerja Karyawan RSUD dr. Abdul Aziz Singkawang melalui link berikut: \n" +
        "https://cctv.rsudaa.singkawangkota.go.id/. \n" +
        "Catatan: Untuk login ke akun tersebut, gunakan nomor WhatsApp pribadi Anda yaitu " + nomorWhatsApp + ".\n\n" +
        "Terima kasih atas perhatian dan kerjasamanya.\n";
    return pesan;
}

function pesanHBD(nama, age) {
    let pesan = `Selamat Ulang Tahun yang ke-${age}!
${nama}
Semoga penuh berkah, diberikan kesehatan yang baik, dimurahkan rezeki dan dianugerahi rahmat berlimpah.
Semoga hari ini semanis dirimu

Ttd,
Direktur RSUD dr. ABDUL AZIZ KOTA SINGKAWANG

dr. Achmad Hardin, Sp. PD`
    return pesan;
}

// console.log(pesan1('fakhry', '0895321701798', 'Laki-laki'))
