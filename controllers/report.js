const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET_KEY;
const { User, Departemen, Lpkp, Atasan, Cuti_approval, Cutialamat, Ledger_cuti, Cuti, Jns_cuti } = require("../models");
const { Op } = require("sequelize");
const { convertdate, toRoman } = require("../helper");

module.exports = {
  person: async (req, res) => {
    let token = req.cookies.token;
    let decoded = jwt.verify(token, secretKey);
    let query = req.query;
    // convert date to month name and year
    let dateString = new Date(query.date).toLocaleString("id-ID", {
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
  results: async (req, res) => {
    let token = req.cookies.token;
    let decoded = jwt.verify(token, secretKey);
    let query
    try {
      let buff = new Buffer(req.query.periode, 'base64');
      let text = buff.toString('ascii');
      query = JSON.parse(text);
    } catch (error) {
      return res.redirect("/");

    }

    // convert date to month name and year
    let dateString = new Date(query.periode).toLocaleString("id-ID", {
      month: "long",
      year: "numeric",
    });
    try {
      let user = await User.findOne({
        where: {
          nik: query.nik,
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
          user: query.nik,
        },
      });
      let atasan = await User.findOne({
        where: {
          nik: nik_atasan.bos,
        }
      })
      let progress = await Lpkp.findAll({
        where: {
          nik: query.nik,
          tgl: {
            [Op.startsWith]: query.periode,
          },
        },
        order: [["tgl", "ASC"]],
      });
      for (let i = 0; i < progress.length; i++) {
        let tanggalFormat = convertdate(progress[i].tgl);
        progress[i].tanggal = tanggalFormat;
        progress[i].no = i + 1;
      }
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
  // last date month
      let lastDate = new Date(query.periode);
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
      return res.render("report/results", data);
    } catch (error) {
      console.log(error);
    }
   
    
  },
  reportCuti: async (req, res) => {
    try {
      let regData = jwt.verify(req.query.token, secretKey);
      let dataCuti = await Cuti.findOne({
        where: {
          id: regData.cuti.id,
        },
        include: [
          {
            model: User,
            as: "user",
            attributes: ["nip", "nama", "jab", "wa"],
            include: [
              {
                model: Departemen,
                as: "departemen",
                attributes: ["bidang"],
              }
            ],
          },
          {
            model: Jns_cuti,
            as: "jenis_cuti",
            attributes: ["type_cuti"],
          },
          {
            model: Cuti_approval,
            as: "approval",
            // attributes: ["nik", "nama"],
            include: [
              {
                model: User,
                as: "atasan",
                attributes: ["nip", "nama"],
              },
            ],
          }
        ]
      })
      let alamatCuti = await Cutialamat.findOne({
        where: {
          id_cuti: dataCuti.id
        },
        attributes: ["alamat"],
      })

      let leagerTahunan = await Ledger_cuti.findAll({
        where: {
          nik_user: dataCuti.nik,
          id_cuti: { [Op.lt]: [dataCuti.id] },
          type_cuti: { [Op.in]: [1, 2, 3] },
        },
        order: [["createdAt", "DESC"]],
        include: [
          {
            model: Jns_cuti,
            as: "jenis_cuti",
            attributes: ["type_cuti"],
          },
        ],
        limit: 1
      })
      let Sisa_N = leagerTahunan.length > 0 ? leagerTahunan[0].sisa_cuti : 12;
      let leagerCutiBesar = await Ledger_cuti.findAll({
        where: {
          nik_user: dataCuti.nik,
          id_cuti: { [Op.lt]: [dataCuti.id] },
          type_cuti: { [Op.in]: [13] },
        }
      })
      let CutiBesar
      if (leagerCutiBesar.length > 0) {
        CutiBesar = leagerCutiBesar.reduce((acc, elm) => acc + elm.cuti_diambil, 0);
      } else {
        CutiBesar = 0
      }
      let leagerCutiPenting = await Ledger_cuti.findAll({
        where: {
          nik_user: dataCuti.nik,
          id_cuti: { [Op.lt]: [dataCuti.id] },
          type_cuti: { [Op.in]: [4, 5, 6] },
        }
      })
      let CutiPenting
      if (leagerCutiPenting.length > 0) {
        CutiPenting = leagerCutiPenting.reduce((acc, elm) => acc + elm.cuti_diambil, 0);
      } else {
        CutiPenting = 0
      }
      let leagerCutiSakit = await Ledger_cuti.findAll({
        where: {
          nik_user: dataCuti.nik,
          id_cuti: { [Op.lt]: [dataCuti.id] },
          type_cuti: { [Op.in]: [7, 8, 9] },
        }
      })
      let CutiSakit
      if (leagerCutiSakit.length > 0) {
        CutiSakit = leagerCutiSakit.reduce((acc, elm) => acc + elm.cuti_diambil, 0);
      } else {
        CutiSakit = 0
      }

      let leagerCutiMelahirkan = await Ledger_cuti.findAll({
        where: {
          nik_user: dataCuti.nik,
          id_cuti: { [Op.lt]: [dataCuti.id] },
          type_cuti: { [Op.in]: [10, 11, 12] },
        }
      })
      let CutiMelahirkan
      if (leagerCutiMelahirkan.length > 0) {
        CutiMelahirkan = leagerCutiMelahirkan.reduce((acc, elm) => acc + elm.cuti_diambil, 0);
      } else {
        CutiMelahirkan = 0
      }
      // console.log(dataCuti);

      // let month = new Date(leager.createdAt).toLocaleString("id-ID", {
      //   month: "numeric",
      // });
      // month = toRoman(parseInt(month));

      dataCuti.dataValues.mulai = new Date(dataCuti.mulai).toLocaleString("id-ID", {
        weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
      })

      dataCuti.dataValues.samapi = new Date(dataCuti.samapi).toLocaleString("id-ID", {
        weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
      })
      dataCuti.dataValues.createdAt = new Date(dataCuti.createdAt).toLocaleString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
      })
      let data = {
        dataCuti,
        status: dataCuti.approval.status.toUpperCase(),
        alamatCuti: alamatCuti ? alamatCuti.alamat : '-',
        Sisa_N: Sisa_N,
        CutiPenting: CutiPenting,
        CutiBesar: CutiBesar,
        CutiSakit: CutiSakit,
        CutiMelahirkan: CutiMelahirkan,
      }
      // console.log(data);
      if (dataCuti.approval.status == "Disetujui" || dataCuti.approval.status == "Ditolak" || dataCuti.approval.status == "Perubahan") {
        let sigrnature = `Telah di ${dataCuti.approval.status} oleh ${dataCuti.approval.atasan.nama}
NIP. ${dataCuti.approval.atasan.nip}
pada ${new Date(dataCuti.approval.approve_date).toLocaleString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
  hour: "numeric",
  minute: "numeric",
})}`;
        res.cookie('sigrnature', sigrnature, {
          // httpOnly: true,
          // secure: true,
          sameSite: 'strict',
          expires: new Date(Date.now() + 60 * 10000)
        })
      } else {
        res.cookie('sigrnature', '', {
          // httpOnly: true,
          // secure: true,
          sameSite: 'strict',
          expires: new Date(Date.now() + 60 * 10000)
        })
      }
      return res.render("report/suratCuti2", data);
    } catch (error) {
      console.log(error);
      // return res.redirect("/");
    }
  }
};
