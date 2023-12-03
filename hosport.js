const { User, Hotspot } = require("./models");
const { Op } = require("sequelize");

function getHotspot() {
    return Hotspot.findAll({
        attributes: ['user', 'password']
    })
}
async function setHotspot() {
    let pegawi = await User.findAll({
        attributes: ['id', 'nik', 'nama', 'dep'],
        where: {
            [Op.not]: [{ dep: null, }]
        }
    })
    for (let i of pegawi) {
        let random = Math.floor(Math.random() * 1000);
        let x = await Hotspot.create({
            nik: i.nik,
            user: i.dep + '-' + i.id,
            password: random
        })
        console.log(x)
    }
}
setHotspot()

