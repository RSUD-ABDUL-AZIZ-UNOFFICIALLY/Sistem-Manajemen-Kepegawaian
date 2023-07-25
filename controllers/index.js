const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET_KEY;
const { User, Departemen, Atasan, Lpkp } = require("../models");
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
      title: "Profile | LPKP",
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
      title: "Dasboard | LPKP",
      page: "Daily Progress",
      token: decoded,
      datenow: datenow,
    };
    res.render("daily", data);
  },
  monthly: (req, res) => {
    let token = req.cookies.token;
    let decoded = jwt.verify(token, secretKey);
    let datey = new Date().toISOString().slice(0, 7);

    let data = {
      title: "Dasboard | LPKP",
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
      title: "Dasboard | LPKP",
      page: "Monthly Progress",
      token: decoded,
      user: getUser,
      departemen: departemen,
      date: datey
    };
    res.render("report", data);
  },
  approvement: async (req, res) => {
    let token = req.cookies.token;
    let decoded = jwt.verify(token, secretKey);
    let datey = new Date().toISOString().slice(0, 7);
    let data = {
      title: "approvement | LPKP",
      page: "Approvement",
      token: decoded,
      date: datey
    };
    res.render("approvement", data);
  },
  review: async (req, res) => {
    let token = req.cookies.token;
    let decoded = jwt.verify(token, secretKey);
    // convert query.periode to date and year
    let query
    try {
      let buff = new Buffer(req.query.user, 'base64');
      let text = buff.toString('ascii');
      query = JSON.parse(text);
    } catch (error) {
      return res.redirect("/");
    }
    let date = new Date(query.periode);
    let endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    let dateString = date.toLocaleString("default", {
      month: "long",
      year: "numeric",
    });
    let user = await User.findOne({
      where: {
        nik: query.nik,
      },
    });
    let lpkp = await Lpkp.findAll({
      where: {
        nik: query.nik,
        tgl: {
          [Op.startsWith]: query.periode,
        },
      },
    });
    let sumWaktu = 0;
    for (let i = 0; i < lpkp.length; i++) {
      sumWaktu += lpkp[i].waktu;
    }
    // IF(sumWaktu>7999;"BAIK";IF(sumWaktu>7379;"CUKUP";IF(sumWaktu>6719;"KURANG";IF(sumWaktu>0;"WKE MINIMAL TIDAK TERPENUHI";))))
    let kategori = "";
    if (sumWaktu > 7999) {
      kategori = "BAIK";
    } else if (sumWaktu > 7379) {
      kategori = "CUKUP";
    } else if (sumWaktu > 6719) {
      kategori = "KURANG";
    } else if (sumWaktu > 0) {
      kategori = "WKE MINIMAL TIDAK TERPENUHI";
    }
    // IF(F41>7999;"100%";IF(F41>7379;"90%";IF(F41>6719;"80%";IF(F41>0;"0%";))))
    let tpp = "";
    if (sumWaktu > 7999) {
      tpp = "100%";
    } else if (sumWaktu > 7379) {
      tpp = "90%";
    } else if (sumWaktu > 6719) {
      tpp = "80%";
    } else if (sumWaktu > 0) {
      tpp = "0%";
    }

    let data = {
      title: "Review | LPKP",
      page: "Review Activity",
      userpage: user.nama,
      periode: dateString,
      token: decoded,
      lpkp: lpkp,
      user: user,
      date: endDate,
      score: {
        total: sumWaktu,
        kategori: kategori,
        capaian: tpp
      }
    };
    res.render("review", data);
  },
  helpDesk: async (req, res) => {
    let token = req.cookies.token;
    let decoded = jwt.verify(token, secretKey);
    let getUser = await User.findOne({
      where: { nik: decoded.id },
      include: { model: Departemen, as: "departemen" },
    });
    let departemen = await Departemen.findAll({});
    let data = {
      title: "HelpDesk | LPKP",
      page: "Dukungan IT",
      token: decoded,
      user: getUser,
      departemen: departemen,
    };
    res.render("helpdesk", data);
  },
  helpDeskAdmin: async (req, res) => {
    let token = req.cookies.token;
    let decoded = jwt.verify(token, secretKey);
    let data = {
      title: "HelpDesk | LPKP",
      page: "Dukungan IT",
      token: decoded,
    };
    res.render("admin/helpdesk", data);
  },
};
