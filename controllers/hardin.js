const jwt = require("jsonwebtoken");
const axios = require("axios");
const { Pasien } = require("../models");
const { Op } = require("sequelize");
const { sendWa } = require("../helper/message");
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
                            "Mohon jangan berikan kode ini kepada siapapun.\n";
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
    }
};
