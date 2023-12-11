const jwt = require("jsonwebtoken");
const axios = require("axios");
const { Pasien, FamilyPasein } = require("../models");
const { Op } = require("sequelize");
const { sendWa } = require("../helper/message");
const { apiGetSimrs } = require("../helper/simrs");
const { createClient } = require('redis');
const client = createClient({
    url: process.env.REDIS_URL
});
client.on('error', (error) => {
    console.error(error);
});
client.connect();


module.exports = {
    sendOtp: async (req, res) => {
        try {
            let { phone } = req.body;
            if (!phone) {
                return res.status(400).json({
                    error: true,
                    message: "Nomor telepon tidak boleh kosong",
                });
            }
            if (phone.length < 10) {
                return res.status(400).json({
                    error: true,
                    message: "Nomor telepon tidak valid",
                });
            }
            let user = await Pasien.findOne({
                where: {
                    wa: phone,
                },
            });
            if (!user) {
                let random = Math.floor(10000 + Math.random() * 9000);
                let pesan = "Pendaftaran Hardin Online \n" +
                            "Kode OTP anda *"+ random +"* \n" +
                            "Kode ini akan kadaluarsa dalam 5 menit. \n" +
                            "Mohon jangan berikan kode ini kepada siapapun.";
                let data = JSON.stringify({
                    message: pesan,
                    telp: phone
                });
                client.hSet(`hardinOnline:OTP`, phone ,random);
                client.set(`hardinOnline:OTP:${phone}`, random);
                client.expire(`hardinOnline:OTP:${phone}`, 5*60);
                console.log(data)
                await sendWa(data);
                return res.status(200).json({
                    error: false,
                    message: "Kode OTP telah dikirim ke nomor Anda",
                });
            }
            return res.status(400).json({
                error: false,
                message: "Nomor anda telah terdaftar",
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                error: true,
                message: "Internal Server Error",
              });
        }
    },
    daftar: async (req, res) => {
        try {
            let { name, phone, otp, nik } = req.body;
            if (!name || !phone || !otp || !nik) {
                return res.status(400).json({
                    error: true,
                    message: "Data tidak boleh kosong",
                });
            }
            if (phone.length < 10) {
                return res.status(400).json({
                    error: true,
                    message: "Nomor telepon tidak valid",
                });
            }
            if (nik.length != 16) {
                return res.status(400).json({
                    error: true,
                    message: "NIK tidak valid",
                });
            }
            let user = await Pasien.findOne({
                where: {
                    [Op.or]: {
                    wa: phone,
                    nik: nik
                    }
                },
            });
            if (user) {
                return res.status(400).json({
                    error: true,
                    message: "Nomor telepon telah terdaftar",
                });
            }
            let otpRedis = await client.get(`hardinOnline:OTP:${phone}`);
            if (otpRedis != otp) {
                return res.status(400).json({
                    error: true,
                    message: "Kode OTP tidak valid",
                });
            }
            let data = {
                fullname: name,
                wa: phone,
                nik: nik
            }
            await Pasien.create(data);
            return res.status(200).json({
                error: false,
                message: "success",
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                error: true,
                message: "Internal Server Error",
              });
        }
    },
    loginSendOtp: async (req, res) => {
        try {
            let { phone } = req.body;
            if (!phone) {
                return res.status(400).json({
                    error: true,
                    message: "Nomor telepon tidak boleh kosong",
                });
            }
            if (phone.length < 10) {
                return res.status(400).json({
                    error: true,
                    message: "Nomor telepon tidak valid",
                });
            }
            let user = await Pasien.findOne({
                where: {
                    wa: phone,
                },
            });
            if (user) {
                let random = Math.floor(10000 + Math.random() * 9000);
                let pesan = "Pendaftaran Hardin Online \n" +
                    "Kode OTP anda *" + random + "* \n" +
                    "Kode ini akan kadaluarsa dalam 5 menit. \n" +
                    "Mohon jangan berikan kode ini kepada siapapun.";
                let data = JSON.stringify({
                    message: pesan,
                    telp: phone
                });
                client.hSet(`hardinOnline:OTP`, phone, random);
                client.set(`hardinOnline:OTP:${phone}`, random);
                client.expire(`hardinOnline:OTP:${phone}`, 5 * 60);
                console.log(data)
                await sendWa(data);
                return res.status(200).json({
                    error: false,
                    message: "Kode OTP telah dikirim ke nomor Anda",
                });
            }
            return res.status(400).json({
                error: false,
                message: "Nomor anda belum terdaftar",
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                error: true,
                message: "Internal Server Error",
            });
        }
    },
    login: async (req, res) => {
        try {
            let { phone, otp } = req.body;
            if (!phone || !otp) {
                return res.status(400).json({
                    error: true,
                    message: "Data tidak boleh kosong",
                });
            }
            if (phone.length < 10) {
                return res.status(400).json({
                    error: true,
                    message: "Nomor telepon tidak valid",
                });
            }
            let user = await Pasien.findOne({
                where: {
                    wa: phone,
                },
            });
            if (!user) {
                return res.status(400).json({
                    error: true,
                    message: "Nomor telepon belum terdaftar",
                });
            }
            let otpRedis = await client.get(`hardinOnline:OTP:${phone}`);
            if (otpRedis != otp) {
                return res.status(400).json({
                    error: true,
                    message: "Kode OTP tidak valid",
                });
            }
            let token = jwt.sign(
                {
                    id: user.id,
                    name: user.fullname,
                    phone: user.wa,
                    nik: user.nik
                },
                process.env.JWT_SECRET_KEY,
                { expiresIn: "7d" }
            );
            return res.status(200).json({
                error: false,
                message: "success",
                data: {
                    token: token,
                    user: user
                }
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                error: true,
                message: "Internal Server Error",
            });
        }
    },
    getFamily: async (req, res) => {
        try {
            let { id } = req.user;
            let family = await FamilyPasein.findAll({
                where: {
                    familyId: id,
                },
            });
            console.log(family);
            if (family.length < 1) {
                return res.status(400).json({
                    error: true,
                    message: "Maaf, silahakan verifikasi data anda terlebih dahulu di loket pendaftaran",
                });
            }
            return res.status(200).json({
                error: false,
                message: "success",
                data: family
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                error: true,
                message: "Internal Server Error",
            });
        }
    },
    getFamilys: async (req, res) => {
        try {
            let { id_akun } = req.query;
            let family = await FamilyPasein.findAll({
                where: {
                    familyId: id_akun,
                },
            });
            return res.status(200).json({
                error: false,
                message: "success",
                data: family
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                error: true,
                message: "Internal Server Error",
            });
        }
    },
    addFamily: async (req, res) => {
        try {
            let { name, nik, noRm, familyId, hubungan } = req.body;
            if (!name || !nik || !noRm || !familyId || !hubungan) {
                return res.status(400).json({
                    error: true,
                    message: "Data tidak boleh kosong",
                });
            }
            if (nik.length != 16) {
                return res.status(400).json({
                    error: true,
                    message: "NIK tidak valid",
                });
            }
            let data = {
                familyId: familyId,
                nama: name,
                hubungan: hubungan,
                nik: nik,
                noRm: noRm
            }
            try {
                await FamilyPasein.create(data);
            } catch (error) {
                return res.status(401).json({
                    error: false,
                    message: "Data sudah ada",
                });

            }
            return res.status(200).json({
                error: false,
                message: "success",
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                error: true,
                message: "Internal Server Error",
            });
        }
    },
    getUser: async (req, res) => {
        try {
            let { no_wa } = req.query;
            if (!no_wa) {
                return res.status(400).json({
                    error: true,
                    message: "no_wa tidak boleh kosong",
                });
            }
            let user = await Pasien.findOne({
                where: {
                    wa: no_wa,
                },
            });
            if (!user) {
                return res.status(400).json({
                    error: true,
                    message: "no whatsapp tidak terdaftar",
                });
            }
            let family = await FamilyPasein.findAll({
                where: {
                    familyId: user.id,
                },
            });
            user.family = family;
            return res.status(200).json({
                error: false,
                message: "success",
                data: { user, family }
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                error: true,
                message: "Internal Server Error",
            });
        }
    },
    getPasien: async (req, res) => {
        try {
            let { search } = req.query;
            let data = await apiGetSimrs('/api/petugas/pasien?limit=6&search=' + search)
            return res.status(200).json({
                error: false,
                message: "success",
                data: data.data
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                error: true,
                message: "Internal Server Error",
            });
        }
    },
    getPasienDetail: async (req, res) => {
        try {
            let { no_rkm_medis } = req.params;
            let data = await apiGetSimrs('/api/petugas/pasien/' + no_rkm_medis)
            console.log(no_rkm_medis)
            return res.status(200).json({
                error: false,
                message: "success",
                data: data.data
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                error: true,
                message: "Internal Server Error",
            });
        }
    }
};
