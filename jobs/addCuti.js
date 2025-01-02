const { sequelize, User, Departemen, Biodatas, Atasan, Cuti_sisa, Cuti, Cuti_approval, Ledger_cuti } = require("../models");
const { Op } = require("sequelize");

async function addcuti(nik, jumlah, tahun, type) {
    let t = await sequelize.transaction();
    let zerodate = new Date(8.64e15).toString()
    console.log(zerodate)
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
                sisa_cuti: ledger.dataValues.sisa_cuti + jumlah,
                cuti_diambil: jumlah
            }, { transaction: t })
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
// addcuti(nik, jumlah, tahun, type)

// addcuti(6172015001820005, 4, 2023, 1)





async function findUsersSisaCuti(sesi) {
    sesions = parseInt(sesi)
    let users = await User.findAll({
        where: {
            status: 'Non ASN',
            dep: {
                [Op.not]: 47
            }
        },
        // limit: 1
    })
    console.log(users.length)
    for (let u of users) {
        let nik = u.nik
        let type = 3
        let tabahan = 0
        console.log(u.nik)
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
            // console.log(sisa_cuti)
            if (sisa_cuti > 6) {
                tabahan = 6
            } else {
                tabahan = sisa_cuti
            }
        } else {
            tabahan = 6
        }
        console.log(tabahan)
        await addRekapCuti(nik, tabahan, sesions, type)
    }

}

// findUsersSisaCuti('2024');
async function addRekapCuti(nik, jumlah, tahun, type) {
    let t = await sequelize.transaction();
    let zerodate = new Date(8.64e15).toString()
    console.log(zerodate)
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

