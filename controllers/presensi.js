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
            let listJadwal = await Jnsdns.findAll({
                where: {
                    dep: params.dep
                },
                attributes: ["day", "slug"]
            })
            // console.log(listJadwal);
            if (listJadwal.length == 0) {
                return res.status(406).json({
                    error: true,
                    message: "Belum di Aktifkan",
                    // data: users,
                });
            }
            for (let i of users) {
                let presensi = await Jdldns.findAll({
                    where: {
                        nik: i.dataValues.nik,
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
                        for (let y of listJadwal) {
                            // console.log(JSON.parse(y.dataValues.day))
                            // y.dataValues.day = JSON.parse(y.dataValues.day)
                            if (JSON.parse(y.dataValues.day).includes(hari)) {
                                let jadwal = {
                                    nik: i.dataValues.nik,
                                    typeDns: y.dataValues.slug,
                                    date: new Date(year, month, x + 1)
                                }
                                await Jdldns.create(jadwal);
                                break;
                            }

                        }
                    }
                } else {
                    i.dataValues.jadwal = presensi
                }
            }

            return res.status(200).json({
                error: false,
                message: "success",
                data: users,
            });
        } catch (error) {
            console.log(error)
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
    getTypeJadwal: async (req, res) => {
        try {
            let params = req.query;
            let listJadwal = await Jnsdns.findAll({
                where: {
                    dep: params.dep
                },
                attributes: ["type", "slug", "start_min", "start_max", "end_min", "end_max"]
            })
            // console.log(listJadwal);
            if (listJadwal.length == 0) {
                return res.status(406).json({
                    error: true,
                    message: "Belum di Aktifkan",
                    // data: users,
                });
            }
            return res.status(200).json({
                error: false,
                message: "success",
                data: listJadwal
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
        let params = req.body;
        let dateNow = new Date();
        let dateJadwal = new Date(params.date);
        dateJadwal.setHours(0, 0, 0, 0);
        dateNow.setHours(0, 0, 0, 0);
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

                if (time < start) {
                    data.statusIn = "Masuk Cepat"
                    await Absen.create(data)
                    return res.status(400).json({
                        error: true,
                        message: "Anda terlalu cepat Absen Masuk",
                        data: "Jam absen : " + jadwal.start_min + " - " + jadwal.start_max,
                    });
                } else if (time > end) {
                    data.statusIn = "Masuk Terlambat"
                    await Absen.create(data)
                    return res.status(400).json({
                        error: true,
                        message: "Anda terlambat Absen Masuk",
                        data: "Jam absen : " + jadwal.start_min + " - " + jadwal.start_max,
                    });
                } else {
                    data.statusIn = 'Masuk Tepat Waktu';
                    await Absen.create(data)
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
                    absensi = await Absen.findOne({
                        where: {
                            nik: user.nik,
                        },
                        order: [
                            ["date", "DESC"]
                        ]
                    })
                    user.nik = absensi.nik;
                    body.type = absensi.typeDns;
                    body.date = absensi.date;
                    // console.log(absensi)
                    // return res.status(400).json({
                    //     error: true,
                    //     message: "Anda belum Absen Masuk",
                    //     data: null,
                    // });
                }
                console.log(absensi)
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
                if (time < start) {
                    data.statusOut = "Pulang Cepat"
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
                        message: "Anda terlalu cepat Absen Pulang",
                        data: "Jam absen : " + jadwal.end_min + " - " + jadwal.end_max,
                    });
                } else if (time > end) {
                    data.statusOut = "Pulang Terlambat"
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
                    data.statusOut = 'Pulang Tepat Waktu';
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
    },
    riwayat: async (req, res) => {
        try {
            let query = req.query
            let account = req.account
            let dataAbsen = await Absen.findAll({
                where: {
                    nik: account.nik,
                    date: { [Op.startsWith]: query.periode, }
                },
                include: [{
                    model: Jnsdns,
                    attributes: ["type", "start_min", "start_max", "end_min", "end_max"]
                }]
            })

            return res.status(200).json({
                error: false,
                message: "Sukses",
                data: dataAbsen
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