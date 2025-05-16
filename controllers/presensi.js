"use strict";
const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET_KEY;
const {
    Sequelize,
    User,
    Instalasi,
    Departemen,
    Absen,
    Admin_Absen,
    Jnsdns,
    Jdldns,
    Cuti,
    Jns_cuti,
    Ledger_cuti,
} = require("../models");
const { cekLocation } = require("../helper/casting");
const { formatDateToLocalYMD, hitungMenitTerlambat, hitungCepatPulang } = require("../helper");
const { Op, literal } = require("sequelize");
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
        let isIntalasi = await Admin_Absen.findAll({
            where: {
                nik: decoded.id
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
                attributes: ["type", "slug", "day", "state", "start_min", "start_max", "end_min", "end_max"]
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
    postTypeJadwal: async (req, res) => {
        let params = req.body;
        try {
            let findID = await Jnsdns.findOne({
                where: {
                    slug: params.jnsDNS + "-" + params.departemen
                },
                attributes: ["id"]
            })
            if (!findID) {
                if (params.libur) {
                    let setDNS = await Jnsdns.create({
                        type: params.jnsDNS,
                        slug: params.jnsDNS + "-" + params.departemen,
                        dep: params.departemen,
                        start_min: "00:00:00",
                        start_max: "00:00:00",
                        end_min: "00:00:00",
                        end_max: "00:00:00",
                        state: 0,
                        day: JSON.stringify(params.hari),
                    });
                    return res.status(200).json({
                        error: false,
                        message: "success",
                        data: setDNS
                    });
                }
                let setDNS = await Jnsdns.create({
                    type: params.jnsDNS,
                    slug: params.jnsDNS + "-" + params.departemen,
                    dep: params.departemen,
                    start_min: params.jamMulai,
                    start_max: params.jamTelat,
                    end_min: params.pulangCepat,
                    end_max: params.pulangTelat,
                    state: 1,
                    day: JSON.stringify(params.hari),
                });
                return res.status(200).json({
                    error: false,
                    message: "success",
                    data: setDNS
                });
            } else {
                if (params.libur) {
                    let setDNS = await Jnsdns.update({
                        start_min: "00:00:00",
                        start_max: "00:00:00",
                        end_min: "00:00:00",
                        end_max: "00:00:00",
                        state: 0,
                        day: JSON.stringify(params.hari),
                    }, {
                        where: {
                            id: findID.id,
                        },
                    });
                    return res.status(200).json({
                        error: false,
                        message: "success",
                        data: setDNS
                    });
                }
                let setDNS = await Jnsdns.update({
                    start_min: params.jamMulai,
                    start_max: params.jamTelat,
                    end_min: params.pulangCepat,
                    end_max: params.pulangTelat,
                    state: 1,
                    day: JSON.stringify(params.hari),
                }, {
                    where: {
                        id: findID.id,
                    },
                });
                return res.status(200).json({
                    error: false,
                    message: "success",
                    data: setDNS
                });

            }
        } catch (error) {
            return res.status(400).json({
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
        // if (dateJadwal < dateNow) {
        //     return res.status(400).json({
        //         error: true,
        //         message: "Tidak dapat mengubah tanggal mudur",
        //     });
        // }
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
            let body = req.body;
            let cek = await cekLocation([body.latitude, body.longitude]);
            console.log(cek)
            return res.status(200).json({
                error: false,
                message: "success",
                data: cek
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
            let typeDns = data.dataValues.typeDns.split("-");
            if (typeDns[0] == "X") {
                let day = new Date(date.getTime() - (24 * 60 * 60 * 1000));
                data = await Jdldns.findOne({
                    where: {
                        nik: user.nik,
                        date: day
                    },
                    include: [
                        {
                            model: Jnsdns,
                            as: 'dnsType'
                        }
                    ]
                });

            }

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
                    loactionIn: body.loactionIn,
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
                    loactionOut: body.loactionIn,
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
                }],
                order: [
                    ["date", "DESC"]
                ]
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
    },
    recap: async (req, res) => {
        try {
            let query = req.query
            let account = req.account
            if (query.periode == undefined) {
                return res.status(400).json({
                    error: true,
                    message: "Periode tidak di temukan",
                });
            }
            let today = new Date().toISOString().split('T')[0];

            if (query.periode > today.slice(0, 7)) {
                return res.status(400).json({
                    error: true,
                    message: "Periode tidak boleh lebih besar dari bulan ini",
                });
            }
            let cache = await req.cache.json.get(`SIMPEG:recapAbens:${query.periode}:${account.nik}`, '$');
            if (cache != null) {
                return res.status(200).json({
                    error: false,
                    message: "success",
                    data: cache,
                });
            }
            let periode = new Date(`${query.periode}-01`);
            let endOfMonth = new Date(periode.getFullYear(), periode.getMonth() + 1, 0);
            let lastDay = formatDateToLocalYMD(endOfMonth);
            if (endOfMonth > new Date()) {
                lastDay = formatDateToLocalYMD(new Date());
            } else {
                lastDay = formatDateToLocalYMD(endOfMonth);
            }

            let year = new Date(query.periode).getFullYear();
            let findCuti = await Ledger_cuti.findAll({
                where: {
                    nik_user: account.nik,
                    periode: year
                },
                attributes: ['periode', 'sisa_cuti'],
                include: [
                    {
                        model: Cuti,
                        as: 'data_cuti',
                        attributes: ['id', 'type_cuti', 'mulai', 'samapi'],
                        where: {

                            [Op.or]: [
                                { mulai: { [Op.startsWith]: query.periode }, },
                                { samapi: { [Op.startsWith]: query.periode } },

                            ]
                        },
                        include: [
                            {
                                model: Jns_cuti,
                                as: 'jenis_cuti',
                                attributes: ['type_cuti']
                            }
                        ]
                    }
                ],
                order: [
                    ["createdAt", "ASC"]
                ]
            })
            for (let i of findCuti) {
                let cuti = i.data_cuti.dataValues;
                console.log(cuti.mulai)
                console.log(cuti.samapi)
                console.log(cuti.jenis_cuti.type_cuti)
                const typeMap = {
                    "Cuti Tahunan": "CT",
                    "Cuti Bersama": "CB",
                    "Cuti Sakit": "CS",
                    "Cuti Melahirkan": "CM"
                };

                const typeCT = typeMap[cuti.jenis_cuti.type_cuti];
                const mulai = new Date(cuti.mulai);
                const sampai = new Date(cuti.samapi);

                for (let d = new Date(mulai); d <= sampai; d.setDate(d.getDate() + 1)) {
                    const tanggal = d.toISOString().split('T')[0];
                    console.log(tanggal);
                    let update = await Jdldns.update({
                        typeDns: typeCT + "-" + account.dep,
                    }, {
                        where: {
                            nik: account.nik,
                            date: tanggal
                        }
                    })
                    console.log(update)
                }
            }
            let getAbsenDNS = await Jdldns.findAll({
                where: {
                    nik: account.nik,
                    date: { [Op.between]: [query.periode + '-01', lastDay] }
                    // date: { [Op.startsWith]: query.periode }
                },
                include: [
                    {
                        model: Absen,
                        as: 'absen',
                        required: false, // LEFT JOIN
                        on: literal(
                            '`absen`.`date` = `Jdldns`.`date` AND `absen`.`nik` = `Jdldns`.`nik` AND `absen`.`typeDns` = `Jdldns`.`typeDns`'
                        )
                    }, {
                        model: Jnsdns,
                        as: 'dnsType',
                        where: {
                            state: 1
                        },
                        attributes: ["type", "state", "start_min", "start_max", "end_min", "end_max"]
                    }
                ]
            })
            getAbsenDNS = getAbsenDNS.filter(item => item.dnsType.type !== 'X');
            let getjdlDNS = await Jdldns.findAll({
                where: {
                    nik: account.nik,
                    date: { [Op.between]: [query.periode + '-01', lastDay] }
                    // date: { [Op.startsWith]: query.periode }
                },
                include: [
                    {
                        model: Jnsdns,
                        as: 'dnsType',
                        where: {
                            state: 0
                        },
                        attributes: ["type", "state", "start_min", "start_max", "end_min", "end_max"]
                    }]
            })
            const countByType = getjdlDNS.reduce((acc, item) => {
                const type = item.dnsType.type;
                acc[type] = (acc[type] || 0) + 1;
                return acc;
            }, {});
            let tidakAbsen = 0, tidakAbsenMasuk = 0, tidakAbsenPulang = 0, masukTepatWaktu = 0, pulangTepatWaktu = 0, telatmasuk = 0, cepatPulang = 0;

            for (let i of getAbsenDNS) {
                if (i.absen == null) {
                    tidakAbsen += 1
                    continue;
                }
                if (i.absen.cekIn == null) {
                    tidakAbsenMasuk += 1
                }
                if (i.absen.cekOut == null) {
                    tidakAbsenPulang += 1
                }
                if (i.absen.statusIn == "Masuk Tepat Waktu") {
                    masukTepatWaktu += 1
                }
                if (i.absen.statusOut == "Pulang Tepat Waktu") {
                    pulangTepatWaktu += 1
                }
                if (i.absen.statusIn == "Masuk Terlambat") {
                    hitungMenitTerlambat(i.absen.cekIn, i.dnsType.start_max)
                    telatmasuk += hitungMenitTerlambat(i.absen.cekIn, i.dnsType.start_max)
                }
                if (i.absen.statusOut == "Pulang Cepat") {
                    hitungCepatPulang(i.absen.cekOut, i.dnsType.end_min)
                    cepatPulang += hitungCepatPulang(i.absen.cekOut, i.dnsType.end_min)
                }
            }
            let result = {
                hariKerja: getAbsenDNS.length,
                libur: getjdlDNS.length,
                typeLibur: countByType,
                tidakAbsen: tidakAbsen,
                tidakAbsenMasuk: tidakAbsenMasuk,
                tidakAbsenPulang: tidakAbsenPulang,
                masukTepatWaktu: masukTepatWaktu,
                pulangTepatWaktu: pulangTepatWaktu,
                telatmasuk: telatmasuk,
                cepatPulang: cepatPulang
            }
            req.cache.json.set(`SIMPEG:recapAbens:${query.periode}:${account.nik}`, '$', result);
            req.cache.expire(`SIMPEG:recapAbens:${query.periode}:${account.nik}`, 60 * 10);

            return res.status(200).json({
                error: false,
                message: "Sukses",
                range: [query.periode + '-01', lastDay],
                data: result,


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
    attendance: async (req, res) => {
        try {
            let query = req.query
            let account = req.account
            let findUser = await User.findAll({
                where: {
                    dep: query.dep
                },
                attributes: ['nik'],
            })
            findUser = findUser.map((item) => {
                return item.nik
            })
            let getAbsenDNS = await Jdldns.findAll({
                where: {
                    nik: { [Op.in]: findUser },
                    date: { [Op.between]: [query.start, query.end] }
                    // date: { [Op.startsWith]: query.periode }
                },
                order: [
                    ["date", "DESC"]
                ],
                include: [
                    {
                        model: Absen,
                        as: 'absen',
                        required: false, // LEFT JOIN
                        on: literal(
                            '`absen`.`date` = `Jdldns`.`date` AND `absen`.`nik` = `Jdldns`.`nik` AND `absen`.`typeDns` = `Jdldns`.`typeDns`'
                        ),
                        attributes: ["cekIn", "statusIn", "keteranganIn", "loactionIn", "keteranganIn", "cekOut", "statusOut", "keteranganOut", "loactionOut"]
                    }, {
                        model: Jnsdns,
                        as: 'dnsType',
                        where: {
                            state: 1
                        },
                        attributes: ["type", "state"]
                    },
                    {
                        model: User,
                        as: 'user',
                        attributes: ['nik', 'nama'],
                        on: literal(
                            '`User`.`nik` = `Jdldns`.`nik`'
                        )
                    }
                ]
            })
            getAbsenDNS = getAbsenDNS.filter(item => item.dnsType.type !== 'X');
            for (let i of getAbsenDNS) {
                if (i.absen == null) {
                    console.log(i)
                    i.dataValues.absen = {
                        cekIn: null,
                        statusIn: null,
                        keteranganIn: null,
                        loactionIn: null,
                        keteranganIn: null,
                        cekOut: null,
                        statusOut: null,
                        keteranganOut: null,
                        loactionOut: null
                    }
                }
            }
            return res.status(200).json({
                error: false,
                message: "Sukses",
                data: getAbsenDNS
            })
        }
        catch (error) {
            console.log(error)
            return res.status(500).json({
                error: true,
                message: "internal server error",
                data: error,
            });
        }
    },
}