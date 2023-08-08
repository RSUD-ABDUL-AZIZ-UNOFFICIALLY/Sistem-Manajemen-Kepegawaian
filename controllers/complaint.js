const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET_KEY;
const groupIT = process.env.GROUP_IT;
const { Complaint, Tiket, User, Departemen, sequelize } = require("../models");
const { Op } = require("sequelize");
const {generateUID} = require("../helper");


module.exports = {
    addTiket: async (req, res) => {
        let token = req.cookies.token;
        let decoded = jwt.verify(token, secretKey);
        let body = req.body;
        const t = await sequelize.transaction();
        try {
            body.nik = decoded.id;
            body.noTiket = generateUID(7);
            body.nama= decoded.nama;
            body.status= "Buka";
            body.noHp= decoded.wa;  
            body.keteranagn= "Di sampaikan ke bagian terkait";    
            let data = await Complaint.create(body);
            let dataTiket = await Tiket.create(body);
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
        console.log(query.date);
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
                ],

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
