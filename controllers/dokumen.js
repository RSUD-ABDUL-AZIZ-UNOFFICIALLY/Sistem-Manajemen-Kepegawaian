"use strict";
const jwt = require("jsonwebtoken");
const axios = require("axios");
const secretKey = process.env.JWT_SECRET_KEY;
console.log(process.env.API_URL);
const { sequelize, User, Ijazah, Riwayat_ijazah, Str, Riwayat_str, Kk, Riwayat_kk, Ktp, Riwayat_ktp, Npwp, Riwayat_npwp, Cv, Riwayat_cv, Sertifikat, Riwayat_sertifikat, Skck, Riwayat_skck, Kontrak, Riwayat_kontrak, Pangkat, Riwayat_pangkat, Lainnya, Riwayat_lainnya } = require("../models");
const { Op } = require("sequelize");

module.exports = {
    async uploadDoc(req, res) {
        try {
            let params = req.params.id;
            let body = req.body;
            let account = req.account;
            body.status = "active";
            body.user = account.nik.toString();
            let data = JSON.stringify(body);
            let config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + req.cookies.token
                }
            };
            console.log(config);

            let x = await axios.post(process.env.API_URL + "/api/gobi/v1/dokumen", data, config)
            return res.status(200).json({
                error: false,
                message: "success",
                data: x.data
            })

        } catch (error) {
            console.log(error);
            return res.status(400).json({
                error: true,
                message: error.message,
                data: error
            })
        }
    },
    getDocAll: async (req, res) => {

        try {
            const response = await axios({
                method: 'GET',
                url: 'https://api.spairum.my.id/api/gobi/v1/dokumen/' + req.account.nik.toString(),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + req.cookies.token
                }
            });
            return res.status(200).json({
                error: false,
                message: "success",
                record: response.data.length,
                data: response.data,
            })
        } catch (error) {
            console.log(error);
            return res.status(400).json({
                error: true,
                message: error.message,
                data: error
            })
        }
    },
    deleteDoc: async (req, res) => {
        let param = req.params.id;
        try {
            const response = await axios({
                method: 'DELETE',
                url: 'https://api.spairum.my.id/api/gobi/v1/dokumen/' + param,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + req.cookies.token
                }
            });
            return res.status(200).json({
                error: false,
                message: "success",
                data: param
            })
        } catch (error) {
            return res.status(400).json({
                error: true,
                message: error.message,
                data: error
            })
        }
    },
    editDoc: async (req, res) => {
        let body = req.body;
        let account = req.account;
        body.status = "active";
        body.user = account.nik.toString();
        let data = JSON.stringify(body);
        try {
            const response = await axios({
                method: 'PUT',
                url: 'https://api.spairum.my.id/api/gobi/v1/dokumen/' + body._id,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + req.cookies.token
                },
                data: body
            });
            return res.status(200).json({
                error: false,
                message: "success",
                data: response.data
            })
        } catch (error) {
            return res.status(400).json({
                error: true,
                message: error.message,
                data: error
            })
        }
    }
}
// async function uploadIjazah(body, account) {
//      let t = await sequelize.transaction();
//      try {
//         let fileAdd = await Ijazah.create(body, { transaction: t });
//         console.log(fileAdd)
//          await Riwayat_ijazah.create({
//              fileId: fileAdd.dataValues.id,
//              status: "Uploaded",
//              keterangan: "File uploaded oleh " + account.nama
//          }, { transaction: t });
         
//      } catch (error) {
//          await t.rollback();
//          throw new Error(error)
//      }
//      t.commit();
//     return;
// }
// async function uploadStr(body, account) {
//     let t = await sequelize.transaction();
//     try {
//        let fileAdd = await Str.create(body, { transaction: t });
//        console.log(fileAdd)
//         await Riwayat_str.create({
//             fileId: fileAdd.dataValues.id,
//             status: "Uploaded",
//             keterangan: "File uploaded oleh " + account.nama
//         }, { transaction: t });
        
//     } catch (error) {
//         await t.rollback();
//         throw new Error(error)
//     }
//     t.commit();
//    return;
// }
// async function uploadKtp(body, account) {
//     let t = await sequelize.transaction();
//     try {
//        let fileAdd = await Ktp.create(body, { transaction: t });
//        console.log(fileAdd)
//         await Riwayat_ktp.create({
//             fileId: fileAdd.dataValues.id,
//             status: "Uploaded",
//             keterangan: "File uploaded oleh " + account.nama
//         }, { transaction: t });
        
//     } catch (error) {
//         await t.rollback();
//         throw new Error(error)
//     }
//     t.commit();
//    return;
// }
// async function uploadKk(body, account) {
//     let t = await sequelize.transaction();
//     try {
//        let fileAdd = await Kk.create(body, { transaction: t });
//        console.log(fileAdd)
//         await Riwayat_kk.create({
//             fileId: fileAdd.dataValues.id,
//             status: "Uploaded",
//             keterangan: "File uploaded oleh " + account.nama
//         }, { transaction: t });
        
//     } catch (error) {
//         await t.rollback();
//         throw new Error(error)
//     }
//     t.commit();
//    return;
// }
// async function uploadNpwp(body, account) {
//     let t = await sequelize.transaction();
//     try {
//        let fileAdd = await Npwp.create(body, { transaction: t });
//        console.log(fileAdd)
//         await Riwayat_npwp.create({
//             fileId: fileAdd.dataValues.id,
//             status: "Uploaded",
//             keterangan: "File uploaded oleh " + account.nama
//         }, { transaction: t });
        
//     } catch (error) {
//         await t.rollback();
//         throw new Error(error)
//     }
//     t.commit();
//    return;
// }
// async function uploadCv(body, account) {
//     let t = await sequelize.transaction();
//     try {
//        let fileAdd = await Cv.create(body, { transaction: t });
//        console.log(fileAdd)
//         await Riwayat_cv.create({
//             fileId: fileAdd.dataValues.id,
//             status: "Uploaded",
//             keterangan: "File uploaded oleh " + account.nama
//         }, { transaction: t });
        
//     } catch (error) {
//         await t.rollback();
//         throw new Error(error)
//     }
//     t.commit();
//    return;
// }
// async function uploadSertifikat(body, account) {
//     let t = await sequelize.transaction();
//     try {
//        let fileAdd = await Sertifikat.create(body, { transaction: t });
//        console.log(fileAdd)
//         await Riwayat_sertifikat.create({
//             fileId: fileAdd.dataValues.id,
//             status: "Uploaded",
//             keterangan: "File uploaded oleh " + account.nama
//         }, { transaction: t });
        
//     } catch (error) {
//         await t.rollback();
//         throw new Error(error)
//     }
//     t.commit();
//    return;
// }
// async function uploadSkck(body, account) {
//     let t = await sequelize.transaction();
//     try {
//        let fileAdd = await Skck.create(body, { transaction: t });
//        console.log(fileAdd)
//         await Riwayat_skck.create({
//             fileId: fileAdd.dataValues.id,
//             status: "Uploaded",
//             keterangan: "File uploaded oleh " + account.nama
//         }, { transaction: t });
        
//     } catch (error) {
//         await t.rollback();
//         throw new Error(error)
//     }
//     t.commit();
//    return;
// }
// async function uploadKontrak(body, account) {
//     let t = await sequelize.transaction();
//     try {
//        let fileAdd = await Kontrak.create(body, { transaction: t });
//        console.log(fileAdd)
//         await Riwayat_kontrak.create({
//             fileId: fileAdd.dataValues.id,
//             status: "Uploaded",
//             keterangan: "File uploaded oleh " + account.nama
//         }, { transaction: t });
        
//     } catch (error) {
//         await t.rollback();
//         throw new Error(error)
//     }
//     t.commit();
//    return;
// }
// async function uploadPangkat(body, account) {
//     let t = await sequelize.transaction();
//     try {
//        let fileAdd = await Pangkat.create(body, { transaction: t });
//        console.log(fileAdd)
//         await Riwayat_pangkat.create({
//             fileId: fileAdd.dataValues.id,
//             status: "Uploaded",
//             keterangan: "File uploaded oleh " + account.nama
//         }, { transaction: t });
        
//     } catch (error) {
//         await t.rollback();
//         throw new Error(error)
//     }
//     t.commit();
//    return;
// }
// async function uploadLainnya(body, account) {
//     let t = await sequelize.transaction();
//     try {
//        let fileAdd = await Lainnya.create(body, { transaction: t });
//        console.log(fileAdd)
//         await Riwayat_lainnya.create({
//             fileId: fileAdd.dataValues.id,
//             status: "Uploaded",
//             keterangan: "File uploaded oleh " + account.nama
//         }, { transaction: t });
        
//     } catch (error) {
//         await t.rollback();
//         throw new Error(error)
//     }
//     t.commit();
//    return;
    
// }

