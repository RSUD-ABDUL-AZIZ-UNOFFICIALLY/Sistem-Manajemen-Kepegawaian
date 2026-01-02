const { Absen, User, Dump_Absen, Mesin_Absen, Maps_Absen, Jdldns, Jnsdns, sequelize } = require("../models");
const { Op } = require("sequelize");

async function LiburNasional(dep, date, typeDns) {
    let t = await sequelize.transaction();


    try {
        let nikUsers = await User.findAll({
            attributes: ['nik', 'dep'],
            where: { dep: { [Op.in]: dep } }
        });
        let setJadwalUser = [];
        for (let u of nikUsers) {
            let nik = u.dataValues.nik;
            let departemen = u.dataValues.dep;
            // console.log("nik", nik);
            for (let d of date) {
                let jadwal = {
                    nik: nik,
                    typeDns: typeDns + '-' + departemen,
                    date: d
                }
                setJadwalUser.push(jadwal);
                await Jdldns.update({
                    typeDns: typeDns + '-' + departemen
                }, {
                    where: {
                        nik: nik,
                        date: d
                    },
                    transaction: t
                })

            }
        }
        await t.commit();
    } catch (error) {
        console.error("error", error);
        await t.rollback();

    }

}
// LiburNasional([2, 3, 4, 5, 6, 7, 8, 10, 12, 28, 29, 34, 38, 43, 45, 48], ['2025-06-01', '2025-06-06', '2025-06-27'], 'Libur');
// LiburNasional([2, 3, 4, 5, 6, 7, 8, 10, 12, 28, 29, 34, 38, 43, 45, 48], ["2025-06-09"], 'CB');
// LiburNasional([2, 3, 4, 5, 6, 7, 8, 10, 12, 28, 29, 34, 38, 43, 45, 48], ["2025-06-09"], 'CB');
// LiburNasional([2, 3, 4, 5, 6, 7, 8, 10, 12, 28, 29, 34, 38, 43, 45, 48], ["2025-08-18"], 'CB');
// LiburNasional([2, 3, 4, 5, 6, 7, 8, 10, 12, 28, 29, 34, 38, 43, 45, 48], ["2026-06-16"], 'Libur');
// LiburNasional([2, 3, 4, 5, 6, 7, 8, 10, 12, 28, 29, 34, 38, 43, 45, 48], ["2026-01-01"], 'Libur');

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
let jm = ['2025-05-02', '2025-05-09', '2025-05-16', '2025-05-23', '2025-05-30']

let libur = ['2025-05-01', '2025-05-12', '2025-05-29']
let cb = ['2025-05-13', '2025-05-30']
// pindah(['6172044309800002'], cb, 'CB-12');