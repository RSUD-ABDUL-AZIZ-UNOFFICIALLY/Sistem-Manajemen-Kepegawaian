"use strict";
const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET_KEY;
const {
  User,
  Biodatas,
  Atasan,
  Lpkp,
  Rekap,
  Aprovement,
  Template,
  Departemen,
  Profile,
  Jns_cuti,
  Cuti,
  Cutialamat,
  Ledger_cuti,
  sequelize,
  Cuti_approval,
  Cuti_lampiran,
  Access,
  Hotspot,
  Instalasi
} = require("../models");
const { Op, or } = require("sequelize");
const fs = require("fs");
const { convertdate, convertdatetime } = require("../helper");
const { uploadImage } = require("../helper/upload");
const { sendWa, sendGrub } = require("../helper/message");
module.exports = {
  updateProfile: async (req, res) => {
    let body = req.body;
    let token = req.cookies.token;
    let decoded = jwt.verify(token, secretKey);
    try {
      await User.update(
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
    } catch (error) {
      // show error update data
      return res.status(400).json({
        error: true,
        message: "data tidak valid",
      });
    }

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
    } catch (error) {}
    return res.status(200).json({
      error: false,
      message: body,
    });
  },
  updateBiodata: async (req, res) => {
    try {
      let body = req.body;
      let token = req.cookies.token;
      let decoded = jwt.verify(token, secretKey);

      if (body.tmt_pangkat == "") {
        body.tmt_pangkat = null;
      }
      if (body.tmt_kerja == "") {
        body.tmt_kerja = null;
      }
      let updateBio = await Biodatas.update(body, {
        where: {
          nik: decoded.id,
        },
      });

      // validasi jika data tidak valid
      if (updateBio[0] == 0) {
        updateBio = await Biodatas.create({
          nik: decoded.id,
          ...body,
        });
      }
      return res.status(200).json({
        error: false,
        message: updateBio,
      });
    } catch (error) {
      console.error(error);
      return res.status(400).json({
        error: false,
        message: "error",
        data: error.message,
      });
    }
  },
  getBiodata: async (req, res) => {
    let token = req.cookies.token;
    let decoded = jwt.verify(token, secretKey);
    try {
      let data = await Biodatas.findOne({
        where: {
          nik: decoded.id,
        },
      });
      if (data == null) {
        return res.status(404).json({
          error: true,
          message: "biodata tidak ada",
        });
      }
      return res.status(200).json({
        error: false,
        message: "success",
        data: data,
      });
    } catch (error) {
      return res.status(500).json({
        error: true,
        message: "error",
        data: error,
      });
    }
  },
  getPic: async (req, res) => {
    try {
      const token = req.cookies.token;
      const secretKey = process.env.JWT_SECRET_KEY;
      const decoded = jwt.verify(token, secretKey);
      let getFoto = await Profile.findOne({
        attributes: ["url"],
        where: {
          nik: decoded.id,
        },
      });
      if (!getFoto) {
        return res.status(204).json({
          error: false,
          message: "success",
          data: null,
        });
      }
      return res.status(200).json({
        error: false,
        message: "success",
        data: getFoto,
      });

    } catch (error) {
      console.log(error);
      return res.status(400).json({
        error: true,
        message: "error",
        data: error.message,
      });
    }
  },
  postPic: async (req, res) => {
    let token = req.cookies.token;
    let decoded = jwt.verify(token, secretKey);
    try {
      // get path file
      let path = req.file.path;
      // get base64
      let dataUpload = await uploadImage(path);
      console.log(dataUpload.data.url);
      // update data
      let profil = await Profile.update(
        {
          url: dataUpload.data.url,
        },
        {
          where: {
            nik: decoded.id,
          },
        }
      );
      fs.unlinkSync(path);
      return res.status(200).json({
        error: false,
        message: "success",
        data: dataUpload,
        profil: profil,
      });
    } catch (error) {
      console.error(error);
      return res.status(400).json({
        error: true,
        message: "error",
        data: error.message,
      });
    }
  },
  getAnggota: async (req, res) => {
    try {
      let token = req.cookies.token;
      let decoded = jwt.verify(token, secretKey);
      let data = await Atasan.findAll({
        include: [
          {
            model: User,
            as: "bio",
          },
        ],
        where: {
          bos: decoded.id,
        },
        attributes: ["user"],
      });
      return res.status(200).json({
        error: false,
        message: "success",
        data: data,
      });
    } catch (error) {}
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
    let date = body.tgl.split("-");
    let ket = date[0] + date[1] + decoded.id;
    try {
      let id = await Rekap.destroy({
        where: {
          ket: ket,
        },
      });
      let findApprove = await Aprovement.findOne({
        where: {
          nik: decoded.id,
          tglberkas: {
            [Op.startsWith]: date[0] + "-" + date[1],
          },
          status_aprove: "true",
        },
      });
      if (findApprove != null) {
        await Aprovement.update(
          {
            status_aprove: "false",
          },
          {
            where: {
              id: findApprove.id,
            },
          }
        );
      }
    } catch (error) {
      console.log(error);
    }
    return res.status(200).json({
      error: false,
      message: "success",
    });
  },
  monthly: async (req, res) => {
    let token = req.cookies.token;
    let decoded = jwt.verify(token, secretKey);
    let queryparams = req.query;

    let data = await Lpkp.findAll({
      where: {
        nik: decoded.id,
        tgl: {
          [Op.startsWith]: queryparams.date,
        },
      },
      order: [["tgl", "ASC"]],
    });
    return res.status(200).json({
      error: false,
      message: queryparams,
      data: data,
    });
  },
  getScore: async (req, res) => {
    let token = req.cookies.token;
    let decoded = jwt.verify(token, secretKey);
    let queryparams = req.query;

    let data = await Lpkp.findAll({
      where: {
        nik: decoded.id,
        tgl: {
          [Op.startsWith]: queryparams.date,
        },
      },
    });

    let sumWaktu = 0;
    for (let i = 0; i < data.length; i++) {
      sumWaktu += data[i].waktu;
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

    return res.status(200).json({
      error: false,
      message: "success",
      data: {
        capaian: sumWaktu,
        kategori: kategori,
        tpp: tpp,
      },
    });
  },
  deleteActivity: async (req, res) => {
    let token = req.cookies.token;
    let decoded = jwt.verify(token, secretKey);
    let body = req.query;
    let getLpkp = await Lpkp.findOne({
      where: {
        id: body.id,
        nik: decoded.id,
      },
    });
    try {
      let date = getLpkp.tgl.split("-");
      let ket = date[0] + date[1] + decoded.id;
      let id = await Rekap.destroy({
        where: {
          ket: ket,
        },
      });
      let findApprove = await Aprovement.findOne({
        where: {
          nik: decoded.id,
          tglberkas: {
            [Op.startsWith]: date[0] + "-" + date[1],
          },
          status_aprove: "true",
        },
      });
      if (findApprove != null) {
        await Aprovement.update(
          {
            status_aprove: "false",
          },
          {
            where: {
              id: findApprove.id,
            },
          }
        );
      }
    } catch (error) {
      console.log(error);
    }
    let delLpkp = await Lpkp.destroy({
      where: {
        id: body.id,
        nik: decoded.id,
      },
    });
    if (delLpkp == 0) {
      return res.status(204).json({
        error: true,
        message: "data not found",
        data: delLpkp,
      });
    }
    console.log(delLpkp);
    return res.status(200).json({
      error: false,
      message: "success",
      data: delLpkp,
    });
  },
  createReport: async (req, res) => {
    let token = req.cookies.token;
    let decoded = jwt.verify(token, secretKey);
    let body = req.body;
    let periode = body.monthly;
    let formattedDate = periode.replace("-", ""); // Menghapus tanda hubung (-)
    let ket = formattedDate + decoded.id;
    var dateParts = periode.split("-");
    var year = parseInt(dateParts[0]);
    var month = parseInt(dateParts[1]) - 1; // Mengurangi 1 karena indeks bulan dimulai dari 0

    var lastDay = new Date(year, month + 1, 0).getDate();
    var periodedate = periode + "-" + lastDay;

    let data = await Lpkp.findAll({
      where: {
        nik: decoded.id,
        tgl: {
          [Op.startsWith]: periode,
        },
      },
    });

    let sumWaktu = 0;
    for (let i = 0; i < data.length; i++) {
      sumWaktu += data[i].waktu;
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
    let tpp = 0;
    if (sumWaktu > 7999) {
      tpp = 100;
    } else if (sumWaktu > 7379) {
      tpp = 90;
    } else if (sumWaktu > 6719) {
      tpp = 80;
    } else if (sumWaktu > 0) {
      tpp = 0;
    }
    let pesan = "";
    try {
      let id = await Rekap.findOne({
        where: {
          ket: ket,
        },
      });
      console.log(id);
      if (id == null) {
        let user = await User.findOne({
          where: {
            nik: decoded.id,
          },
        });
        let dep = await Departemen.findOne({
          where: {
            id: user.dep,
          },
        });
        await Rekap.create({
          nik: decoded.id,
          capaian: sumWaktu,
          kategori: kategori,
          tpp: tpp,
          ket: ket,
          periode: periodedate,
          dep: dep.bidang,
          jab: user.jab,
        });
        pesan = "Progress saved successfully";
      } else {
        await Rekap.update(
          {
            capaian: sumWaktu,
            kategori: kategori,
            tpp: tpp,
          },
          {
            where: {
              ket: ket,
              nik: decoded.id,
            },
          }
        );
        pesan = "Progress updated successfully";
      }
    } catch (error) {
      // Jika terjadi kesalahan, rollback transaksi
      console.error("Transaksi gagal:", error);
    }
    return res.status(200).json({
      error: false,
      message: "success",
      data: pesan,
    });
  },
  getReport: async (req, res) => {
    let token = req.cookies.token;
    let decoded = jwt.verify(token, secretKey);
    let queryparams = req.query;
    let PNS = queryparams.satusPNS == "true" ? "PNS" : "";
    let PPPK = queryparams.satusPPPK == "true" ? "PPPK" : "";
    let NonASN = queryparams.satusNonASN == "true" ? "Non ASN" : "";
    try {
      let getUser = await User.findAll({
        where: {
          [Op.and]: [
            { dep: queryparams.dep },
            {
              [Op.or]: [{ status: NonASN }, { status: PPPK }, { status: PNS }],
            },
          ],
        },
        attributes: ["nik", "nama", "nip", "jab", "status"],
        order: [["nama", "ASC"]],
      });
      let data = [];
      for (let i = 0; i < getUser.length; i++) {
        let getfind = await Rekap.findOne({
          where: {
            nik: getUser[i].nik,
            periode: {
              [Op.startsWith]: queryparams.date,
            },
          },
        });
        getUser[i].state = 0;
        let pushData;
        if (getfind == null) {
          pushData = {
            nik: getUser[i].nik,
            nama: getUser[i].nama,
            nip: getUser[i].nip,
            jab: getUser[i].jab,
            status: getUser[i].status,
            capaian: 0,
            kategori: "",
            tpp: 0,
            periode: "",
            state: 0,
          };
        } else {
          let approve = await Aprovement.findOne({
            where: {
              nik: getUser[i].nik,
              tglberkas: {
                [Op.startsWith]: queryparams.date,
              },
              status_aprove: "true",
            },
            order: [
              // Will escape title and validate DESC against a list of valid direction parameters
              ["createdAt", "DESC"],
            ],
          });
          let findBos;
          if (approve != null) {
            findBos = await User.findOne({
              where: {
                nik: approve.bos,
              },
              attributes: ["nama", "nip", "jab"],
            });
          }
          pushData = {
            nik: getUser[i].nik,
            nama: getUser[i].nama,
            nip: getUser[i].nip,
            jab: getUser[i].jab,
            status: getUser[i].status,
            capaian: getfind.capaian,
            kategori: getfind.kategori,
            tpp: getfind.tpp,
            periode: getfind.periode,
            state: approve == null ? 1 : 2,
            bos: findBos,
          };
        }
        data.push(pushData);
      }
      return res.status(200).json({
        error: false,
        message: "success",
        data: data,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: true,
        message: error.message,
      });
    }
  },
  getActivity: async (req, res) => {
    let token = req.cookies.token;
    let decoded = jwt.verify(token, secretKey);
    let queryparams = req.query;
    try {
      let data = await Lpkp.findOne({
        where: {
          nik: decoded.id,
          id: queryparams.id,
        },
      });
      return res.status(200).json({
        error: false,
        message: "success",
        data: data,
      });
    } catch (error) {
      return res.status(500).json({
        error: true,
        message: "error",
        data: error,
      });
    }
  },
  updateActivity: async (req, res) => {
    let token = req.cookies.token;
    let decoded = jwt.verify(token, secretKey);
    let body = req.body;
    try {
      await Lpkp.update(
        {
          rak: body.rak,
          tgl: body.tgl,
          volume: body.volume,
          satuan: body.satuan,
          waktu: body.waktu,
        },
        {
          where: {
            nik: decoded.id,
            id: body.id,
          },
        }
      );
      let date = body.tgl.split("-");
      let ket = date[0] + date[1] + decoded.id;
      try {
        let id = await Rekap.destroy({
          where: {
            ket: ket,
          },
        });
        let findApprove = await Aprovement.findOne({
          where: {
            nik: decoded.id,
            tglberkas: {
              [Op.startsWith]: date[0] + "-" + date[1],
            },
            status_aprove: "true",
          },
        });
        if (findApprove != null) {
          await Aprovement.update(
            {
              status_aprove: "false",
            },
            {
              where: {
                id: findApprove.id,
              },
            }
          );
        }
      } catch (error) {
        console.log(error);
      }
      return res.status(200).json({
        error: false,
        message: "success",
      });
    } catch (error) {
      return res.status(500).json({
        error: true,
        message: "error",
        data: error,
      });
    }
  },
  getApprovement: async (req, res) => {
    let token = req.cookies.token;
    let decoded = jwt.verify(token, secretKey);
    let queryparams = req.query;
    let getAnggota = await Atasan.findAll({
      where: {
        bos: decoded.id,
      },
    });
    let data = [];
    for (let i = 0; i < getAnggota.length; i++) {
      let getfind = await Rekap.findOne({
        where: {
          nik: getAnggota[i].user,
          periode: {
            [Op.startsWith]: queryparams.periode,
          },
        },
      });
      let getUser = await User.findOne({
        where: {
          nik: getAnggota[i].user,
        },
      });
      if (getfind != null) {
        let getApprovement = await Aprovement.findOne({
          where: {
            nik: getAnggota[i].user,
            tglberkas: {
              [Op.startsWith]: queryparams.periode,
            },
            status_aprove: "true",
          },
        });
        data.push({
          nik: getAnggota[i].user,
          nama: getUser.nama,
          nip: getUser.nip,
          jab: getUser.jab,
          status: getUser.status,
          capaian: getfind.capaian,
          kategori: getfind.kategori,
          tpp: getfind.tpp,
          periode: getfind.periode,
          state: 1,
          aprovement: getApprovement,
        });
      } else {
        data.push({
          nik: getAnggota[i].user,
          nama: getUser.nama,
          nip: getUser.nip,
          jab: getUser.jab,
          status: getUser.status,
          capaian: 0,
          kategori: "",
          tpp: 0,
          periode: "",
          state: 0,
        });
      }
    }
    return res.status(200).json({
      error: false,
      message: "success",
      data: data,
    });
  },
  getSignaute: async (req, res) => {
    let token = req.cookies.token;
    let decoded = jwt.verify(token, secretKey);
    let queryparams = req.query;
    let user, stausUser, aprovUser, atasan, stausAtasan, aprovAtasan;
    try {
      let UserSign = await Rekap.findOne({
        where: {
          nik: queryparams.nik,
          periode: {
            [Op.startsWith]: queryparams.periode,
          },
        },
      });
      if (UserSign == null) {
        stausUser = 0;
      } else {
        stausUser = 1;
        user = await User.findOne({
          where: {
            nik: queryparams.nik,
          },
          attributes: ["nama", "nip", "jab"],
        });
        aprovUser = convertdatetime(UserSign.createdAt);
      }
      let AtasanSign = await Aprovement.findOne({
        where: {
          nik: queryparams.nik,
          tglberkas: {
            [Op.startsWith]: queryparams.periode,
          },
          status_aprove: "true",
        },
      });
      if (AtasanSign == null) {
        stausAtasan = 0;
      } else {
        if (AtasanSign.status_aprove == "true") {
          stausAtasan = 1;
          let bos = await User.findOne({
            where: {
              nik: AtasanSign.bos,
            },
            attributes: ["nama", "nip", "jab"],
          });
          atasan = bos;
          aprovAtasan = convertdatetime(AtasanSign.updatedAt);
        } else {
          stausAtasan = 0;
        }
      }
      let data = {
        stausUser: stausUser,
        aprovUser: {
          user: user,
          date: aprovUser,
        },
        stausAtasan: stausAtasan,
        aprovAtasan: {
          atasan: atasan,
          date: aprovAtasan,
        },
      };

      return res.status(200).json({
        error: false,
        message: "success",
        data: data,
      });
    } catch (error) {
      return res.status(500).json({
        error: true,
        message: "error",
        data: error,
      });
    }
  },
  signature: async (req, res) => {
    let token = req.cookies.token;
    let decoded = jwt.verify(token, secretKey);
    let body = req.body;
    try {
      let Approve = await Aprovement.create({
        nik: body.nik,
        bos: decoded.id,
        tglberkas: body.periode,
        status_aprove: body.status,
      });
      return res.status(200).json({
        error: false,
        message: "success",
        data: Approve,
      });
    } catch (error) {
      return res.status(500).json({
        error: true,
        message: "error",
        data: error,
      });
    }
  },
  createTemplate: async (req, res) => {
    let token = req.cookies.token;
    let decoded = jwt.verify(token, secretKey);
    let body = req.body;
    if (body.kegiatan == "") {
      return res.status(400).json({
        error: true,
        message: "Kegiatan tidak boleh kosong",
      });
    }
    try {
      body.nik = decoded.id;
      console.log(body);
      let addTemplate = await Template.create(body);
      return res.status(200).json({
        error: false,
        message: "success",
        data: {
          template: addTemplate,
          title: "Templat berhasil disimpan",
        },
      });
    } catch (error) {
      // console.log(error);
      return res.status(400).json({
        error: true,
        message: "error",
        data: error,
      });
    }
  },
  getTemplate: async (req, res) => {
    let token = req.cookies.token;
    let decoded = jwt.verify(token, secretKey);
    let query = req.query;
    if (query.id == undefined) {
      try {
        let getTemplate = await Template.findAll({
          where: {
            nik: decoded.id,
          },
        });
        return res.status(200).json({
          error: false,
          message: "success",
          data: {
            nama: decoded.nama,
            template: getTemplate,
          },
        });
      } catch (error) {
        return res.status(500).json({
          error: true,
          message: "error",
          data: error,
        });
      }
    } else {
      try {
        let getTemplate = await Template.findOne({
          where: {
            nik: decoded.id,
            id: query.id,
          },
        });
        return res.status(200).json({
          error: false,
          message: "success",
          data: getTemplate,
        });
      } catch (error) {
        return res.status(500).json({
          error: true,
          message: "error",
          data: error,
        });
      }
    }
  },
  deleteTemplate: async (req, res) => {
    let token = req.cookies.token;
    let decoded = jwt.verify(token, secretKey);
    let body = req.query;
    try {
      let deleteTemplate = await Template.destroy({
        where: {
          nik: decoded.id,
          id: body.id,
        },
      });
      return res.status(200).json({
        error: false,
        message: "success",
        data: deleteTemplate,
      });
    } catch (error) {
      return res.status(500).json({
        error: true,
        message: "error",
        data: error,
      });
    }
  },
  getJns_cuti: async (req, res) => {
    let token = req.cookies.token;
    let decoded = jwt.verify(token, secretKey);
    let { status, nik } = req.query;
    console.log(status);
    if (status != undefined) {
      let getJenisCuti = await Jns_cuti.findAll({
        where: {
          status: status,
        },
      });
      let bio = await Biodatas.findOne({
        where: {
          nik: nik,
        },
      });
      if (bio == null) {
        return res.status(404).json({
          error: true,
          message: "Biodata belum diisi",
        });
      }
      return res.status(200).json({
        error: true,
        message: "success",
        data: getJenisCuti,
        bio
      });
    }
    try {
      let user = await User.findOne({
        where: {
          nik: decoded.id,
        },
        attributes: ["status"],
      });
      let getJenisCuti = await Jns_cuti.findAll({
        where: {
          status: user.status,
        },
      });
      return res.status(200).json({
        error: false,
        message: "success",
        data: getJenisCuti,
      });
    } catch (error) {
      return res.status(500).json({
        error: true,
        message: "error",
        data: error,
      });
    }
  },
  postCuti: async (req, res) => {
    let token = req.cookies.token;
    let decoded = jwt.verify(token, secretKey);
    let body = req.body;
    let account = req.account;
    let dep = await Departemen.findOne({
      where: {
        id: account.dep,
      },
    });

    let t = await sequelize.transaction();
    let year = body.mulai.split("-");

    try {
      let getJenisCuti = await Jns_cuti.findOne({
        attributes: ["total", "max", "type_cuti"],
        where: {
          id: body.type_cuti,
        },
      });
      let getLeagerCuti = await Ledger_cuti.findOne({
        attributes: ["sisa_cuti"],
        where: {
          nik_user: decoded.id,
          type_cuti: body.type_cuti,
          periode: year[0],
        },
        order: [
          ["createdAt", "DESC"],
        ],
      }, { transaction: t });
      if (getLeagerCuti == null) {
        if (body.jumlah > getJenisCuti.max) {
          await t.rollback();
          return res.status(400).json({
            error: true,
            message: "Opps",
            icon: "warning",
            data: "Kouta cuti " + getJenisCuti.type_cuti + " maksimal " + getJenisCuti.max + " hari",
          });
        }
      } else if ((getLeagerCuti.sisa_cuti - body.jumlah) < 0) {
        await t.rollback();
        return res.status(400).json({
          error: true,
          message: "Opps",
          icon: "warning",
          data: "Maaf, sisa cuti anda tidak mencukupi, Sisa cuti anda " + getLeagerCuti.sisa_cuti + " hari",
        });
      }
      let saveCuti = await Cuti.create(
        {
          nik: decoded.id,
          type_cuti: body.type_cuti,
          mulai: body.mulai,
          samapi: body.samapi,
          jumlah: body.jumlah,
          keterangan: body.keterangan,
        },
        { transaction: t }
      );
      await Cutialamat.create(
        {
          id_cuti: saveCuti.id,
          nik: decoded.id,
          alamat: body.alamat,

        },
        { transaction: t }
      );
      let Boss = await Atasan.findOne({
        where: {
          user: decoded.id,
        },
        include: [
          {
            model: User,
            as: "atasanLangsung",
            include: [
              {
                model: Departemen,
                as: "departemen",
              },
            ],
          },
        ],
      }, { transaction: t });
      await Cuti_approval.create(
        {
          id_cuti: saveCuti.id,
          nik: Boss.atasanLangsung.nik,
          departement: Boss.atasanLangsung.departemen.bidang,
          jabatan: Boss.atasanLangsung.jab,
          status: "Menunggu",
        },
        { transaction: t }
      );
      let urlLampiran = body.lampiran || "-";
      if (getJenisCuti.type_cuti == "Cuti Sakit" || getJenisCuti.type_cuti == "Cuti Melahirkan") {
        urlLampiran = body.lampiran
        await Cuti_lampiran.create(
          {
            id_cuti: saveCuti.id,
            nik: decoded.id,
            file: body.lampiran,
            periode: `${new Date().getFullYear()}`,
          },
          { transaction: t }
        )
      }


      let jnsKelBoss = (Boss.atasanLangsung.JnsKel == 'Laki-laki') ? 'Bapak ' : 'Ibu ';
      let pesan = `Pemberitahuan Pengajuan Cuti Pegawai
Yth. ${jnsKelBoss} ${Boss.atasanLangsung.nama},
      
Saat ini pegawai dengan : 
Nama       : ${decoded.nama}
NIK        : ${decoded.id} 
Jenis Cuti : ${getJenisCuti.type_cuti}
Tanggal    : ${body.mulai} s/d ${body.samapi} (${body.jumlah} hari). 
Lampiran   : ${urlLampiran}      
Untuk memberikan persetujuan atau penolakan terhadap pengajuan cuti diatas, silakan akses aplikasi SIMPEG. 
Terima kasih atas perhatiannya.`;
      let data = JSON.stringify({
        message: pesan,
        telp: Boss.atasanLangsung.wa
      });

      let pesanGrub = `*Pemberitahuan Cuti Pegawai*
Nama       : ${decoded.nama}
NIK        : ${decoded.id}
Bidang     : ${dep.bidang} 
Jenis Cuti : ${getJenisCuti.type_cuti}
Tanggal    : ${body.mulai} s/d ${body.samapi} (${body.jumlah} hari)
Lampiran   : ${urlLampiran}`
      let dataGrub = JSON.stringify({
        message: pesanGrub,
        telp: process.env.GROUP_HR
      });
      sendWa(data);
      sendGrub(dataGrub);
      await t.commit();
      return res.status(200).json({
        error: false,
        message: "success",
        data: null,
        // data: aproveCuti,
        // saveCuti: saveCuti,
      });
    } catch (error) {
      await t.rollback();
      console.log(error.message);
      return res.status(400).json({
        error: true,
        message: "error",
        icon: "error",
        data: "Maaf, terjadi kesalahan pengisian data, silahkan coba lagi",
      });
    }
  },
  postCutiLate: async (req, res) => {
    let { nama, nik, departemen, noWA, type_cuti, mulai, samapi, jumlah, keterangan, maxCuti, alamat, lampiran } = req.body;
    let t = await sequelize.transaction();
    try {
      let year = mulai.split("-");
      let getJenisCuti = await Jns_cuti.findOne({
        attributes: ["total", "max", "type_cuti"],
        where: {
          id: type_cuti,
        },
      }, { transaction: t });
      let getLeagerCuti = await Ledger_cuti.findOne({
        attributes: ["sisa_cuti"],
        where: {
          nik_user: nik,
          type_cuti: type_cuti,
          periode: year[0],
        },
        order: [
          ["createdAt", "DESC"],
        ],
      }, { transaction: t });
      if (getLeagerCuti == null) {
        if (jumlah > getJenisCuti.max) {
          await t.rollback();
          return res.status(400).json({
            error: true,
            message: "Opps",
            icon: "warning",
            data: "Kouta cuti " + getJenisCuti.type_cuti + " maksimal " + getJenisCuti.max + " hari",
          });
        }
      } else if ((getLeagerCuti.sisa_cuti - jumlah) < 0) {
        await t.rollback();
        return res.status(400).json({
          error: true,
          message: "Opps",
          icon: "warning",
          data: "Maaf, sisa cuti anda tidak mencukupi, Sisa cuti anda " + getLeagerCuti.sisa_cuti + " hari",
        });
      }
      let Boss = await Atasan.findOne({
        where: {
          user: nik,
        },
        include: [
          {
            model: User,
            as: "atasanLangsung",
            include: [
              {
                model: Departemen,
                as: "departemen",
              },
            ],
          },
        ],
      }, { transaction: t });
      let saveCuti = await Cuti.create(
        {
          nik: nik,
          type_cuti: type_cuti,
          mulai: mulai,
          samapi: samapi,
          jumlah: jumlah,
          keterangan: keterangan,
        }, { transaction: t });
      await Cutialamat.create(
        {
          id_cuti: saveCuti.id,
          nik: nik,
          alamat: alamat,
        }, { transaction: t });
      await Cuti_approval.create(
        {
          id_cuti: saveCuti.id,
          nik: Boss.atasanLangsung.nik,
          departement: Boss.atasanLangsung.departemen.bidang,
          jabatan: Boss.atasanLangsung.jab,
          status: "Menunggu",
        }, { transaction: t });
      let urlLampiran = lampiran || "-";
      if (getJenisCuti.type_cuti == "Cuti Sakit" || getJenisCuti.type_cuti == "Cuti Melahirkan") {
        urlLampiran = lampiran
        await Cuti_lampiran.create(
          {
            id_cuti: saveCuti.id,
            nik: nik,
            file: lampiran,
            periode: `${new Date().getFullYear()}`,
          },
          { transaction: t }
        )
      }
      let jnsKelBoss = (Boss.atasanLangsung.JnsKel == 'Laki-laki') ? 'Bapak ' : 'Ibu ';
      let pesan = `Pemberitahuan Pengajuan Cuti Pegawai *(BACKDATE)*
Kepada yang terhormat ${jnsKelBoss} ${Boss.atasanLangsung.nama},
            
Saat ini pegawai dengan : 
Nama : ${nama}
NIK : ${nik} 
Jenis Cuti : ${getJenisCuti.type_cuti}
Tanggal : ${mulai} s/d ${samapi} (${jumlah} hari). 
Lampiran   : ${urlLampiran}   
Untuk memberikan persetujuan atau penolakan terhadap pengajuan cuti diatas, silakan akses aplikasi SIMPEG. 
Terima kasih atas perhatiannya.`;
      let data = JSON.stringify({
        message: pesan,
        telp: Boss.atasanLangsung.wa
      });
      let pesanGrub = `*Pemberitahuan Cuti Pegawai (BACKDATE)*
Nama : ${nama}
NIK : ${nik}
Bidang : ${departemen} 
Jenis Cuti : ${getJenisCuti.type_cuti}
Tanggal : ${mulai} s/d ${samapi} (${jumlah} hari)
Lampiran   : ${urlLampiran}`

      let dataGrub = JSON.stringify({
        message: pesanGrub,
        telp: process.env.GROUP_HR
      });
      sendWa(data);
      sendGrub(dataGrub);
      await t.commit();
      return res.status(200).json({
        error: false,
        message: "success",
        data: null,
      });
    } catch (error) {
      await t.rollback();
      return res.status(500).json({
        error: true,
        message: "error",
        data: error.message,
      });
    }
  },
  deleteCuti: async (req, res) => {
    let token = req.cookies.token;
    let decoded = jwt.verify(token, secretKey);
    let body = req.query;
    try {
      let t = await sequelize.transaction();
      let findCiuti = await Cuti.findOne({
        where: {
          nik: decoded.id,
          id: body.id,
        },
      },
        { transaction: t });
      if (findCiuti == null) {
        await t.rollback();
        return res.status(204).json({
          error: true,
          message: "data not found",
          data: findCiuti,
        });
      }
      let approval = await Cuti_approval.findOne({
        where: {
          id_cuti: body.id,
        },
      },
        { transaction: t });
      if (approval.status == "Menunggu") {
        await Cuti_approval.destroy({
          where: {
            id_cuti: body.id,
          },
        },
          { transaction: t });
        await Cuti.destroy({
          where: {
            nik: decoded.id,
            id: body.id,
          },
        }, { transaction: t });
        await t.commit();
        return res.status(200).json({
          error: false,
          message: "success",
          data: null,
        });
      } else {
        await t.rollback();
        return res.status(400).json({
          error: true,
          message: "error",
          data: "Cuti sudah di approve",
        });
      }
    } catch (error) {
      await t.rollback();
      return res.status(400).json({
        error: true,
        message: "error",
        data: error.message,
      });
    }
  },
  getRiwayatCuti: async (req, res) => {
    let token = req.cookies.token;
    let decoded = jwt.verify(token, secretKey);
    let { tahun } = req.query;
    try {
      let data = await Cuti.findAll({
        where: {
          nik: decoded.id,
          createdAt: {
            [Op.startsWith]: tahun,
          },
        },
        include: [
          {
            model: Jns_cuti,
            as: "jenis_cuti",
            attributes: ["type_cuti"],
          },
          {
            model: Cuti_approval,
            as: "approval",
            attributes: ["status", "approve_date", "nik", "keterangan"],
            include: [
              {
                model: User,
                as: "atasan",
                attributes: ["nama", "nip", "jab"],
              },
            ],
          },
        ],
        order: [["createdAt", "DESC"]],
      });
      if (data.length == 0) {
        return res.status(404).json({
          error: true,
          message: "data not found",
        });
      }
      return res.status(200).json({
        error: false,
        message: "success",
        data: data,
      });
    } catch (error) {
      return res.status(400).json({
        error: true,
        message: "error",
        data: error.message,
      });
    }
  },
  getSisaCuti: async (req, res) => {
    let user = req.account;

    let { type_cuti } = req.query;
    try {
      let data = await Ledger_cuti.findOne({
        where: {
          nik_user: user.nik,
          type_cuti: type_cuti
        },
        attributes: ["sisa_cuti", "periode"],
        include: [
          {
            model: Jns_cuti,
            as: "jenis_cuti",
            attributes: ["type_cuti"],
          },
        ],
        order: [["createdAt", "DESC"]],
      });
      if (data == null) {
        let jnsCuti = await Jns_cuti.findOne({
          where: {
            id: type_cuti
          },
          attributes: ["type_cuti", "total"]
        })
        let yearNow = new Date().getFullYear()
        let sisaCuti = {
          sisa_cuti: jnsCuti.total,
          periode: yearNow,
          jenis_cuti: {
            type_cuti: jnsCuti.type_cuti
          }
        }
        return res.status(200).json({
          error: true,
          message: 'Belum pernah di ambil',
          data: sisaCuti
        });
      }
      return res.status(200).json({
        error: false,
        message: "success",
        data: data,
      });
    } catch (error) {
      return res.status(400).json({
        error: true,
        message: "error",
        data: error.message,
      });
    }
  },
  getAnggotaCuti: async (req, res) => {
    let token = req.cookies.token;
    let decoded = jwt.verify(token, secretKey);
    let { tahun } = req.query;
    try {
      let data = await Cuti_approval.findAll({
        where: {
          nik: decoded.id,
          createdAt: {
            [Op.startsWith]: tahun,
          },
        },
        include: [
          {
            model: Cuti,
            as: "data_cuti",
            include: [
              {
                model: Jns_cuti,
                as: "jenis_cuti",
                attributes: ["type_cuti"],
              },
              {
                model: User,
                as: "user",
                attributes: ["nama", "nip", "jab"],
              },
            ],
          },
        ],
        order: [["createdAt", "DESC"]]
      });
      let id_cutis = data.map((item) => item.id_cuti);
      let dataAlamat = await Cutialamat.findAll({
        where: {
          id_cuti: id_cutis,
        },
      });
      let dataCuti = data.map((item) => {
        let alamat = dataAlamat.find((alamat) => alamat.id_cuti == item.id_cuti);
        return {
          id: item.id,
          id_cuti: item.id_cuti,
          nik: item.nik,
          departement: item.departement,
          jabatan: item.jabatan,
          status: item.status,
          approve_date: item.approve_date,
          keterangan: item.keterangan,
          data_cuti: item.data_cuti,
          alamat: alamat ? alamat.alamat : '-',
        }
      });
      if (data.length == 0) {
        return res.status(404).json({
          error: true,
          message: "data not found",
        });
      }
      return res.status(200).json({
        error: false,
        message: "success",
        data: dataCuti,
      });
    } catch (error) {
      return res.status(400).json({
        error: true,
        message: "error",
        data: error.message,
      });
    }
  },
  updateCuti: async (req, res) => {
    let token = req.cookies.token;
    let decoded = jwt.verify(token, secretKey);
    let { id, keterangan, status } = req.body;
    let t = await sequelize.transaction();
    try {
      let timeNowWib = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Jakarta",
      });
      let year = timeNowWib.split("/");
      let yearNow = year[2].split(" ");
      let getCuti = await Cuti.findOne({
        where: {
          id: id,
        },
        include: [
          {
            model: Jns_cuti,
            as: "jenis_cuti",
          },
          {
            model: User,
            as: "user",
            include: [
              {
                model: Biodatas,
                as: "biodata",
              },
              {
                model: Departemen,
                as: "departemen",
              }
            ],
          },
        ],
      });
      if (status == 'Disetujui') {
        let atasan = await User.findOne({
          where: {
            nik: decoded.id,
          },
          include: [
            {
              model: Departemen,
              as: "departemen",
            }
          ],
        });
        let ledger = await Ledger_cuti.findOne({
          where: {
            nik_user: getCuti.nik,
            type_cuti: getCuti.type_cuti,
            periode: parseInt(yearNow[0]),
          },
          order: [
            ["createdAt", "DESC"],
          ],
        }, { transaction: t });
        if (ledger == null) {
          let sisaCuti = getCuti.jenis_cuti.total - getCuti.jumlah;
          await Ledger_cuti.create({
            nik_user: getCuti.nik,
            name_user: getCuti.user.nama,
            jabatan: getCuti.user.jab,
            pangkat: getCuti.user.biodata.pangkat,
            departemen: getCuti.user.departemen.bidang,
            nik_atasan: atasan.nik,
            name_atasan: atasan.nama,
            tembusan: atasan.departemen.bidang,
            periode: parseInt(yearNow[0]),
            type_cuti: getCuti.type_cuti,
            id_cuti: getCuti.id,
            sisa_cuti: sisaCuti,
            cuti_diambil: getCuti.jumlah,
          }, { transaction: t });
        } else {
          let sisaCuti = ledger.sisa_cuti - getCuti.jumlah;
          if (sisaCuti < 0) {
            await t.rollback();
            return res.status(400).json({
              error: true,
              message: "error",
              data: "Sisa cuti tidak mencukupi",
            });
          }
          await Ledger_cuti.create({
            nik_user: getCuti.nik,
            name_user: getCuti.user.nama,
            jabatan: getCuti.user.jab,
            pangkat: getCuti.user.biodata.pangkat,
            departemen: getCuti.user.departemen.bidang,
            nik_atasan: atasan.nik,
            name_atasan: atasan.nama,
            tembusan: atasan.departemen.bidang,
            periode: parseInt(yearNow[0]),
            type_cuti: getCuti.type_cuti,
            id_cuti: getCuti.id,
            sisa_cuti: sisaCuti,
            cuti_diambil: getCuti.jumlah,
          },
            { transaction: t });
        }
      }
      await Cuti_approval.update(
        {
          status: status,
          keterangan: keterangan,
          approve_date: timeNowWib,
        },
        {
          where: {
            id: id,
            nik: decoded.id,
          },
        },
        { transaction: t });
      await t.commit();
      return res.status(200).json({
        error: false,
        message: "success",
        data: getCuti,
        body: decoded,
        yearNow: yearNow,
      });
    } catch (error) {
      await t.rollback();
      console.log(error);
      return res.status(400).json({
        error: true,
        message: "error",
        data: error.message,
      });
    }
  },
  getAllCuti: async (req, res) => {
    let { tahun } = req.query;
    try {
      let data = await Ledger_cuti.findAll({
        where: {
          periode: tahun
        },
        include: [
          {
            model: Jns_cuti,
            as: "jenis_cuti",
            attributes: ["type_cuti"],
          },
          {
            model: Cuti,
            as: "data_cuti",
            attributes: ["mulai", "samapi", "keterangan", "createdAt", "updatedAt"],
          },
          {
            model: Cuti_approval,
            as: "approval_cuti",
            attributes: ["approve_date", "keterangan"],
          }
        ],

        order: [["createdAt", "DESC"]],
        attributes: { exclude: ['jabatan', 'pangkat', 'periode'] }
      // limit: 20,
      // offset: 10,

      });

      data = data.map((item) => {
        return {
          id: item.id,
          nik_user: item.nik_user,
          name_user: item.name_user,
          departemen: item.departemen,
          nik_atasan: item.nik_atasan,
          name_atasan: item.name_atasan,
          tembusan: item.tembusan,
          type_cuti: item.jenis_cuti.type_cuti,
          tgl_cuti: item.data_cuti.mulai + " s/d " + item.data_cuti.samapi,
          cuti_diambil: item.cuti_diambil + " hari",
          id_cuti: item.id_cuti,
          sisa_cuti: item.sisa_cuti,
          data_cuti: item.data_cuti,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          approve_date: item.approval_cuti.approve_date,
          keterangan: item.approval_cuti.keterangan,
        }
      });
      return res.status(200).json({
        error: false,
        message: "success",
        data: data,
      });
    }
    catch (error) {
      return res.status(400).json({
        error: true,
        message: "error",
        data: error.message,
      });
    }
  },
  getProfiles: async (req, res) => {
    let search = req.query.search;

    try {
      let cache = await req.cache.json.get(`SIMPEG:getProfiles:${search}`, '$');
      if (cache != null) {
        return res.status(200).json({
          error: false,
          message: "success",
          data: cache,
        });
      }
      let profiles = await User.findAll({
        where: {
          [Op.or]: [
            { nik: { [Op.substring]: search } },
            { nama: { [Op.substring]: search } },
            { wa: { [Op.substring]: search } },
            { nip: { [Op.substring]: search } },
          ],
        },
        attributes: ["nama", "nik", "nip", "jab", "status", "wa", "email"],
        include: [
          {
            model: Profile,
            as: "profile",
            attributes: ["url"],
          },
          {
            model: Departemen,
            as: "departemen",
            attributes: ["bidang"],
          },
        ],
        order: [["nama", "ASC"]],
        limit: 20,
      });
      let data = [];
      for (let profil of profiles) {
        // if departemen == null
        if (profil.departemen == null) {
          profil.departemen = {
            bidang: "",
          };
        }
        let x = {
          nama: profil.nama,
          nik: profil.nik.toString().substring(0, 13) + "xxxx",
          nip: profil.nip.substring(0, 12) + "xxxx",
          fnik: profil.nik,
          jab: profil.jab,
          status: profil.status,
          wa: profil.wa,
          email: profil.email,
          departemen: profil.departemen.bidang,
          url: profil.profile.url,
        };
        data.push(x);
      }
      req.cache.json.set(`SIMPEG:getProfiles:${search}`, '$', data);
      req.cache.expire(`SIMPEG:getProfiles:${search}`, 60);

      return res.status(200).json({
        error: false,
        message: "success",
        data: data,
      });
    } catch (error) {
      return res.status(400).json({
        error: true,
        message: "error",
        data: error.message,
      });
    }
  },

  getProfilepic: async (req, res) => {
    try {
      let { nik } = req.query;
      let newToken = jwt.verify(nik, secretKey);
      let porfil = await Profile.findOne({
        where: {
          nik: newToken,
        },
      });
      return res.status(200).json({
        error: false,
        message: "success",
        data: {
          url: porfil.url,
        },
      });
    } catch (error) {
      return res.status(400).json({
        error: true,
        message: "error",
        data: error.message,
      });
    }
  },
  getMenu: async (req, res) => {
    try {
      let token = req.cookies.token;
      let decoded = jwt.verify(token, secretKey);
      let hakakses = [];
      let getAnggota = await Instalasi.findOne({
        where: {
          bos: decoded.id,
        },
      });
      if (getAnggota) {
        hakakses.push({
          bos: true,
        });
      } else {
        hakakses.push({
          bos: false,
        });
      }
      let akses = await Access.findAll({
        attributes: ["status"],
        where: {
          wa: decoded.wa,
        },
      });
      let menu = [];
      for (let i of akses) {

        menu.push(i.status);
      }
      hakakses.push({
        menu: menu,
      });
      return res.status(200).json({
        error: false,
        message: "success",
        data: hakakses,
      });
    } catch (error) {
      return res.status(400).json({
        error: true,
        message: "error",
        data: error.message,
      });
    }
  },
  getUserMicrotik: async (req, res) => {
    try {
      let token = req.cookies.token;
      let decoded = jwt.verify(token, secretKey);

        let getUserPw = await Hotspot.findOne({
          where: {
            nik: decoded.id,
          },
          });
      return res.status(200).json({
        error: false,
        message: "success",
        data: getUserPw
      });
    } catch (error) {
      return res.status(500).json({
        error: true,
        message: error.message,
      });
    }
  },
  GetCuti: async (req, res) => {
    let diCuti = req.body.id;
    try {
      let cuti = await Cuti.findOne({
        where: {
          id: diCuti
        },
        attributes: ["id"],
      })
      // set jwt token
      let token = jwt.sign(
        { cuti },
        secretKey,
      );
      return res.status(200).json({
        error: false,
        message: "success",
        data: token,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: true,
        message: error.message,
      });
    }


  },
};
