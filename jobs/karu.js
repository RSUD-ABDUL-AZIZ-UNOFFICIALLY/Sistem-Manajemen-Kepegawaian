const { Atasan, User } = require("../models");
const { Op, where } = require("sequelize");

async function findUser(dep, karu) {
    let users = await User.findAll({
        where: {
            dep: dep
        },
        attributes: ['nik', 'nama'],
    })
    for (let i of users) {
        await Atasan.update({
            bos: karu
        }, {
            where: {
                user: i.nik
            }
        })
        console.log(i.nik)
        console.log(i.nama)

    }

    // console.log(users)
    return users;
}
console.log(findUser(12, '6172016001790002'))