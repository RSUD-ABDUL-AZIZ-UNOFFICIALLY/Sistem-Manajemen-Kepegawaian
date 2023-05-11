const jwt = require("jsonwebtoken");
const axios = require("axios");
const { Otp, User } = require("../models");
const e = require("express");
const secretKey = process.env.JWT_SECRET_KEY;
const payload = {
  gid: "Server Side",
};

module.exports = {
  sendOtp: async (req, res) => {
    try {
      let body = req.body;
      let token = jwt.sign(payload, secretKey, { expiresIn: 60 });
      let user = await User.findOne({
        where: {
          wa: body.phone,
        },
      });
      if (!user) {
        let data = JSON.stringify({
          message:
            "Sorry, your number is not registered in our system. Please contact IT to register.",
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
        axios
          .request(config)
          .then((response) => {
            // console.log(JSON.stringify(response.data));
          })
          .catch((error) => {
            // console.log(error);
          });
        return res.status(404).json({
          error: true,
          message: "Your number has not been registered in our system",
        });
      }
      let otp = Math.floor(10000 + Math.random() * 90000);
      let data = JSON.stringify({
        message:
          "Hi " +
          user.nama +
          "\n" +
          "Kode OTP Anda adalah " +
          otp +
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
      axios
        .request(config)
        .then((response) => {
          console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
          console.log(error);
        });

      await Otp.create({
        token: otp,
        wa: body.phone,
      });
      return res.status(200).json({
        error: false,
        message: "Please check on your whatsapp.",
      });
    } catch (error) {
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
      console.log("createdAt lebih dari 5 menit yang lalu");
      return res.status(401).json({
        error: true,
        message: "OTP expired",
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
      // httpOnly: true,
    });
    return res.status(200).json({
      error: false,
      message: "welcome, " + user.nama + "",
    });
  },
};
