"use strict";
const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET_KEY;
const {
    User,
    Profile,
    Vote
} = require("../models");
const { Op } = require("sequelize");

module.exports = {
    async index(req, res) {
        let users = req.account;
        let params = req.query;
        console.log(params);
        if (params.name == '') {
            return res.status(200).json({
                error: false,
                message: "success",
                data: [],
            });
        }
        let findVoters = await User.findAll({
            where: {
                nama: {[Op.like]: `%${params.name}%`},
                dep: { [Op.not]: ['47','57']},
                status: { [Op.not]: ['Non ASN']}
            },
            attributes: ["nik", "nama"],
            include: [
                {
                    model: Profile,
                    as: "profile",
                    attributes: ["url"],
                }
            ],
            order: [
                ["nama", "DESC"],
            ],
            limit: 5
        })
        return res.status(200).json({
                error: false,
                message: "success",
                data: findVoters,
            });
    },
    async cek(req,res){
        let users = req.account;
        let year = new Date().getFullYear();
        let findCekVote = await Vote.findOne({
            where: {
                pemilih: users.nik,
                periode: year
            }
        })
        console.log(findCekVote);
        if (findCekVote == null) {
            return res.status(200).json({
                error: false,
                message: "success",
                data: 'belum vote',
            });
        }
        return res.status(200).json({
            error: true,
            message: "success",
            data: 'sudah vote',
        });
    },
    async vote(req, res) {
        let body = req.body;
        let users = req.account;
        let year = new Date().getFullYear();
        try {
            let createVote = await Vote.create({
                peserta: body.nik,
                pemilih: users.nik,
                periode: year
            })
            return res.status(200).json({
                error: false,
                message: "success",
                data: createVote,
            });
       } catch (error) {
           return res.status(400).json({
               error: true,
               message: "error",
               data: error,
           });
       }
    }
}