const jwt = require("jsonwebtoken");
const { User, Atasan, Access } = require("../models");
const { Buffer } = require('buffer');

module.exports = {
    login: async (req, res, next) => {
        try {
            const token = req.cookies.token;
            res.cookie("tokens", "a", {
                domain: ".rsudaa.singkawangkota.go.id",
                secure: false,
                maxAge: 1000 * 60 * 60 * 24 * 7,
                httpOnly: true,
            });
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
            req.account = getUser;
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
                if (await req.cache.exists(`Token:Accesses:${token}`)) {
                    let check = await req.cache.hExists(`Token:Accesses:${token}`, data);
                    if (check) {
                        next();
                    } else {
                        return res.redirect("/");
                    }
                } else {
                    const secretKey = process.env.JWT_SECRET_KEY;
                    const decoded = jwt.verify(token, secretKey);
                    let Accesses = await Access.findAll({
                        where: {
                            wa: decoded.wa,
                        }
                    });
                    let hakAkses = [];
                    for (const element of Accesses) {
                        hakAkses.push(element.status);
                        req.cache.hSet(`Token:Accesses:${token}`, element.status, 'true');
                    }
                    req.cache.expire(`Token:Accesses:${token}`, 60 * 60);
                    let check = hakAkses.includes(data);
                    if (check) {
                        next();
                    } else {
                        return res.redirect("/");
                    }
                }

            } catch (err) {
                console.log(err);
                return res.redirect("/");
            }
        }
    },
    // response: (req, res, data) => {
    //     console.log(data);
    //     if (req.status == 500) {
    //         return res.status(500).json({
    //             error: true,
    //             message: req.pesan,
    //             data: req.data,
    //         });
    //     }
    //     if (req.status == 404) {
    //         return res.status(404).json({
    //             error: true,
    //             message: req.pesan,
    //             data: req.data,
    //         });
    //     }
    //     if (req.status == 200) {
    //         return res.status(200).json({
    //             error: false,
    //             message: req.pesan,
    //             data: req.data,
    //         });
    //     }
    //     return res.status(504).json({
    //         error: false,
    //         message: req.pesan,
    //         data: req.data,
    //     });
    // },
};
