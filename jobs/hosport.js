const { User, Hotspot } = require("../models");
const { Op } = require("sequelize");
const e = require("express");

async function getHotspot() {
    let x = await Hotspot.findAll({
        attributes: ['user', 'password']
    })
    // console.log(`add name=${x.user} password=${x.password} profile=PA6M server=hotspot1`)
    for (let i of x) {
        console.log(`add name=${i.user} password=${i.password} profile=PA6M server=hotspot1`)
    }
}
async function setHotspot() {
    let pegawi = await User.findAll({
        attributes: ['id', 'nik', 'nama', 'dep'],
        where: {
            [Op.not]: [{ dep: null, }]
        }
    })
    for (let i of pegawi) {
        try {
        let random = Math.floor(Math.random() * 1000);
        let x = await Hotspot.create({
            nik: i.nik,
            user: i.dep + '-' + i.id,
            password: random
        })
        console.log(x)
        }catch (error) {
            console.log(error)
        }
    }
}
// setHotspot()
getHotspot()


