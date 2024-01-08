const { User, Profile } = require("./models");
const { Op } = require("sequelize");
const cron = require('node-cron');
const jwt = require("jsonwebtoken");
const axios = require("axios");
const secretKey = process.env.SECRET_WA;
const payload = {
  gid: "Server Side",
};

async function getHbd(date) {
    let data = await User.findAll({
        where: {
            tgl_lahir: {
                [Op.endsWith]: `${date}`
            }
        },
        attributes: ['nama', 'wa', 'tgl_lahir', 'dep', 'jab'],
    })
    // console.log(data[0].nama);
    let token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
    for (let i = 0; i < data.length; i++) {
        console.log(i)
        console.log(data[i].nama)
        let nama = data[i].nama;
        let wa = data[i].wa;
        let tgl_lahir = data[i].tgl_lahir;

        let today = new Date();
        let birthday = new Date(tgl_lahir);
        let year = 0;
        if (today.getMonth() < birthday.getMonth()) {
            year = 1;
        } else if (
            today.getMonth() == birthday.getMonth() &&
            today.getDate() < birthday.getDate()
        ) {
            year = 1;
        }
        let age = today.getFullYear() - birthday.getFullYear() - year;
        console.log(age);
        let send = JSON.stringify({
            message: `Selamat Ulang Tahun yang ke-${age}!
${nama}
Semoga penuh berkah, diberikan kesehatan yang baik, dimurahkan rezeki dan dianugerahi rahmat berlimpah.
Semoga hari ini semanis dirimu

Ttd,
Direktur RSUD dr. ABDUL AZIZ KOTA SINGKAWANG

dr. Achmad Hardin, Sp. PD`,
            telp: `${wa}`,
        });
          console.log(send);
        let config = {
            method: "post",
            url: process.env.HOSTWA2 + "/api/wa/send",
            headers: {
              Authorization: "Bearer " + token,
              "Content-Type": "application/json",
            },
            data: send,
          };
          console.log(config);
        await  axios
            .request(config)
            .then((response) => {
              console.log(JSON.stringify(response.data));
            })
            .catch((error) => {
              console.log(error);
            });
    }
   
}
// let onlyDate = new Date().toISOString().slice(0, 10);
// let date = onlyDate.slice(5, 10);
// console.log(date);
// getHbd(date);
// getHbd(date);

cron.schedule('0 9 * * *', () => {
    // Kode yang akan dijalankan setiap jam 6 pagi
    console.log('Cron job berjalan pada jam 6 pagi!');
    let onlyDate = new Date().toISOString().slice(0, 10);
    let date = onlyDate.slice(5, 10);
    console.log(date);
    getHbd(date);
  });

async function kalibarsiKamar() {
  let token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'https://api.rsudaa.singkawangkota.go.id/api/ranap/belumpulang',
    headers: {
      'Authorization': 'Bearer ' + token,
    }
  };

  axios.request(config)
    .then((response) => {
      console.log('kalibarsiKamar');
      // console.log(JSON.stringify(response.data));
    })
    .catch((error) => {
      console.log(error);
    });
}
kalibarsiKamar();

cron.schedule('*/30 * * * *', () => {
  // Kode yang akan dijalankan setiap jam 6 pagi
  console.log('Cron job berjalan tiap 15 menit!');
  kalibarsiKamar();
});