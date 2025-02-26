const jwt = require("jsonwebtoken");
const axios = require("axios");
const moment = require("moment");
const { Otp, User, Session, sequelize } = require("../models");
const { update } = require("./seen");
const secretKey = process.env.SECRET_WA;
const payload = {
  gid: "Server Side",
};
moment.locale('id'); 

module.exports = {
  sendOtp: async (req, res) => {
    try {
      let body = req.body;
      let checksttOtp = req.cookies.otp;
      console.log(checksttOtp);
      if (checksttOtp) {
        return res.status(401).json({
          error: true,
          message: "Silahkan Tunggu Sebentar ...",
        });
      }
      res.cookie("otp", body.phone, {
        secure: false,
        maxAge: 1000 * 60,
        httpOnly: false,
      });
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
        axios
          .request(config)
          .then((response) => {
       
          })
          .catch((error) => {
            console.log(error);
          });
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
    let t = await sequelize.transaction();
    let body = req.body;
    let checkOtp = await Otp.findOne({
      where: {
        token: body.otp,
        wa: body.phone,
      },
    }, { transaction: t });
    if (!checkOtp) {
      await t.rollback();
      return res.status(401).json({
        error: true,
        message: "Invalid OTP",
      });
    }
    // waktu sekarang + 5 menit
    let now = new Date();
    let createdAt = new Date(checkOtp.createdAt); // Ganti dengan nilai yang sesuai dari createdAt
    let diff = (now.getTime() - createdAt.getTime()) / 1000; // Menghitung selisih waktu dalam detik
    if (diff > 300) {
      return res.status(401).json({
        error: true,
        message: "OTP kedaluwarsa silahkan klik Minta OTP",
      });
    }
    let user = await User.findOne({
      where: {
        wa: body.phone,
      },
    }, { transaction: t });
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
      secure: true
    });
    Session.create({
      nik: user.nik,
      session_token: token,
      ip_address: req.headers['x-real-ip'],
      visited_id: req.cookies.visite,
      user_agent: req.headers['user-agent'] + '#' + req.headers['sec-ch-ua-platform'] + '#' + req.headers['sec-ch-ua'],
      status: "login"
    }, { transaction: t });
    await t.commit();
    return res.status(200).json({
      error: false,
      message: "Selamat datang, " + user.nama + "!",
    });
  },
  lastActivity: async (req, res) => {
    let user = req.account;
    try {
      let sessions = await Session.findAll({
        where: {
          nik: user.nik,
          status: 'online'
        },
        attributes: {
          exclude: ['session_token', 'id']
        },

        order: [["createdAt", "DESC"]],
      })
      console.log(sessions[0].user_agent.split('#')[1]);
      let userAgent = sessions[0].user_agent.split('#')[1]
      let dataSesi = [];
      for (let item of sessions) {
        dataSesi.push({
          ip_address: item.ip_address,
          visited_id: item.visited_id,
          user_agent: item.user_agent.split('#')[1],
          createdAt: moment(item.createdAt).format('DD MMM YYYY, HH:mm'),
          updateAt: moment(item.updatedAt, "YYYYMMDD").fromNow()
        })
      }
      return res.status(200).json({
        error: false,
        message: "success",
        data: dataSesi
      });

    } catch (error) {
      return res.status(501).json({
        error: true,
        message: error.message,
      });
    }
  },
  getUserSimrs: async (req, res) => {
    let token = req.cookies.token;
    let decoded = jwt.verify(token, secretKey);

    let Bearertoken = jwt.sign(payload, secretKey, { expiresIn: '1h' });
    try {
      let config = {
        method: "get",
        url: process.env.HOSTKHNZA + "/api/users/cari?search=" + decoded.id + "&limit=1",
        headers: {
          Authorization: "Bearer " + Bearertoken,
          "Content-Type": "application/json",
        },
      };
      let hasil = await axios(config);
      if (hasil.data.data.length === 0) {
        return res.status(401).json({
          error: true,
          message: "Anda belum terdaftar di sistem SIMRS",
        });
      }
      let configpass = {
        method: "get",
        url: process.env.HOSTKHNZA + "/api/users/password/" + hasil.data.data[0].nik,
        headers: {
          Authorization: "Bearer " + Bearertoken,
          "Content-Type": "application/json",
        },
      };
      try {
        let pass = await axios(configpass);
        return res.status(200).json({
          error: false,
          message: "Anda sudah terdaftar di sistem SIMRS",
          data: pass.data.data
        });

      } catch (err) {
        return res.status(401).json({
          error: true,
          message: "Akun anda belum memiliki password di SIMRS",
        });
      }
    } catch (error) {
      return res.status(500).json({
        error: false,
        message: error.message,
      });
    }
  },
  edtoken: async (req, res) => {
    let user = req.account
    try {
      return res.status(200).json({
        error: false,
        message: "success",
        data: user
      })

    } catch (error) {
      return res.status(500).json({
        error: false,
        message: error.message,
      });
    }
  }
 
};
