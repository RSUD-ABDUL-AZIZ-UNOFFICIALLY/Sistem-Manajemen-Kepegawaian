"use strict";
const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET_KEY;
const { User, Biodatas, Atasan, Lpkp, Rekap, Aprovement, Template, Departemen } = require("../models");
const { Op, where, } = require("sequelize");
const { get } = require("express/lib/response");
const { convertdate, convertdatetime } = require("../helper");
module.exports = {
  updateProfile: async (req, res) => {
    let body = req.body;
    let token = req.cookies.token;
    let decoded = jwt.verify(token, secretKey);
    try {
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
    } catch (error) { }
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
      console.log(body);
      console.log(decoded);
      let updateBio = await Biodatas.update(body, {
        where: {
          nik: decoded.id
        },
      });
      console.log(updateBio);
      // validasi jika data tidak valid
      if (updateBio[0] == 0) {
        updateBio = await Biodatas.create({
          nik: decoded.id,
          ...body
        });
      }
      return res.status(200).json({
        error: false,
        message: updateBio,
      });
    } catch (error) {
      console.error(error)
      return res.status(400).json({
        error: false,
        message: "error",
        data: error.message
      })
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
    } catch (error) { }
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
    let date = getLpkp.tgl.split("-");
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
          });
        pesan = "Progress updated successfully";
      }
    } catch (error) {
      // Jika terjadi kesalahan, rollback transaksi
      console.error("Transaksi gagal:", error);
    }
    return res.status(200).json({
      error: false,
      message: "success",
      data: pesan
    });
  },
  getReport: async (req, res) => {
    let token = req.cookies.token;
    let decoded = jwt.verify(token, secretKey);
    let queryparams = req.query;
    let PNS = (queryparams.satusPNS == "true") ? 'PNS' : '';
    let PPPK = (queryparams.satusPPPK == "true") ? 'PPPK' : '';
    let NonASN = (queryparams.satusNonASN == "true") ? 'Non ASN' : '';
    try {
      let getUser = await User.findAll({
        where: {
          [Op.and]: [
            { dep: queryparams.dep },
            { [Op.or]: [{ status: NonASN }, { status: PPPK }, { status: PNS }] },
          ]
        },
        attributes: ["nik", "nama", "nip", "jab", "status"],
        order: [
          ["nama", "ASC"],
        ],
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
        let pushData
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
              ['createdAt', 'DESC'],
            ],
          });
          let findBos
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
            state: (approve == null) ? 1 : 2,
            bos: findBos
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
      }
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
      data: data
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
        }
      };

      return res.status(200).json({
        error: false,
        message: "success",
        data: data
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
        data: Approve
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
    if (body.kegiatan == '') {
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
        }
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
            template: getTemplate
          }
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
          data: getTemplate
        });
      }
      catch (error) {
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
        data: deleteTemplate
      });
    } catch (error) {
      return res.status(500).json({
        error: true,
        message: "error",
        data: error,
      });
    }
  }
};
