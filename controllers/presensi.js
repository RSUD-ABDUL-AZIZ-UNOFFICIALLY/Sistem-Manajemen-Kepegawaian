"use strict";
const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET_KEY;
const {
    User,
    Instalasi,
    Departemen,
    Absen,
    Jnsdns,
    Jdldns,
} = require("../models");
const { cekLocation } = require("../helper/casting");
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
    },
    getlocation: async (req, res) => {
        try {
            // let data = await Location.findAll();
            let nama = process.env.GEONAME
            let body = req.body;
            let cek = cekLocation([body.latitude, body.longitude]);
            let data = cek ? nama : "Tidak di lokasi";
            return res.status(200).json({
                error: false,
                message: "success",
                data:
                {
                    location: data,
                    status: cek
                }
            });

        } catch (error) {
            return res.status(500).json({
                error: true,
                message: "internal server error",
                data: error,
            });
        }
    },
    getjdlDNS: async (req, res) => {
        try {
            let date = new Date();
            let user = req.account;
            let data = await Jdldns.findOne({
                where: {
                    nik: user.nik,
                    date: date
                },
                include: [
                    {
                        model: Jnsdns,
                        as: 'dnsType'
                    }
                ]
            });
            if (data == null) {
                return res.status(404).json({
                    error: true,
                    message: "Jadwal belum di buat oleh Atasan Anda",
                    data: "Silahkan menghubungi atasan Anda",
                });
            }
            return res.status(200).json({
                error: false,
                message: "success",
                data: data
            });
        } catch (error) {
            return res.status(500).json({
                error: true,
                message: "internal server error",
                data: error,
            });
        }
    },
    absen: async (req, res) => {
        try {
            let date = new Date();
            let user = req.account;
            let body = req.body;
            let timeNow = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
            if (body.state == 'in') {
                let absensi = await Absen.findOne({
                    where: {
                        nik: user.nik,
                        typeDns: body.type,
                        date: body.date
                    }
                })
                if (absensi) {
                    return res.status(200).json({
                        error: false,
                        message: "Opps...",
                        data: "Anda Telah Absen"
                    })
                }
                let jadwal = await Jnsdns.findOne({
                    where: {
                        slug: body.type
                    },
                    attributes: ['start_min', 'start_max']
                })
                let data = {
                    nik: user.nik,
                    typeDns: body.type,
                    date: body.date,
                    geoIn: body.geoIn,
                    visitIdIn: body.visitIdIn,
                    cekIn: timeNow
                }
                let ket = '';
                let poin = 3;
                if (body.posisi == 0) {
                    ket += "Absen di Luar,"
                    poin--;
                }
                if (body.wifi == 0) {
                    ket += "Di luar Jaringan"
                    poin--;
                }
                data.keteranganIn = ket;
                data.nilaiIn = poin;

                let startTime = jadwal.start_min.split(':');
                let start = new Date(date.getFullYear(), date.getMonth(), date.getDate(), parseInt(startTime[0]), parseInt(startTime[1])).getTime();
                let endTime = jadwal.start_max.split(':');
                let end = new Date(date.getFullYear(), date.getMonth(), date.getDate(), parseInt(endTime[0]), parseInt(endTime[1])).getTime();
                let time = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes()).getTime();

                if (time < start || time > end) {
                    data.statusIn = "Late"
                    await Absen.create(data)
                    return res.status(400).json({
                        error: true,
                        message: "Anda terlambat Absen Masuk",
                        data: "Jam absen : " + jadwal.start_min + " - " + jadwal.start_max,
                    });
                } else {
                    await Absen.create(data)
                    data.statusIn = 'On Time';
                }
                console.log(body)
                console.log(data)


            }
            if (body.state == 'out') {
                let jadwal = await Jnsdns.findOne({
                    where: {
                        slug: body.type
                    },
                    attributes: ['end_min', 'end_max']
                })
                let absensi = await Absen.findOne({
                    where: {
                        nik: user.nik,
                        typeDns: body.type,
                        date: body.date
                    }
                })
                if (!absensi) {
                    return res.status(400).json({
                        error: true,
                        message: "Anda belum Absen Masuk",
                        data: null,
                    });
                }
                if (absensi.statusOut != null) {
                    return res.status(200).json({
                        error: false,
                        message: "Opps...",
                        data: "Anda Telah Absen Pulang"
                    })
                }
                let data = {
                    geoOut: body.geoIn,
                    visitIdOut: body.visitIdIn,
                    cekOut: timeNow
                }
                let ket = '';
                let poin = 3;
                if (body.posisi == 0) {
                    ket += "Absen di Luar,"
                    poin--;
                }
                if (body.wifi == 0) {
                    ket += "Di luar Jaringan"
                    poin--;
                }
                data.keteranganOut = ket;
                data.nilaiOut = poin;

                let startTime = jadwal.end_min.split(':');
                let start = new Date(date.getFullYear(), date.getMonth(), date.getDate(), parseInt(startTime[0]), parseInt(startTime[1])).getTime();
                let endTime = jadwal.end_max.split(':');
                let end = new Date(date.getFullYear(), date.getMonth(), date.getDate(), parseInt(endTime[0]), parseInt(endTime[1])).getTime();
                let time = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes()).getTime();
                if (time < start || time > end) {
                    data.statusOut = "Late";
                    await Absen.update(
                        data, {
                        where: {
                            nik: user.nik,
                            typeDns: body.type,
                            date: body.date,
                        }
                    });
                    return res.status(400).json({
                        error: true,
                        message: "Anda terlambat Absen Pulang",
                        data: "Jam absen : " + jadwal.end_min + " - " + jadwal.end_max,
                    });
                } else {

                    data.statusOut = 'On Time';
                    await Absen.update(
                        data, {
                        where: {
                            nik: user.nik,
                            typeDns: body.type,
                            date: body.date,
                        }
                    });
                }

                console.log(body)
                console.log(data)
            }
            return res.status(200).json({
                error: false,
                message: "Sukses",
                data: "Absen tepat waktu"
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                error: true,
                message: "internal server error",
                data: error,
            });
        }
    }
}