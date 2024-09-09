"use strict";
const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET_KEY;
const {
    User,
    Instalasi,
    Departemen,
    Jnsdns,
    Jdldns,
} = require("../models");
const { Op, where } = require("sequelize");
module.exports = {
    anggota: async (req, res) => {
        let token = req.cookies.token;
        let decoded = jwt.verify(token, secretKey);
        let params = req.query;

        try {
            let users = await User.findAll({
                where: {
                    dep: params.dep,
                },
                attributes: ["nik", "nama"],
            });
            let year = new Date(params.periode).getFullYear();
            let month = new Date(params.periode).getMonth();
            let jumlahHari = new Date(year, month + 1, 0).getDate();
            console.log(jumlahHari);

            for (let i = 0; i < users.length; i++) {
                // console.log(users[i].dataValues.nik)
                let presensi = await Jdldns.findAll({
                    where: {
                        nik: users[i].dataValues.nik,
                        date: { [Op.startsWith]: params.periode },
                    },
                    include: [{
                        model: Jnsdns,
                        as: 'dnsType'
                    }],
                    // attributes: ["typeDns"],
                });
                if (presensi.length == 0) {

                    for (let x = 0; x < jumlahHari; x++) {
                        let namaHari = ["MIN", "SEN", "SEL", "RAB", "KAM", "JUM", "SAB"];
                        let hari = (namaHari[new Date(year, month, x + 1).getDay()]);
                        console.log(hari)
                        console.log(namaHari[new Date(year, month, x + 1).getDay()] == 'MIN')
                        let jadwal = {
                            nik: users[i].dataValues.nik,
                            typeDns: (namaHari[new Date(year, month, x + 1).getDay()] == 'MIN' || namaHari[new Date(year, month, x + 1).getDay()] == 'SAB') ? "L" : "F5",
                            date: new Date(year, month, x + 1)
                        }
                        await Jdldns.create(jadwal);
                    }
                } else {
                    users[i].dataValues.jadwal = presensi
                }
            }

            return res.status(200).json({
                error: false,
                message: "success",
                data: users,
            });
        } catch (error) {
            return res.status(500).json({
                error: true,
                message: "error",
                data: error,
            });
        }
    },
    departemen: async (req, res) => {
        let token = req.cookies.token;
        let decoded = jwt.verify(token, secretKey);
        let isIntalasi = await Instalasi.findAll({
            where: {
                bos: decoded.id
            },
            attributes: ["dep"],
            include: [
                {
                    model: Departemen,
                    as: "departemen",
                }
            ]
        })
        if (!isIntalasi) {
            return res.status(400).json({
                error: true,
                message: "data tidak valid",
            });
        }
        try {
            return res.status(200).json({
                error: false,
                message: "success",
                data: isIntalasi
            });
        } catch (error) {
            return res.status(500).json({
                error: true,
                message: "error",
                data: error,
            });
        }
    },
    updateJadwal: async (req, res) => {
        let token = req.cookies.token;
        let decoded = jwt.verify(token, secretKey);
        let params = req.body;
        let dateNow = new Date();
        let dateJadwal = new Date(params.date);
        console.log(dateJadwal, dateNow)
        if (dateJadwal < dateNow) {
            return res.status(400).json({
                error: true,
                message: "Tidak dapat mengubah tanggal mudur",
            });
        }
        try {
            let updateData = await Jdldns.update({
                typeDns: params.typeDns
            }, {
                where: {
                    nik: params.nik,
                    date: params.date
                }
            });

            return res.status(200).json({
                error: false,
                message: "success",
                data: updateData
            });
        } catch (error) {
            return res.status(500).json({
                error: true,
                message: "internal server error",
                data: error,
            });
        }
    }
}