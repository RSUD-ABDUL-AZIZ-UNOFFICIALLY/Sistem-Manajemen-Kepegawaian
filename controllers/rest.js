"use strict";
const { default: axios } = require('axios');
const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_WA;
const { User, Access, Otp } = require('../models');
const payload = {
    gid: "Server Side",
};
module.exports = {
    getOtp: async (req, res) => {
        try {
            let body = req.body;
            let token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
            if (!body.phone) {
                return res.status(400).json({
                    status: true,
                    message: 'Phone number is required',
                    data: null
                });
            }
            if (body.phone.length < 10) {
                return res.status(400).json({
                    status: true,
                    message: 'Phone number must be 10 digits',
                    data: null
                });
            }
            let akses = await Access.findAll({
                where: {
                    wa: body.phone,
                }
            });
            if (akses.length == 0) {
                return res.status(400).json({
                    status: true,
                    message: 'Phone number is not registered',
                    data: null
                });
            }
            if (akses.includes(body.app_name)) {
                return res.status(400).json({
                    status: true,
                    message: 'Phone number is not allowed to access this application',
                    data: null
                });
            }
            let permission = [];
            for (let i of akses) {
                permission.push(i.status);
            }
            let otp = Math.floor(10000 + Math.random() * 90000);
            let user = await User.findOne({
                where: {
                    wa: body.phone,
                },
                attributes: ['nama', 'JnsKel']
            });
            let jnsKel = (user.JnsKel == 'Laki-laki') ? 'Bapak ' : 'Ibu ';
            let data = JSON.stringify({
                message:
                    "Halo " +
                    jnsKel +
                    " " +
                    user.nama +
                    "\n" +
                    "Kode OTP anda adalah " +
                    "*" + otp + "*" +
                    "\n" +
                    "Kode ini akan kadaluarsa dalam 5 menit.",
                telp: body.phone,
            });
            let config = {
                method: "post",
                url: process.env.HOSTWA + "/api/wa/send",
                headers: {
                    Authorization: "Bearer " + token,
                    "Content-Type": "application/json",
                },
                data: data,
            };
            await axios.request(config);
            await Otp.create({
                token: otp,
                wa: body.phone,
            });
            return res.status(200).json({
                status: true,
                message: 'OTP sent successfully',
                data: {
                    phone: body.phone,
                    permission: permission,
                    user: user
                }
            });
        } catch (error) {
            console.log(error.message);
            return res.status(500).json({
                status: false,
                message: 'Internal server error',
                data: error.message
            });
        }
    },
    login: async (req, res) => {
        try {
            let body = req.body;
            if (!body.phone || !body.otp) {
                return res.status(400).json({
                    status: true,
                    message: 'Phone number and OTP are required',
                    data: null
                });
            }
            let checkOtp = await Otp.findOne({
                where: {
                    token: body.otp,
                    wa: body.phone,
                },
            });
            if (!checkOtp) {
                return res.status(401).json({
                    error: true,
                    message: "Invalid OTP",
                });
            }
            let now = new Date();
            let createdAt = new Date(checkOtp.createdAt); // Ganti dengan nilai yang sesuai dari createdAt
            let diff = (now.getTime() - createdAt.getTime()) / 1000; // Menghitung selisih waktu dalam detik
            if (diff > 300) {
                return res.status(401).json({
                    error: true,
                    message: "OTP kedaluwarsa silahkan klik Minta OTP",
                });
            }
            let akses = await Access.findAll({
                where: {
                    wa: body.phone
                }
            });
            if (akses.length == 0) {
                return res.status(400).json({
                    status: true,
                    message: 'Phone number is not registered',
                    data: null
                });
            }
            let permission = [];
            for (let i of akses) {
                permission.push(i.status);
            }
            let user = await User.findOne({
                where: {
                    wa: body.phone,
                },
            });
            let token = jwt.sign(
                {
                    id: user.nik,
                    nama: user.nama,
                    wa: user.wa,
                    permission: permission
                },
                secretKey,
                { expiresIn: 60 * 60 * 24 * 7 }
            );
            // set cookie
            res.cookie("token_api", token, {
                maxAge: 1000 * 60 * 60 * 24 * 7,
                httpOnly: false,
            });
            return res.status(200).json({
                error: false,
                message: "Selamat datang, " + user.nama + "!",
                permission: permission,
                token_api: token
            });
        } catch (error) {
            console.log(error.message);
            return res.status(500).json({
                status: false,
                message: 'Internal server error',
                data: error.message
            });
        }

    }
};