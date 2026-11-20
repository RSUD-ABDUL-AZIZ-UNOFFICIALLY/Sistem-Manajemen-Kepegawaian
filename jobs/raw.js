const {User, Absen, Dump_Absen, Mesin_Absen, Maps_Absen, Jdldns, Jnsdns, sequelize } = require("../models");
const { Op } = require("sequelize");
const axios = require("axios");
const fs = require('fs');
async function pegawai(dep) {
    let dataUsers = await User.findAll({
        where: {
            dep: dep
        },
        attibutes: ['nik', 'nip', 'nama'],
        include: {
            model: Maps_Absen,
            as: 'id_finger',
            attributes: ['id_finger'],
            required: true
        }
    })
    return dataUsers
}
// pegawai(8)

async function getFinger(idFinger, date) {
    let config = {
                method: 'get',
                maxBodyLength: Infinity,
              url: process.env.HOST_FIGER + '/absensi?month=' + date,
              data: idFinger
            };
            // console.log(config)
            let res = await axios(config)
            console.log(res.data)
            return res.data
    
}
async function pengabungan(dep) {
    let dataUsers = await pegawai(dep)
    let idFinger = dataUsers.map(item => item.id_finger.id_finger)
    // let dataFinger = await getFinger(idFinger, '2024-01-03')
    // console.log(dataFinger)
    let date = new Date();
    let startDate = new Date(2024, 0, 2);
    let endDate = new Date(2024, 11, 31);
    let currentDate = startDate;
    let dates = [];
    while (currentDate <= endDate) {
        let datestring = currentDate.toISOString().slice(0, 10);
        dates.push(datestring);
        currentDate.setDate(currentDate.getDate() + 1);
    }
    console.log(dates)
    let dataFinger = []
    for (let i = 0; i < dates.length; i++) {
        let res = await getFinger(idFinger, dates[i])
        dataFinger.push(res)
    }
    fs.writeFileSync('./data.json', JSON.stringify(dataFinger))
    
}

pengabungan(8)