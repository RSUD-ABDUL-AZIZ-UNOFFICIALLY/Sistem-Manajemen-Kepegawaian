const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET_KEY;
const { Tracker, Lastseen } = require("../models");
const { json } = require("body-parser");
const { update } = require("./seen");

module.exports = {
    index: async (req, res) => {
        let token = req.cookies.token;
        let decoded = jwt.verify(token, secretKey);
        let body = req.body;
        try {
            body.nik = decoded.id;
            let data = Tracker.create(body);
            let status = await Lastseen.findOne({
                where: {
                    visite: body.visite,
                    nik: body.nik,
                    name: decoded.nama,
                }
            });
            if (!status) {
                await Lastseen.create({
                    visite: body.visite,
                    nik: body.nik,
                    name: decoded.nama,
                    state: body.state,
                    nik: body.nik,
                    userAgent: body.userAgent,
                    vendor: body.vendor,
                    os: body.os,
                    ip: body.ip,
                    as: body.as,
                    isp: body.isp,
                    city: body.city,
                    batteryLevel: body.batteryLevel,
                });
            } else {
                await Lastseen.update(
                    {
                        state: body.state,
                        userAgent: body.userAgent,
                        vendor: body.vendor,
                        os: body.os,
                        ip: body.ip,
                        as: body.as,
                        isp: body.isp,
                        city: body.city,
                        batteryLevel: body.batteryLevel,
                        updatedAt: new Date(),
                    },
                    {
                        where: {
                            visite: body.visite,
                            nik: body.nik,
                            name: decoded.nama,
                        }
                    }
                );
            }
            return res.status(200).json({
                error: false,
                message: "success",
                data: data
            });
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                error: true,
                message: "error",
                data: err,
            });
        }
    },
    bio: async (req, res) => {
        try {
            console.log(req.headers);
            let data = req.useragent;
            return res.status(200).json({
                error: false,
                message: "success",
                data: data,

            });
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                error: true,
                message: "error",
                data: err.message,
            });
        }
    }
}
