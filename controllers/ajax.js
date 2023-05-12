const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET_KEY;
const { User, Departemen, Atasan, Lpkp } = require("../models");
const { Op } = require("sequelize");
const { report } = require(".");
module.exports = {
  updateProfile: async (req, res) => {
    let body = req.body;
    console.log(body.nama);
    let token = req.cookies.token;
    let decoded = jwt.verify(token, secretKey);
    let user = await User.update(
      {
        nama: body.nama,
        dep: body.dep,
        jab: body.jab,
        tgl_lahir: body.tgl_lahir,
        nip: body.nip,
      },
      {
        where: {
          nik: decoded.id,
        },
      }
    );
    try {
      let atasan = await Atasan.update(
        {
          bos: body.atasan,
        },
        {
          where: {
            user: decoded.id,
          },
        }
      );
      if (atasan == 0) {
        await Atasan.create({
          user: decoded.id,
          bos: body.atasan,
        });
      }
    } catch (error) {
      
    }
    return res.status(200).json({
      error: false,
      message: body,
    });
  },
  progress: async (req, res) => {
    let token = req.cookies.token;
    let decoded = jwt.verify(token, secretKey);
    let body = req.body;
    await Lpkp.create({
      nik: decoded.id,
      rak: body.rak,
      tgl: body.tgl,
      volume: body.volume,
      satuan: body.satuan,
      waktu: body.waktu,
    });
    return res.status(200).json({
      error: false,
      message: "success",
    });
  },
  monthly: async (req, res) => {
    let token = req.cookies.token;
    let decoded = jwt.verify(token, secretKey);
   let queryparams= req.query;
   console.log(queryparams.date);

    let data = await Lpkp.findAll({
      where: {
        nik: decoded.id,
        tgl: {
          [Op.startsWith]: queryparams.date,
        },
      },
    });
    return res.status(200).json({
      error: false,
      message: queryparams,
      data: data,
    });
  },
  deleteLpkp: async (req, res) => {
    let token = req.cookies.token;
    let decoded = jwt.verify(token, secretKey);
    let body = req.query;
    await Lpkp.destroy({
      where: {
        id: body.id,
        nik: decoded.id,
      },
    });
    return res.status(200).json({
      error: false,
      message: "success",
    });
  },
};
