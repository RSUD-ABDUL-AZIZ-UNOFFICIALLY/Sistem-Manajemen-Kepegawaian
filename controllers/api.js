const jwt = require('jsonwebtoken');
const axios = require('axios');
const { Otp, User } = require('../models');
const secretKey = process.env.JWT_SECRET_KEY;
const payload = {
    gid: "Server Side",
};

module.exports = {
    sendOtp: (req, res) => {
        try {
            let body = req.body;
            // find user by phone number
            let token = jwt.sign(payload, secretKey, { expiresIn: 60 });
            let user = User.findOne({
                where: {
                    wa: body.phone
                }
            });
            if (!user) {
                let data = JSON.stringify({
                    "message": "Maaf, nomor anda belum terdaftar di sistem kami. Silahkan hubungi admin untuk melakukan registrasi.",
                    "telp": body.phone
                });
                let config = {
                    method: 'post',
                    url: process.env.HOSTWA + '/api/wa/send',
                    headers: {
                        Authorization : 'Bearer ' + token,
                        'Content-Type': 'application/json'
                    },
                    data: data
                };
                axios(config);
                return res.status(404).json({
                    error: true,
                    message: 'Nomor anda belum terdaftar di sistem kami',
                });
            }
            let otp = Math.floor(10000 + Math.random() * 90000)
            let data = JSON.stringify({
                "message": "Kode OTP Anda adalah " + otp,
                "telp": body.phone
            });
            let config = {
                method: 'post',
                url: process.env.HOSTWA + '/api/wa/send',
                headers: {
                    Authorization : 'Bearer ' + token,
                    'Content-Type': 'application/json'
                },
                data: data
            };
            axios(config);
            return res.status(200).json({
                error: false,
                message: 'Silahkan cek di whatsapp anda'
            });
        } catch (error) {
            return res.status(500).json({
                error: true,
                message: error.message,
            });
        }

    },
    verifyOtp: (req, res) => {
        // res.send('Hello World!')
        res.render('verifyOtp', { title: "Verify OTP | LKP" })
    }
}
