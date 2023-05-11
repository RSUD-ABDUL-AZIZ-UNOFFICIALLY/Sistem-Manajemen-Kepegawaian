const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET_KEY;
const { User, Departemen, Atasan } = require("../models");
const { Op } = require("sequelize");
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
      },
      {
        where: {
          nik: decoded.id,
        },
      }
    );
    let atasan = await Atasan.update(
      {
        bos: body.bos,
      },
      {
        where: {
          user: decoded.id,
        },
      }
    );
    if (atasan == 0) {
      atasan = await Atasan.create({
        user: decoded.id,
        bos: body.atasan,
      });
    }

    return res.status(200).json({
      error: false,
      message: body,
      user: user,
        atasan: atasan,
    });
  },
};
