const jwt = require("jsonwebtoken");
const { User, Atasan, Profile } = require("../models");
const { Buffer } = require('buffer');

module.exports = {
    login: async (req, res, next) => {
        try {
            const token = req.cookies.token;
            if (!token) {
                return res.redirect("/");
            }
            const secretKey = process.env.JWT_SECRET_KEY;
            const decoded = jwt.verify(token, secretKey);
            let getUser = await User.findOne({
                where: {
                    nik: decoded.id,
                },
            });
            if (!getUser) {
                res.clearCookie("token");
                return res.redirect("/");
            }
            let getAtasan = await Atasan.findOne({
                where: {
                    user: getUser.nik,
                },
            });
            if (!getAtasan) {
                // set cookie
                let data = {
                    "pesan": "Biodata anda belum lengkap, harap lengkapi profil Anda.",
                    "status" : "warning",
                    "title" : "Warning,",
                    "url" : "/profile",
                }
                data = JSON.stringify(data);
                const encodedData = Buffer.from(data).toString('base64');
                res.cookie("status", encodedData, {
                    // maxAge 5 minutes
                    maxAge: 1000 * 60 * 5,
                    httpOnly: false,
                });
            }else{
            res.clearCookie("status");
            }
            let newToken = jwt.sign({
                id: decoded.id,
                nama: decoded.nama,
                wa: decoded.wa,
            },
                secretKey, { expiresIn: 60 * 60 * 24 * 7 }
            );
            // set cookie
            res.cookie("token", newToken, {
                maxAge: 1000 * 60 * 60 * 24 * 7,
                httpOnly: false,
            });
            next();
        } catch (err) {
            res.clearCookie("token");
            return res.redirect("/");
        }
    },
    checkLogin: (req, res, next) => {
        try {
            const token = req.cookies.token;
            const secretKey = process.env.JWT_SECRET_KEY;
            const decoded = jwt.verify(token, secretKey);
            // echo(decoded);
            if (decoded) {
                return res.redirect("/daily");
            }
            next();
        } catch (err) {
            res.clearCookie("token");
            next();
        }
    },
    logout: (req, res) => {
        res.clearCookie("token");
        res.redirect("/");
    },
    Profile: async (req, res, next) => {
        try {
            const token = req.cookies.token;
            const secretKey = process.env.JWT_SECRET_KEY;
            const decoded = jwt.verify(token, secretKey);
            let getFoto = await Profile.findOne({
                where: {
                    nik: decoded.id,
                },
            });
            if (!getFoto) {
                // get host name
                const host = req.get("host");
                // set cookie
                let data = {
                    "pesan" : "You don't have a profile picture yet, please complete your profile data.",
                    "status" : "warning",
                    "title" : "Warning,",
                    "url" : host+"/asset/img/cowok.png",
                }
                data = JSON.stringify(data);
                const encodedData = Buffer.from(data).toString('base64');
            }
    
            next();
        } catch (err) {
            next();
        }
    }
};
