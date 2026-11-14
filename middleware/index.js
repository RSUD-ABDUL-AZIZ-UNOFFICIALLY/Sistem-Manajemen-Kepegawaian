const jwt = require("jsonwebtoken");
const { User, Atasan, Access, Session, sequelize } = require("../models");
const { Buffer } = require('buffer');
const secretKey = process.env.JWT_SECRET_KEY;
const uuid = require('uuid');

module.exports = {
    login: async (req, res, next) => {
        let t;
        try {
            const token = req.cookies.token;
            if (!token) {
                res.clearCookie("token");
                return res.redirect("/?redirect_url=" + req.originalUrl);
            }
            let userID = req.cookies.userID;
            if (!userID) {
                // userID = uuid.v7();
                // res.cookie("userID", userID, {
                //     httpOnly: true,
                //     secure: true,
                // });
                // res.clearCookie("token");
                return res.redirect("/?redirect_url=" + req.originalUrl);
            }
            const decoded = jwt.verify(token, secretKey);
            t = await sequelize.transaction();

            let getUser = await req.cache.json.get('SIMPEG:user:' + decoded.id);
            if (!getUser) {
                getUser = await User.findOne({
                    where: { nik: decoded.id },
                    transaction: t
                });

                if (!getUser) {
                    await t.rollback();
                    res.clearCookie("token");
                    return res.redirect("/?redirect_url=" + req.originalUrl);
                } else {
                    await req.cache.json.set('SIMPEG:user:' + decoded.id, '$', getUser);
                    req.cache.expire('SIMPEG:user:' + decoded.id, 60 * 60 * 24);
                    req.account = getUser;
                }
            }
            req.account = getUser;
            const value = await req.cache.get('SIMPEG:seen:' + userID);
            if (!value) {
                let cek_session = await Session.findOne({
                    where: {
                        nik: decoded.id,
                        visited_id: userID,
                        session_token: token
                    },
                    order: [["updatedAt", "DESC"]],
                    transaction: t
                });

                if (!cek_session) {
                    await t.rollback();
                    res.clearCookie("token");
                    return res.redirect("/?redirect_url=" + req.originalUrl);
                } else if (['close', 'logout', 'expire'].includes(cek_session.status)) {
                    await t.rollback();
                    res.clearCookie("token");
                    return res.redirect("/");
                }
                let newToken = jwt.sign({
                    id: getUser.nik,
                    nama: getUser.nama,
                    wa: getUser.wa,
                }, secretKey, { expiresIn: 60 * 60 * 24 * 7 });

                await Session.update({
                    session_token: newToken,
                    ip_address: req.headers['x-real-ip'],
                    user_agent: req.headers['user-agent'] + '#' + req.headers['sec-ch-ua-platform'] + '#' + req.headers['sec-ch-ua'],
                    status: 'online',
                }, {
                    where: { id: cek_session.id },
                    transaction: t
                });

                res.cookie("token", newToken, {
                    maxAge: 1000 * 60 * 60 * 24 * 7,
                    httpOnly: false,
                    secure: true
                });
                await req.cache.set('SIMPEG:seen:' + userID, getUser.nama);
                req.cache.expire('SIMPEG:seen:' + userID, 60);
            }

            let getAtasan = await req.cache.json.get('SIMPEG:atasan:' + decoded.id);

            if (!getAtasan) {
                getAtasan = await Atasan.findOne({
                    where: { user: decoded.id },
                    transaction: t
                });

                if (!getAtasan) {
                    let data = {
                        "pesan": "Biodata anda belum lengkap, harap lengkapi profil Anda.",
                        "status": "warning",
                        "title": "Warning,",
                        "url": "/profile",
                    }
                    const encodedData = Buffer.from(JSON.stringify(data)).toString('base64');
                    res.cookie("status", encodedData, {
                        // FIX: Tambahkan operator perkalian
                        maxAge: 1000 * 60 * 5,
                        httpOnly: false,
                    });
                }
                res.clearCookie("status");
                await req.cache.json.set('SIMPEG:atasan:' + decoded.id, '$', getAtasan);
                // FIX: Tambahkan operator perkalian
                req.cache.expire('SIMPEG:atasan:' + decoded.id, 60 * 60 * 24);
            }
            await t.commit();
            return next();
        } catch (err) {
            console.error('Login Error:', err);
            if (t && !t.finished) {
                await t.rollback();
            }
            res.clearCookie("token");
            return res.redirect("/?redirect_url=" + req.originalUrl);
        }
    },
    checkLogin: async (req, res, next) => {
        try {
            const token = req.cookies.token;
            if (!token) {
                return next();
            }
            const userID = req.cookies.userID;
            const decoded = jwt.verify(token, secretKey);
            if (decoded) {
                let cek_session = await Session.findOne({
                    where: {
                        nik: decoded.id,
                        session_token: token,
                        visited_id: userID
                    },
                    order: [["updatedAt", "DESC"]]
                });

                if (!cek_session) {
                    res.clearCookie("token");
                    return next();
                }
                return res.redirect("/daily");
            }
            return next();
        } catch (err) {
            console.error('Login Error:', err);
            res.clearCookie("token");
            return next();
        }
    },
    checkToken: async (req, res, next) => {
        try {
            const token = req.cookies.token;
            const decoded = jwt.verify(token, secretKey);
            if (decoded) {
                let getUser = await req.cache.json.get('SIMPEG:user:' + decoded.id);
                if (!getUser) {
                    getUser = await User.findOne({
                        where: {
                            nik: decoded.id,
                        },
                    }, { transaction: t });
                    if (!getUser) {
                        await t.rollback();
                        res.clearCookie("token");
                        return res.redirect("/?redirect_url=" + req.originalUrl);
                    } else {
                        await req.cache.json.set('SIMPEG:user:' + decoded.id, '$', getUser);
                        req.cache.expire('SIMPEG:user:' + decoded.id, 60 * 60 * 24);
                        req.account = getUser;
                        return next();
                    }
                }
                req.account = getUser;
                return next();
            } else {
                res.clearCookie("token");
                return res.redirect("/");
            }
        } catch (err) {
            res.clearCookie("token");
            return res.redirect("/");
        }
    },
    logout: (req, res) => {
        try {
            const token = req.cookies.token;
            const decoded = jwt.verify(token, secretKey);
            let userID = req.cookies.userID;
            Session.update({
                status: 'logout',
            }, {
                where: {
                    nik: decoded.id,
                    visited_id: userID,
                },
            });
            res.clearCookie("token");
            return res.redirect("/");
        } catch (error) {
            res.clearCookie("token");
            return res.redirect("/");
        }

    },
    checkHakAkses: (data) => {
        return async (req, res, next) => {
            try {
                const token = req.cookies.token;
                const secretKey = process.env.JWT_SECRET_KEY;
                const decoded = jwt.verify(token, secretKey);
                if (!token) {
                    return res.redirect("/");
                }
                if (await req.cache.exists(`Token:Accesses:${decoded.id}`)) {
                    let check = await req.cache.hExists(`Token:Accesses:${decoded.id}`, data);
                    if (check) {
                        return next();
                    } else {
                        return res.redirect("/");
                    }
                } else {
                    let Accesses = await Access.findAll({
                        where: {
                            wa: decoded.wa,
                        }
                    });
                    let hakAkses = [];
                    for (const element of Accesses) {
                        hakAkses.push(element.status);
                        req.cache.hSet(`Token:Accesses:${decoded.id}`, element.status, 'true');
                    }
                    req.cache.expire(`Token:Accesses:${decoded.id}`, 60 * 60);
                    let check = hakAkses.includes(data);
                    if (check) {
                        return next();
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
    tokenGen: (req, res) => {
        let newToken = jwt.sign({
            nik: req.body.nik,
            nama: req.body.nama
        }, secretKey, { expiresIn: 60 * 60 });
        return res.json({
            token: newToken
        })

    }
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
