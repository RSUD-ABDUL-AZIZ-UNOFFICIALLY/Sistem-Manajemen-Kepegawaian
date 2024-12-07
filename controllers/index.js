const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET_KEY;
const { User, Departemen, Atasan, Lpkp, Tiketgroup } = require("../models");
const { Op } = require("sequelize");

module.exports = {
  login: (req, res) => {
    let data = {
      title: "login | SIMPEG",
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
      title: "Profile | SIMPEG",
      page: "Profile",
      token: decoded,
      user: getUser,
      departemen: departemen,
      atasan: atasan,
      bos: bos,
    };
    res.render("profile", data);
  },
  account: async (req, res) => {
    let token = req.cookies.token;
    let decoded = jwt.verify(token, secretKey);
    let data = {
      title: "Akun Pegawai | SIMPEG",
      page: "Akun Pegawai",
      token: decoded,
    };
    res.render("account", data);
  },
  daily: (req, res) => {
    let token = req.cookies.token;
    let decoded = jwt.verify(token, secretKey);
    let datenow = new Date().toISOString().slice(0, 10);
    let data = {
      title: "Dasboard | SIMPEG",
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
      title: "Dasboard | SIMPEG",
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
      title: "Dasboard | SIMPEG",
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
      title: "approvement | SIMPEG",
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
    for (let i of lpkp) {
      sumWaktu += i.waktu;
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
      title: "Review | SIMPEG",
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

  cuti: (req, res) => {
    let token = req.cookies.token;
    let decoded = jwt.verify(token, secretKey);
    let datenow = new Date().toISOString().slice(0, 10);
    let data = {
      title: "Permohonan | SIMPEG",
      page: "Permohonan Cuti",
      token: decoded,
      datenow: datenow,
    };
    res.render("cuti", data);
  },
  approvalcuti: (req, res) => {
    let token = req.cookies.token;
    let decoded = jwt.verify(token, secretKey);
    let datenow = new Date().toISOString().slice(0, 10);
    let data = {
      title: "Approval | SIMPEG",
      page: "Approval Cuti",
      token: decoded,
      datenow: datenow,
    };
    res.render("approvalcuti", data);
  },
  adminCuti: (req, res) => {
    let token = req.cookies.token;
    let decoded = jwt.verify(token, secretKey);
    let datenow = new Date().toISOString().slice(0, 10);
    let data = {
      title: "Admin Cuti | SIMPEG",
      page: "Admin Cuti",
      token: decoded,
      datenow: datenow,
    };
    res.render("admin/admincuti", data);
  },
  leagercuti: (req, res) => {
    let token = req.cookies.token;
    let decoded = jwt.verify(token, secretKey);
    let datenow = new Date().toISOString().slice(0, 10);
    let data = {
      title: "Admin Cuti | SIMPEG",
      page: "Admin Cuti",
      token: decoded,
      datenow: datenow,
    };
    res.render("admin/leagercuti", data);
  },
  helpDesk: async (req, res) => {
    let token = req.cookies.token;
    let decoded = jwt.verify(token, secretKey);
    let getUser = await User.findOne({
      where: { nik: decoded.id },
      include: { model: Departemen, as: "departemen" },
    });
    try {
    let departemen = await Departemen.findAll({});
      let addgrubtiket = await Tiketgroup.findAll({});
      console.log(addgrubtiket);
    let data = {
      title: "HelpDesk | SIMPEG",
      page: "Dukungan IT",
      token: decoded,
      user: getUser,
      departemen: departemen,
      addgrubtiket

    };
    res.render("helpdesk", data);
    }
    catch (err) {
      console.log(err);
      res.render("error", { title: "Error", page: "Error", error: err });
    }
  },
  helpDeskAdmin: async (req, res) => {
    let token = req.cookies.token;
    let decoded = jwt.verify(token, secretKey);
    let data = {
      title: "HelpDesk | SIMPEG",
      page: "Dukungan IT",
      token: decoded,
    };
    res.render("admin/helpdesk", data);
  },
  getContact: async (req, res) => {
    let token = req.cookies.token;
    let decoded = jwt.verify(token, secretKey);
    let data = {
      title: "Contact | SIMPEG",
      page: "Contact",
      token: decoded,
    };
    res.render("contact", data);
  },
  addAnggotaPasien: async (req, res) => {
    let token = req.cookies.token;
    let decoded = jwt.verify(token, secretKey);
    let data = {
      title: "Contact | SIMPEG",
      page: "Contact",
      token: decoded,
    };
    res.render("simrs/addAnggotaPasien", data);
  },
  presensi: async (req, res) => {
    let token = req.cookies.token;
    let decoded = jwt.verify(token, secretKey);
    let data = {
      title: "presensi | SIMPEG",
      page: "Jadwal Presensi",
      token: decoded,
    };
    res.render("presensi/jadwal", data);
  },
  absensi: async (req, res) => {
    let token = req.cookies.token;
    let decoded = jwt.verify(token, secretKey);
    let data = {
      title: "presensi | SIMPEG",
      page: "Absensi",
      token: decoded,
    };
    res.render("presensi/absen", data);
  }
};
