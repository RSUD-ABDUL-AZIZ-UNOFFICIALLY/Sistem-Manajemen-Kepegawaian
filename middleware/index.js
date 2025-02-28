const jwt = require("jsonwebtoken");
const { User, Atasan, Access, Session, sequelize } = require("../models");
const { Buffer } = require('buffer');
const secretKey = process.env.JWT_SECRET_KEY;

module.exports = {
    login: async (req, res, next) => {
        try {
            const token = req.cookies.token;
            if (!token) {
                res.clearCookie("token");   
                return res.redirect("/");
            }
            const decoded = jwt.verify(token, secretKey);
            let t = await sequelize.transaction();
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
                    return res.redirect("/");
                } else {
                    await req.cache.json.set('SIMPEG:user:' + decoded.id, '$', getUser);
                    req.cache.expire('SIMPEG:user:' + decoded.id, 60 * 60 * 24);
                    req.account = getUser;
                }
            }
            req.account = getUser;
            const value = await req.cache.get('SIMPEG:seen:' + token);
            if (!value) {
                let cek_session = await Session.findOne({
                    where: {
                        nik: decoded.id,
                        session_token: token,
                    },
                }, { transaction: t });
                if (!cek_session) {
                    await t.rollback();
                    res.clearCookie("token");
                    return res.redirect("/");
                }
                if (cek_session.status == 'close' || cek_session.status == 'logout') {
                    await t.rollback();
                    res.clearCookie("token");
                    return res.redirect("/");
                }
                let newToken = jwt.sign({
                    id: getUser.nik,
                    nama: getUser.nama,
                    wa: getUser.wa,
                }, secretKey, { expiresIn: 60 * 60 * 24 * 7 });
                res.cookie("token", newToken, {
                    maxAge: 1000 * 60 * 60 * 24 * 7,
                    httpOnly: false,
                    secure: true
                });
                await Session.update({
                    session_token: newToken,
                    ip_address: req.headers['x-real-ip'],
                    user_agent: req.headers['user-agent'] + '#' + req.headers['sec-ch-ua-platform'] + '#' + req.headers['sec-ch-ua'],
                    status: 'online',
                }, {
                    where: {
                        nik: decoded.id,
                        session_token: token,
                    },
                }, { transaction: t });
            }

            // let getUser = await User.findOne({
            //     where: {
            //         nik: decoded.id,
            //     },
            // });
            let getAtasan = await req.cache.json.get('SIMPEG:atasan:' + decoded.id);

            if (!getAtasan) {
                getAtasan = await Atasan.findOne({
                    where: {
                        user: decoded.id,
                    },
                }, { transaction: t });
                if (!getAtasan) {
                    let data = {
                        "pesan": "Biodata anda belum lengkap, harap lengkapi profil Anda.",
                        "status": "warning",
                        "title": "Warning,",
                        "url": "/profile",
                    }
                    data = JSON.stringify(data);
                    const encodedData = Buffer.from(data).toString('base64');
                    res.cookie("status", encodedData, {
                        // maxAge 5 minutes
                        maxAge: 1000 * 60 * 5,
                        httpOnly: false,
                    });
                }
                res.clearCookie("status");
                await req.cache.json.set('SIMPEG:atasan:' + decoded.id, '$', getAtasan);
                req.cache.expire('SIMPEG:atasan:' + decoded.id, 60 * 60 * 24 * 5);        
            }
            await t.commit();
            await req.cache.set('SIMPEG:seen:' + newToken, getUser.nik);
            req.cache.expire('SIMPEG:seen:' + newToken, 60 * 60);
            next();
        } catch (err) {
            console.log('err');
            console.log(err);
            // res.clearCookie("token");
            // return res.redirect("/");
        }
    },
    checkLogin: (req, res, next) => {
        try {
            const token = req.cookies.token;
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
        try {
            const token = req.cookies.token;
            const decoded = jwt.verify(token, secretKey);
            Session.update({
                status: 'logout',
            }, {
                where: {
                    nik: decoded.id,
                    session_token: token,
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
