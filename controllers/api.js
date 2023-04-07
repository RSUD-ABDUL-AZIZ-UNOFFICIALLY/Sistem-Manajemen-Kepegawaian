const jwt = require('jsonwebtoken');
const axios = require('axios');
const secretKey = process.env.JWT_SECRET_KEY;
const payload = {
    gid: "Server Side",
};


module.exports = {
    sendOtp: (req, res) => {
        try {
            let body = req.body;
            let token = jwt.sign(payload, secretKey, { expiresIn: 60 });

            let otp = Math.floor(10000 + Math.random() * 90000);
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
            return res.status(200).json({
                error: false,
                message: 'send otp success',
                token: token,
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
