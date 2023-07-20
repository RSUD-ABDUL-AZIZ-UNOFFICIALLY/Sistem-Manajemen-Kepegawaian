const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET_KEY;
const { Complaint, Tiket,sequelize } = require("../models");
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
            body.status= "open";
            body.noHp= decoded.wa;      
                await Complaint.create(body);
                await t.commit();
            return res.status(200).json({
                error: false,
                message: "success",
                data: body
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
                        [Op.startsWith]: queryparams.date,
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
}
