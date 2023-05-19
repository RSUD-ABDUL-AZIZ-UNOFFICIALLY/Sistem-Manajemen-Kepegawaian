const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET_KEY;
const { User, Departemen, Lpkp, Atasan } = require("../models");
const { Op } = require("sequelize");
const { convertdate } = require("../helper");

module.exports = {
  person: async (req, res) => {
    let token = req.cookies.token;
    let decoded = jwt.verify(token, secretKey);
    let query = req.query;
    // convert date to month name and year
    let dateString = new Date(query.date).toLocaleString("en-us", {
      month: "long",
      year: "numeric",
    });
    try {
      let user = await User.findOne({
        where: {
          nik: decoded.id,
        },
        include: [
          {
            model: Departemen,
            as: "departemen",
            
          },
        ],
      });
      let nik_atasan = await Atasan.findOne({
        where: {
          user: decoded.id,
        },
      });
      let atasan = await User.findOne({
        where: {
          nik: nik_atasan.bos,
        }
      })
      let progress = await Lpkp.findAll({
        where: {
          nik: decoded.id,
          tgl: {
            [Op.startsWith]: query.date,
          },
        },
        order: [["tgl", "ASC"]],
      });
      for (var i = 0; i < progress.length; i++) {
        var tanggalFormat = convertdate(progress[i].tgl);
        progress[i].tanggal = tanggalFormat;
        progress[i].no = i + 1;
      }
      let lpkp = await Lpkp.findAll({
        where: {
          nik: decoded.id,
          tgl: {
            [Op.startsWith]: query.date,
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
  // last date month
  let lastDate = new Date(query.date);
  lastDate.setMonth(lastDate.getMonth() + 1);
  lastDate.setDate(lastDate.getDate() - 1);
  lastDate = lastDate.toLocaleString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

      let data = {
        title: "Laporan Produktivitas Kerja Pegawai",
        user: user,
        periode: dateString,
        progress: progress,
        atasan: atasan,
        capaian: sumWaktu + " Menit",
        kategori: kategori,
        tpp: tpp,
        lastDate: lastDate,
      };
      return  res.render("report/person", data);
    } catch (error) {
      console.log(error);
      // return res.redirect("/profile");
    }
   
    
  },
};
