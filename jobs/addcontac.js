const { User, Profile } = require("../models");
const { Op } = require("sequelize");
const axios = require("axios");

async function getUser() {
  let user = await User.findAll({
    limit: 100,
    offset: 690,
    order: [["id", "ASC"]],
  });
  console.log(user.length);
  let count = 0;
  for (let i = 0; i < user.length; i++) {
    let profile = await Profile.findOne({
      where: {
        nik: user[i].nik,
      },
    });
    if (!profile) {
      user[i].nama = await updateNama(user[i].nama);
      count++;
      console.log(user[i].nama);
      await saveContak(user[i]);
    }
  }
  console.log(count);

  return ;
}
getUser();
async function saveContak(user) {
  let tgl = user.tgl_lahir.split("-");
  let data = {
    name: user.nama,
    phoneNumber: user.wa,
    email: user.email,
    organizations: {
      name: "RSUD dr. Abdul Aziz",
      title: user.jab,
    },
    birthdays: {
      day: tgl[2],
      month: tgl[1],
      year: tgl[0],
    },
    bio: "NIK : " + user.nik,
  };
  console.log(data);
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: process.env.HOSTCONTACT+"api/contact/",
    data: data,
  };

  let post = await axios.request(config);
  console.log(post.data.data);
  await Profile.create({
    nik: user.nik,
    url: post.data.data.photos[0].url,
  });
}

// mengubah format nama dan gelar
async function updateNama(nama) {
  // let nama = "FITHRI NUR'AINI, A.Md.,Far";
  // Membagi nama menjadi array kata-kata
  let kataKata = nama.split(" ");

  // Mengubah format huruf pada setiap kata
  for (let i = 0; i < kataKata.length; i++) {
    let kata = kataKata[i];
    let hurufPertama = kata.charAt(0).toUpperCase();
    let hurufSisa = kata.slice(1).toLowerCase();
    kataKata[i] = hurufPertama + hurufSisa;
  }

  // Menggabungkan kata-kata menjadi format nama yang diinginkan
  let formatNama = kataKata.join(" ");
  return formatNama;
}
// updateNama("FITHRI NUR'AINI, A.Md.Far");
// updateNama("OETARI DESTIANA, A.Md.Kep");
// updateNama("NURUL ALFIANI");
// OETARI DESTIANA, A.Md.Kep
