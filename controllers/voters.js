"use strict";
const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET_KEY;
const {
    User,
    Profile,
    Vote,
    sequelize
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
                status: { [Op.not]: ['Non ASN'] },
                JnsKel: 'Laki-laki'
            },
            attributes: ["nik", "nama", "JnsKel"],
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
                nama: { [Op.like]: `%${params.name}%` },
                dep: { [Op.not]: ['47', '57'] },
                status: { [Op.not]: ['Non ASN'] },
                JnsKel: params.gender
            },
            attributes: ["nik", "nama", "JnsKel"],
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
        let t = await sequelize.transaction();
        try {
            let createVoteL = await Vote.create({
                peserta: body.nikL,
                jns_kelamin: 'Laki-laki',
                pemilih: users.nik,
                periode: year
            }, { transaction: t });
            let createVoteP = await Vote.create({
                peserta: body.nikP,
                jns_kelamin: 'Perempuan',
                pemilih: users.nik,
                periode: year
            }, { transaction: t });
            await t.commit();
            return res.status(200).json({
                error: false,
                message: "success",
                data: [createVoteL, createVoteP],
            });
       } catch (error) {
            await t.rollback();
           return res.status(400).json({
               error: true,
               message: "error",
               data: error,
           });
       }
    }
}