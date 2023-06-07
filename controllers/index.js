const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET_KEY;
const { User, Departemen, Atasan } = require("../models");
const { Op } = require("sequelize");

module.exports = {
  login: (req, res) => {
    let data = {
      title: "login | LKP",
    };
    res.render("login", data);
  },
  profile: async (req, res) => {
    let token = req.cookies.token;
    let decoded = jwt.verify(token, secretKey);
    let getUser = await User.findOne({
      where: { nik: decoded.id },
      include: { model: Departemen, as: "departemen" },
    });
    let departemen = await Departemen.findAll({});
    let atasan = await User.findAll({
      order: [
        ["nama", "ASC"],
      ],
      attributes: ["nik", "nama", "jab", "status"],
    });
    let bos = await Atasan.findOne({
      where: { user: getUser.nik },
    });
    if (!bos) {
      bos = "";
    } else {
      let namaBos = await User.findOne({
        where: { nik: bos.bos },
      });
      bos = namaBos.nama;
    }
    if (!getUser.dep) {
      getUser.dep = "";
      // push departemen in user
      getUser.departemen = {
        bidang: "-",
      };
    }
    let data = {
      title: "Profile | LKP",
      page: "Profile",
      token: decoded,
      user: getUser,
      departemen: departemen,
      atasan: atasan,
      bos: bos,
    };
    res.render("profile", data);
  },
  daily: (req, res) => {
    let token = req.cookies.token;
    let decoded = jwt.verify(token, secretKey);
    let datenow = new Date().toISOString().slice(0, 10);
    let data = {
      title: "Dasboard | LKP",
      page: "Daily Progress",
      token: decoded,
      datenow: datenow,
    };
    res.render("daily", data);
  },
  monthly: (req, res) => {
    let token = req.cookies.token;
    let decoded = jwt.verify(token, secretKey);
// datey yyyy mm
    let datey = new Date().toISOString().slice(0, 7);
    console.log(datey);
    let data = {
      title: "Dasboard | LKP",
      page: "Monthly Progress",
      token: decoded,
      date: datey
    };
    res.render("monthly", data);
  },
  report: async (req, res) => {
    let token = req.cookies.token;
    let decoded = jwt.verify(token, secretKey);
    let getUser = await User.findOne({
      where: { nik: decoded.id },
      include: { model: Departemen, as: "departemen" },
    });
    let departemen = await Departemen.findAll({});
    if (!getUser.dep) {
      return res.redirect("/profile");
    }
    let datey = new Date().toISOString().slice(0, 7);
    let data = {
      title: "Dasboard | LKP",
      page: "Monthly Progress",
      token: decoded,
      user: getUser,
      departemen: departemen,
      date: datey
    };
    res.render("report", data);
  },
};
