const jwt = require("jsonwebtoken");
const { User, Atasan, Access } = require("../models");
const { Buffer } = require('buffer');
const { createClient } = require('redis');
const client = createClient({
    url: process.env.REDIS_URL
});
client.on('error', (error) => {
    console.error(error);
});
client.connect();


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
    checkHakAkses: (data) => {
        return async (req, res, next) => {
            try {
                const token = req.cookies.token;
                if (!token) {
                    return res.redirect("/");
                }
                if (await client.exists(`Token:Accesses:${token}`)) {
                    let check = await client.hExists(`Token:Accesses:${token}`, data);
                    if (check) {
                        next();
                    } else {
                        return res.redirect("/");
                    }
                }
                const secretKey = process.env.JWT_SECRET_KEY;
                const decoded = jwt.verify(token, secretKey);
                let Accesses = await Access.findAll({
                    where: {
                        wa: decoded.wa,
                    }
                });
                let hakAkses = [];
                for (let i = 0; i < Accesses.length; i++) {
                    hakAkses.push(Accesses[i].status);
                    client.hSet(`Token:Accesses:${token}`, Accesses[i].status, 'true');
                }
                client.expire(`Token:Accesses:${token}`, 60 * 60);
                let check = hakAkses.includes(data);
                if (check) {
                    next();
                } else {
                    return res.redirect("/");
                }
            } catch (err) {
                console.log(err);
                return res.redirect("/");
            }
        }
    },

};
