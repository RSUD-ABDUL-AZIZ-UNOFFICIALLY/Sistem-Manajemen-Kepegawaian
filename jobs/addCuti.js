const { sequelize, User, Departemen, Biodatas, Atasan, Cuti_sisa, Cuti, Cuti_approval, Ledger_cuti } = require("../models");
const { Op, where } = require("sequelize");

// async function addcuti(nik, jumlah, tahun, type) {
//     let t = await sequelize.transaction();
//     let zerodate = new Date(8.64e15).toString()
//     console.log(zerodate)
//     try {
//         let addsisaCuti = await Cuti_sisa.create({
//             nik: nik,
//             periode: tahun,
//             sisa: jumlah
//         }, { transaction: t });
//         let dateup = addsisaCuti.updatedAt;
//         let addcuti = await Cuti.create({
//             nik: nik,
//             type_cuti: type,
//             jumlah: jumlah,
//             keterangan: `TAMBAHAN CUTI ${tahun}`,
//         }, { transaction: t })

//         await Cuti_approval.create({
//             id_cuti: addcuti.dataValues.id,
//             nik: null,
//             departement: null,
//             jabatan: null,
//             pangkat: null,
//             approve_date: dateup,
//             status: 'Disetujui',
//             keterangan: `TAMBAHAN CUTI ${tahun}`
//         }, { transaction: t })

//         let ledger = await Ledger_cuti.findOne({
//             where: {
//                 nik_user: nik,
//                 type_cuti: type,
//             },
//             order: [
//                 ["id", "DESC"]
//             ]
//         })
//         let userData = await User.findOne({
//             where: {
//                 nik: nik
//             },
//             include: [
//                 {
//                     model: Departemen,
//                     as: "departemen",
//                 },
//                 {
//                     model: Biodatas,
//                     as: "biodata",
//                 },
//             ]
//         })
//         let Boss = await Atasan.findOne({
//             where: {
//                 user: nik,
//             },
//             include: [
//                 {
//                     model: User,
//                     as: "atasanLangsung",
//                     include: [
//                         {
//                             model: Departemen,
//                             as: "departemen",
//                         },
//                     ],
//                 },
//             ],
//         });
//         if (ledger) {
//             let addLeager = await Ledger_cuti.create({
//                 nik_user: nik,
//                 name_user: userData.dataValues.nama,
//                 pangkat: userData.biodata.pangkat,
//                 jabatan: userData.dataValues.jab,
//                 departemen: userData.departemen.bidang,
//                 nik_atasan: Boss.bos,
//                 name_atasan: Boss.atasanLangsung.nama,
//                 tembusan: Boss.atasanLangsung.jab,
//                 periode: tahun + 1,
//                 type_cuti: type,
//                 id_cuti: addcuti.dataValues.id,
//                 sisa_cuti: ledger.dataValues.sisa_cuti + jumlah,
//                 cuti_diambil: jumlah
//             }, { transaction: t })
//         } else {

//             await Ledger_cuti.create({
//                 nik_user: nik,
//                 name_user: userData.dataValues.nama,
//                 pangkat: userData.biodata.pangkat,
//                 jabatan: userData.dataValues.jab,
//                 departemen: userData.departemen.bidang,
//                 nik_atasan: Boss.bos,
//                 name_atasan: Boss.atasanLangsung.nama,
//                 tembusan: Boss.atasanLangsung.jab,
//                 periode: tahun + 1,
//                 type_cuti: type,
//                 id_cuti: addcuti.dataValues.id,
//                 sisa_cuti: 12 + jumlah,
//                 cuti_diambil: jumlah
//             }, { transaction: t })
//         }
//         await t.commit();
//         //     console.log(addsisaCuti)
//         // console.log(addsisaCuti.updatedAt)

//     } catch (error) {
//         console.log(error)
//         await t.rollback();

//     }


//     return;

// }
// addcuti(nik, jumlah, tahun, type)

// addcuti(6172015001820005, 4, 2023, 1)





async function findUsersSisaCuti(sesi) {
    sesions = parseInt(sesi)
    let users = await User.findAll({
        where: {
            status: 'PPPK',
            nik: "6112035712930003",
            dep: {
                [Op.not]: [47, 5]
            }
        },
        // limit: 1
    })
    // console.log(users)
    let count = 0
    for (let u of users) {
        let nik = u.nik
        let type = 2
        let tabahan = 0
        console.log(u.nama)
        let ledgers = await Ledger_cuti.findOne({
            where: {
                nik_user: u.nik,
                type_cuti: type,
                periode: {
                    [Op.substring]: sesions
                }
            },
            order: [
                ["id", "DESC"]
            ]
        })
        // console.log(ledgers)
        if (ledgers) {
            let sisa_cuti = ledgers.dataValues.sisa_cuti
            console.log('sisa cuti: ' + sisa_cuti)
            if (sisa_cuti > 6) {
                tabahan = 6
            } else {
                if (sisa_cuti == 0) {
                    continue;
                }
                tabahan = sisa_cuti
            }
        } else {
            // tabahan = 6
            continue;
            console.log('FULL')

        }
        count++
        console.log(count)

        console.log('tabahan: ' + tabahan)
        await addRekapCuti(nik, tabahan, sesions, type)
    }
    console.log('total user: ' + count)
    console.log(users.length)

}

findUsersSisaCuti('2025');
async function addRekapCuti(nik, jumlah, tahun, type) {
    let t = await sequelize.transaction();
    let zerodate = new Date(8.64e15).toString()
    console.log(zerodate)
    let cekTambahan = await Cuti.findOne({
        where: {
            nik: nik,
            keterangan: `TAMBAHAN CUTI ${tahun}`,
        }
    }, { transaction: t })
    if (cekTambahan) {
        await t.rollback();
        return;
    }
    try {
        let addsisaCuti = await Cuti_sisa.create({
            nik: nik,
            periode: tahun,
            sisa: jumlah
        }, { transaction: t });
        let dateup = addsisaCuti.updatedAt;
        let addcuti = await Cuti.create({
            nik: nik,
            type_cuti: type,
            jumlah: jumlah,
            keterangan: `TAMBAHAN CUTI ${tahun}`,
        }, { transaction: t })

        await Cuti_approval.create({
            id_cuti: addcuti.dataValues.id,
            nik: null,
            departement: null,
            jabatan: null,
            pangkat: null,
            approve_date: dateup,
            status: 'Disetujui',
            keterangan: `TAMBAHAN CUTI ${tahun}`
        }, { transaction: t })

        let ledger = await Ledger_cuti.findOne({
            where: {
                nik_user: nik,
                type_cuti: type,
            },
            order: [
                ["id", "DESC"]
            ]
        })
        let userData = await User.findOne({
            where: {
                nik: nik
            },
            include: [
                {
                    model: Departemen,
                    as: "departemen",
                },
                {
                    model: Biodatas,
                    as: "biodata",
                },
            ]
        })
        let Boss = await Atasan.findOne({
            where: {
                user: nik,
            },
            include: [
                {
                    model: User,
                    as: "atasanLangsung",
                    include: [
                        {
                            model: Departemen,
                            as: "departemen",
                        },
                    ],
                },
            ],
        });
        if (ledger) {
            console.log('Lama')
            let addLeager = await Ledger_cuti.create({
                nik_user: nik,
                name_user: userData.dataValues.nama,
                pangkat: userData.biodata.pangkat,
                jabatan: userData.dataValues.jab,
                departemen: userData.departemen.bidang,
                nik_atasan: Boss.bos,
                name_atasan: Boss.atasanLangsung.nama,
                tembusan: Boss.atasanLangsung.jab,
                periode: tahun + 1,
                type_cuti: type,
                id_cuti: addcuti.dataValues.id,
                sisa_cuti: 12 + jumlah,
                cuti_diambil: jumlah
            }, { transaction: t })
            console.log(addLeager)
        } else {
            await Ledger_cuti.create({
                nik_user: nik,
                name_user: userData.dataValues.nama,
                pangkat: userData.biodata.pangkat,
                jabatan: userData.dataValues.jab,
                departemen: userData.departemen.bidang,
                nik_atasan: Boss.bos,
                name_atasan: Boss.atasanLangsung.nama,
                tembusan: Boss.atasanLangsung.jab,
                periode: tahun + 1,
                type_cuti: type,
                id_cuti: addcuti.dataValues.id,
                sisa_cuti: 12 + jumlah,
                cuti_diambil: jumlah
            }, { transaction: t })
        }
        await t.commit();
        //     console.log(addsisaCuti)
        // console.log(addsisaCuti.updatedAt)

    } catch (error) {
        console.log(error)
        await t.rollback();

    }
    return;

}

async function addCB() {

    let user6 = await User.findAll({
        where: {
            '$biodata.jns_kerja$': '6 Hari kerja shifting',
            dep: {
                [Op.not]: 47
            }
        },
        include: [
            {
                model: Departemen,
                as: "departemen",
                attributes: ['bidang']
            },
            {
                model: Biodatas,
                as: "biodata",
                attributes: ['jns_kerja']
            },
        ]
    })
    // console.log(user6[0].atasan)
    try {
        for (let i of user6) {
            let t = await sequelize.transaction();
            let findCB = await Cuti.findOne({
                where: {
                    nik: i.nik,
                    keterangan: "Tambahan cuti bersama proklamasi kemerdekaan 2025"
                }
            }, { transaction: t })
            if (findCB) {
                await t.rollback();
                continue;
            }
            // console.log(i)
            let typeCuti;
            if (i.status == "PNS") {
                typeCuti = 14
            } else if (i.status == "PPPK") {
                typeCuti = 15
            } else if (i.status == "Non ASN") {
                typeCuti = 16
            }

            let ledger = await Ledger_cuti.findOne({
                where: {
                    nik_user: i.nik,
                    periode: '2025',
                    type_cuti: typeCuti,

                },
                order: [
                    ["createdAt", "DESC"]
                ]
            }, { transaction: t })
            console.log(ledger)
            if (ledger) {
                let idCuti = await Cuti.create({
                    nik: i.nik,
                    type_cuti: typeCuti,
                    jumlah: 1,
                    keterangan: "Tambahan cuti bersama proklamasi kemerdekaan 2025",
                }, { transaction: t })
                let datenow = new Date().toISOString().slice(0, 10);

                await Cuti_approval.create({
                    id_cuti: idCuti.dataValues.id,
                    nik: null,
                    departement: null,
                    jabatan: null,
                    pangkat: null,
                    approve_date: datenow,
                    status: 'Disetujui',
                    keterangan: `Tambahan cuti bersama proklamasi kemerdekaan 2025`
                }, { transaction: t })

                await Ledger_cuti.create({
                    nik_user: ledger.nik_user,
                    name_user: ledger.name_user,
                    pangkat: ledger.pangkat,
                    jabatan: ledger.jabatan,
                    departemen: ledger.departemen,
                    nik_atasan: ledger.nik_atasan,
                    name_atasan: ledger.name_atasan,
                    tembusan: ledger.tembusan,
                    periode: '2025',
                    type_cuti: typeCuti,
                    id_cuti: idCuti.dataValues.id,
                    sisa_cuti: ledger.sisa_cuti + 1,
                    cuti_diambil: 1
                }, { transaction: t })
                // return

            }
            await t.commit();
            // await t.rollback();
        }

    } catch (error) {
        console.log(error)
        // await t.rollback();

    }

}
// addCB()
async function corsckeID() {
    let findAllID = await Cuti_approval.findAll({

        order: [['id_cuti', 'DESC']],
        attributes: ['id', 'id_cuti'],
    })
    console.log(findAllID[0])
    let worngID = 0;
    for (let x of findAllID) {
        if (x.id_cuti != x.id) {
            worngID += 1;
            // console.log(x)
            // await Cuti_approval.update({
            //     id: x.id_cuti
            // }, {
            //     where: {
            //         id: x.id
            //     }
            // })
            // return
        }
    }
    console.log(worngID)

}
// corsckeID()

