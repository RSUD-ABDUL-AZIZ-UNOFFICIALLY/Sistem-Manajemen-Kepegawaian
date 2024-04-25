const { User, Atasan } = require("../models");
async function findUser(dep) {
    let users = await Atasan.findAll({

    })
    return users;
}