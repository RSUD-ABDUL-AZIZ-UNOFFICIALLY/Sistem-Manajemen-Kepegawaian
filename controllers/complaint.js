const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET_KEY;
const groupIT = process.env.GROUP_IT;
const baseUrl = process.env.BASE_URL;
const { Complaint, Tiket, User, Tiketgroup, Grouperticket, Departemen, Profile, sequelize } = require("../models");
const { sendWa, sendGrub } = require("../helper/message");
const { Op, or } = require("sequelize");
const {generateUID} = require("../helper");


module.exports = {
    addTiket: async (req, res) => {
        let token = req.cookies.token;
        let decoded = jwt.verify(token, secretKey);
        let body = req.body;
        console.log(body);
        let find_Tiketgroup = await Tiketgroup.findOne({
            where: {
                id: body.idgrub
            }
        });
        if (!find_Tiketgroup) {
            return res.status(500).json({
                error: true,
                message: "error",
                data: "Grup tidak ditemukan",
            });
        }
        let find_departemen = await Departemen.findOne({
            where: {
                id: body.dep
            }
        });
        console.log(find_Tiketgroup);
        console.log(req.account)
        const t = await sequelize.transaction();
        try {
            console.log(body);
            body.nik = decoded.id;
            body.noTiket = generateUID(7);
            body.nama= decoded.nama;
            body.status= "Buka";
            body.noHp= decoded.wa;  
            body.keteranagn = `Dengan kendala " ${body.kendala} " .`;
            let data = await Complaint.create(body);
            await Tiket.create(body);
            await Grouperticket.create({
                noTiket: body.noTiket,
                id_grup: body.idgrub,
                nama_dep: find_departemen.bidang,
                pj: find_Tiketgroup.nama_pj,
            });
            let pesanGrub = "Pegawai dengan nama " + decoded.nama + " di bidang " + find_departemen.bidang + ". \n " + body.keteranagn + " nomor tiket *" + body.noTiket + "*. Lihat detail " + baseUrl + "/api/complaint/updateTiket?id=" + body.noTiket + "\n Di tujukan ke " + find_Tiketgroup.nama_pj + " (" + find_Tiketgroup.nama_grup + ") \n info lebih lanjut klik link di atas 👆🏻 atau hubungi : " + decoded.wa + " \n Terimakasih";
            let dataGrub = JSON.stringify({
                message: pesanGrub,
                telp: groupIT
            });
            let pesanPJ = find_Tiketgroup.nama_pj + " ada tiket dari " + decoded.nama + "." + body.keteranagn + " Nomor tiket *" + body.noTiket + "* . Lihat detail " + baseUrl + "/api/complaint/updateTiket?id=" + body.noTiket + " \n Save nomor ini agar bisa klik link di atas 👆🏻 \n Terimakasih";
            let dataPJ = JSON.stringify({
                message: pesanPJ,
                telp: find_Tiketgroup.wa_pj
            });

            let pesanUser = "Terimakasih " + decoded.nama + " telah mengajukan tiket dengan nomor *" + body.noTiket + "*. Kami akan segera menindaklanjuti. Lihat detail " + baseUrl + "/api/complaint/updateTiket?id=" + body.noTiket + " \n Save nomor ini agar bisa klik link di atas 👆🏻 \n Terimakasih";
            let dataUser = JSON.stringify({
                message: pesanUser,
                telp: decoded.wa
            });
            await sendWa(dataUser);
            await sendGrub(dataGrub);
            await sendWa(dataPJ);
            await t.commit();
            return res.status(200).json({
                error: false,
                message: "success",
                data: data
            });
        } catch (err) {
            console.log(err);
            await t.rollback();
            return res.status(500).json({
                error: true,
                message: "error",
                data: err,
            });
        }
    },
    getTiket: async (req, res) => {
        let token = req.cookies.token;
        let decoded = jwt.verify(token, secretKey);
        let query = req.query;
        try {
            query.nik = decoded.id;
            let data = await Complaint.findAll({
                where: {
                    nik: query.nik,
                    createdAt: {
                        [Op.startsWith]: query.date,
                      },
                }
            });
            return res.status(200).json({
                error: false,
                message: "success",
                data: data
            });
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                error: true,
                message: "error",
                data: err,
            });
        }
    },
    getAllTiket: async (req, res) => {
        try {
            let query = req.query;
            let data = await Complaint.findAll({
                where: {
                    createdAt: {
                        [Op.startsWith]: query.date,
                      },
                },
                include: [
                    { model: Departemen, as: "departemen" , attributes: ["bidang"]},
                    { model: Tiket},
                    { model: Profile, as: "pic", attributes: ["url"] }

                ],
                order: [
                    ["createdAt", "DESC"]
                ]

            });
            return res.status(200).json({
                error: false,
                message: "success",
                data: data
            });
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                error: true,
                message: "error",
                data: err.message,
            });
        }
    },
    getStatus: async (req, res) => {
        let token = req.cookies.token;
        let decoded = jwt.verify(token, secretKey);
        let query = req.query;
        try {
            query.nik = decoded.id;
            let data = await Tiket.findAll({
                where: {
                    noTiket: query.tiket
                }
            });
            return res.status(200).json({
                error: false,
                message: "success",
                data: data
            });
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                error: true,
                message: "error",
                data: err,
            });
        }
    },
    getUpdateTiket: async (req, res) => {
        let token = req.cookies.token;
        let decoded = jwt.verify(token, secretKey);
        let query = req.query;
        try {
            let tiket = await Tiket.findAll({
                where: {
                    noTiket: query.id
                }
            });
            let topic = await Complaint.findOne({
                where: {
                    noTiket: query.id
                }
            });
            if(tiket.length > 0){
                let data = {
                    title: "HelpDesk | LPKP",
                    page: "Dukungan IT",
                    token: decoded,
                    id: query.id,
                    topic: topic,
                  };
                  return  res.render("admin/tiket", data);
            }else{ 
                return res.redirect('/');
            
            }
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                error: true,
                message: "error",
                data: err,
            });
        }
    },
    setStatus: async (req, res) => {
        let token = req.cookies.token;
        let decoded = jwt.verify(token, secretKey);
        let body = req.body;
        const t = await sequelize.transaction();
        try {
            let dataTiket = await Tiket.create({
                noTiket: body.noTiket,
                status: body.status,
                keteranagn: body.keteranagn,
                nama: decoded.nama,
            });
                await t.commit();
            return res.status(200).json({
                error: false,
                message: "success",
                data: dataTiket
            });
        } catch (err) {
            console.log(err);
            await t.rollback();
            return res.status(500).json({
                error: true,
                message: "error",
                data: err,
            });
        }
    }
}
