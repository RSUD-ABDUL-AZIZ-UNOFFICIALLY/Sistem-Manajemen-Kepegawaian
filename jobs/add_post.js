const { User, Profile } = require("../models");
const { Op, where } = require("sequelize");
const axios = require("axios");

async function getUser() {
  let allUsers = await User.findAll({
    include: { model: Profile, as: "profile", attributes: ["url"] },
    attributes: ["nik", "nama"],
    order: [["id", "ASC"]],
    // limit: 100,
    // offset: 850,
  });
  let Belum =[];
  console.log(allUsers[0]);
  for (let user of allUsers) {
      console.log(user.nama);
    let body = {
      username: user.nama,
      name : user.nama,
      UrlImage: user.profile.url,
      nik: user.nik,
    };
    console.log(body);
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "http://localhost:3000/api/user/create",
      headers: {
        "Content-Type": "application/json",
      },
      data: body,
    };
    try {
        let post = await axios.request(config);
        console.log(post.data);
        if (post.data.message == "wajah tidak ditemukan") {
            Belum.push(body);
        }
    } catch (error) {
        // console.log(error);
    }
   
  }
  console.log(Belum);
  return;
}
getUser();
