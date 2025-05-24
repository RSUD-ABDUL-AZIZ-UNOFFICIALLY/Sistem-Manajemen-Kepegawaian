const { Absen, Dump_Absen, Mesin_Absen, Maps_Absen, Jdldns, Jnsdns, sequelize } = require("../models");
const { Op, where } = require("sequelize");

async function LiburNasional(nik, date, typeDns) {
// let updateJdl = await Jdldns.update({
//     status: 0
// }, {
//     where: {
//         [Op.and]: [
//             { status: 1 },
//             { tgl: { [Op.lte]: new Date() } }
//         ]
//     }
// })
}
// LiburNasional([], [], ['Senin-Kamis']);

async function pindah(niks, dates, typeDns) {

    for (let date of dates){
        // console.log("date", date);
        let updateJdl = await Jdldns.update({
            typeDns: typeDns
        }, {
            where: {
                nik: {
                    [Op.in]: niks
                },
                date: {
                    [Op.eq]: date
                }
            }
        })
        console.log( updateJdl);
    }
}
let sk = ["2025-05-01",
    "2025-05-05",
    "2025-05-06",
    "2025-05-07",
    "2025-05-08",
    "2025-05-12",
    "2025-05-13",
    "2025-05-14",
    "2025-05-15",
    "2025-05-19",
    "2025-05-20",
    "2025-05-21",
    "2025-05-22",
    "2025-05-26",
    "2025-05-27",
    "2025-05-28",
    "2025-05-29"
];
let sabtu = ["2025-05-03",
    "2025-05-10",
    "2025-05-17",
    "2025-05-24",
    "2025-05-31"
];
let minggu = ["2025-05-04",
    "2025-05-11",
    "2025-05-18",
    "2025-05-25"
];
let libur = ['2025-05-01', '2025-05-12', '2025-05-29']
let cb = ['2025-05-13', '2025-05-30']
pindah([''], sk, 'Senin-Kamis-3');