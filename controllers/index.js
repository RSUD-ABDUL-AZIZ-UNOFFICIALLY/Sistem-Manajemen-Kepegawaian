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
    let atasan = await User.findAll();
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
    console.log(atasan);
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
  dashboard: (req, res) => {
    let token = req.cookies.token;
    let decoded = jwt.verify(token, secretKey);
    let data = {
      title: "Dasboard | LKP",
      page: "Dashboard",
      token: decoded,
    };
    res.render("dashboard", data);
  },
  daily: (req, res) => {
    let token = req.cookies.token;
    let decoded = jwt.verify(token, secretKey);
    console.log(decoded);
    let data = {
      title: "Dasboard | LKP",
      page: "Daily Progress",

      token: decoded,
    };
    res.render("daily", data);
  },
  monthly: (req, res) => {
    let token = req.cookies.token;
    let decoded = jwt.verify(token, secretKey);
    let data = {
      title: "Dasboard | LKP",
      page: "Monthly Progress",
      token: decoded,
    };
    res.render("monthly", data);
  },
  report: (req, res) => {
    let token = req.cookies.token;
    let decoded = jwt.verify(token, secretKey);
    let data = {
      title: "Dasboard | LKP",
      page: "Monthly Progress",
      token: decoded,
    };
    res.render("report", data);
  },
};
