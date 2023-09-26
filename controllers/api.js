const jwt = require("jsonwebtoken");
const axios = require("axios");
const { Otp, User } = require("../models");
const secretKey = process.env.SECRET_WA;
const payload = {
  gid: "Server Side",
};

module.exports = {
  sendOtp: async (req, res) => {
    try {
      let body = req.body;
      let token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
      let user = await User.findOne({
        where: {
          wa: body.phone,
        },
      });
      if (!user) {
        let data = JSON.stringify({
          message:
            "Maaf, nomor Anda tidak terdaftar di sistem kami. Silahkan hubungi IT RSUD dr. Abdul Aziz untuk mendaftar.",
          telp: body.phone,
        });
        let config = {
          method: "post",
          url: process.env.HOSTWA + "/api/wa/send",
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
          data: data,
        };
        console.log(config)
        // axios
        //   .request(config)
        //   .then((response) => {
       
        //   })
        //   .catch((error) => {
        //     console.log(error);
        //   });
        let kirimpsenan = await axios(config)
        console.log(kirimpsenan)
        return res.status(404).json({
          error: true,
          message: "Nomor Anda belum terdaftar di sistem kami",
        });
      }
      let jnsKel = (user.JnsKel == 'Laki-laki') ? 'Bapak ' : 'Ibu ';
      let otp = Math.floor(10000 + Math.random() * 90000);
      let data = JSON.stringify({
        message:
          "Halo " +
          jnsKel +
          " " +
          user.nama +
          "\n" +
          "Kode OTP anda adalah " +
          "*"+otp+"*" +
          "\n" +
          "Kode ini akan kadaluarsa dalam 5 menit.",
        telp: body.phone,
      });
      let config = {
        method: "post",
        url: process.env.HOSTWA + "/api/wa/send",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        data: data,
      };
      // axios
      //   .request(config)
      //   .then((response) => {
      //     console.log(JSON.stringify(response.data));
      //   })
      //   .catch((error) => {
      //     console.log(error);
      //   });
      let kirimpsenan = axios(config)

      await Otp.create({
        token: otp,
        wa: body.phone,
      });
      return res.status(200).json({
        error: false,
        message: "Silahkan cek whatsapp anda untuk mendapatkan kode OTP",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: true,
        message: error.message,
      });
    }
  },
  verifyOtp: async (req, res) => {
    let body = req.body;
    let checkOtp = await Otp.findOne({
      where: {
        token: body.otp,
        wa: body.phone,
      },
    });
    if (!checkOtp) {
      return res.status(401).json({
        error: true,
        message: "Invalid OTP",
      });
    }
    // waktu sekarang + 5 menit
    let now = new Date();
    let createdAt = new Date(checkOtp.createdAt); // Ganti dengan nilai yang sesuai dari createdAt
    let diff = (now.getTime() - createdAt.getTime()) / 1000; // Menghitung selisih waktu dalam detik
    if (diff < 300) {
    } else {
      return res.status(401).json({
        error: true,
        message: "OTP kedaluwarsa",
      });
    }
    let user = await User.findOne({
      where: {
        wa: body.phone,
      },
    });
    // create jwt
    let token = jwt.sign(
      {
        id: user.nik,
        nama: user.nama,
        wa: user.wa,
      },
      secretKey,
      { expiresIn: 60 * 60 * 24 * 7 }
    );
    // set cookie
    res.cookie("token", token, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: false,
    });
    return res.status(200).json({
      error: false,
      message: "Selamat datang, " + user.nama + "!",
    });
  },
};
