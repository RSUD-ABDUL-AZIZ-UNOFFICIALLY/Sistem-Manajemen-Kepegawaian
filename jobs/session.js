const {  Session } = require("../models");
const { Op } = require("sequelize");
async function cek_sesi() {
    let cek_session = await Session.findAll({
        where: {
            status: {
                [Op.in]: ['online', 'login']
            },
            updatedAt: {
                [Op.lt]: new Date(new Date().setDate(new Date().getDate() - 7))
            }
        },
        order: [["updatedAt", "DESC"]]
    });
    cek_session.map(async (item) => {
        await Session.update({
            status: 'expire'
        }, {
            where: {
                id: item.id
            }
        })
    })
    console.log(cek_session)
}
cek_sesi();