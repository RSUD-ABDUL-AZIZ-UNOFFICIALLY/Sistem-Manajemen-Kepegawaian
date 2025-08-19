"use strict";
const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET_KEY;
const { sequelize, User, Ijazah, Riwayat_ijazah, Str, Riwayat_str, Kk, Riwayat_kk, Ktp, Riwayat_ktp, Npwp, Riwayat_npwp, Cv, Riwayat_cv, Sertifikat, Riwayat_sertifikat, Skck, Riwayat_skck, Kontrak, Riwayat_kontrak, Pangkat, Riwayat_pangkat, Lainnya, Riwayat_lainnya } = require("../models");
const { Op, Model } = require("sequelize");

module.exports = {
    async uploadDoc(req, res) {
        try {
            let params = req.params.id;
            let body = req.body;
            let account = req.account;
            body.status = "Pending";
            body.nik = account.nik;
            switch (params) {
                case "ijazah":
                    await uploadIjazah(body, account);
                    break;
                case "str":
                    await uploadStr(body, account);
                    break;
                case "kk":
                    await uploadKk(body, account);
                    break;
                case "ktp":
                    await uploadKtp(body, account);
                    break;
                case "npwp":
                    await uploadNpwp(body, account);
                    break;
                case "cv":
                    await uploadCv(body, account);
                    break;
                case "sertifikat":
                    await uploadSertifikat(body, account);
                    break;
                case "skck":
                    await uploadSkck(body, account);
                    break;
                case "kontrak":
                    await uploadKontrak(body, account);
                    break;
                case "pangkat":
                    await uploadPangkat(body, account);
                    break;
                case "lainnya":
                    await uploadLainnya(body, account);
                    break;
                default:
                    return res.status(400).json({
                        error: true,
                        message: "document type not found"
                    })
            }


            return res.status(200).json({
                error: false,
                message: "success",
                data: params,
                data2: body
            })

        } catch (error) {
            return res.status(400).json({
                error: true,
                message: error.message,
                data: error
            })
        }
    },
    getDocAll: async (req, res) => {
        let findchace = await req.cache.get(`SIMPEG:dokumen:${req.account.nik}`);
        if (findchace) {
            return res.status(200).json({
                error: false,
                message: "success",
                data: findchace
            })
        }
        try {
            let data = [];
            let verifiedCount = 0;
            let pendingCount = 0;
            let rejectedCount = 0;
            let totalDocuments = 0;
            let dataIjasah = await Ijazah.findAll({
                where: {
                    status: { [Op.ne]: "Deleted"},
                    nik: req.account.nik
                }
            });
            for (let i of dataIjasah) {
                if (i.status == "Pending") {
                    pendingCount += 1;
                } else if (i.status == "Rejected") {
                    rejectedCount +=1;
                } else if (i.status == "Verified") {
                    verifiedCount += 1;
                }
                totalDocuments += 1;
                let result = {
                    jenisDokumen: "Ijazah " + i.education_level,
                    detail: i.major,
                    subDetail: i.institution + " - " + i.graduation_date,
                    catatan: i.catatan,
                    status: i.status,
                    fileUrl: i.fileUrl,
                    badge: "primary",
                    Upload: new Date(i.createdAt).toLocaleString("en-GB", { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }).replace(/ /g, ' '),
                    id: i.id + "-" + i.nik+"-Ijazah"
                }
                data.push(result)
                
            }
            let dataStr = await Str.findAll({
                where: {
                    status: { [Op.ne]: "Deleted"},
                    nik: req.account.nik
                }
            });
            for (let i of dataStr) {
                if (i.status == "Pending") {
                    pendingCount += 1;
                } else if (i.status == "Rejected") {
                    rejectedCount +=1;
                } else if (i.status == "Verified") {
                    verifiedCount += 1;
                }
                totalDocuments += 1;
                let result = {
                    jenisDokumen: "STR",
                    detail: i.profession,
                    subDetail: i.issuer + " - issued:" + i.issue_date,
                    catatan: i.catatan,
                    status: i.status,
                    fileUrl: i.fileUrl,
                      badge: "info",
                    Upload: new Date(i.createdAt).toLocaleString("en-GB", { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }).replace(/ /g, ' '),
                    id: i.id + "-" + i.nik+"-Str"
                }
                data.push(result)
            }
            let dataKk = await Kk.findAll({
                where: {
                    status: { [Op.ne]: "Deleted"},
                    nik: req.account.nik
                }
            });
            for (let i of dataKk) {
                if (i.status == "Pending") {
                    pendingCount += 1;
                } else if (i.status == "Rejected") {
                    rejectedCount +=1;
                } else if (i.status == "Verified") {
                    verifiedCount += 1;
                }
                totalDocuments += 1;
                let result = {
                    jenisDokumen: "KK",
                    
                    detail: "Kartu Keluarga",
                    subDetail: i.kk_head_name + " - issued:" + i.kk_issue_date,
                    catatan: i.catatan,
                    status: i.status,
                    fileUrl: i.fileUrl,
                    badge: "secondary",
                     Upload: new Date(i.createdAt).toLocaleString("en-GB", { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }).replace(/ /g, ' ') ,
                    id: i.id + "-" + i.nik+"-Kk"
                }
                data.push(result)
            }
            let dataKtp = await Ktp.findAll({
                where: {
                    status: { [Op.ne]: "Deleted"},
                    nik: req.account.nik
                }
            });
            for (let i of dataKtp) {
                if (i.status == "Pending") {
                    pendingCount += 1;
                } else if (i.status == "Rejected") {
                    rejectedCount +=1;
                } else if (i.status == "Verified") {
                    verifiedCount += 1;
                }
                totalDocuments += 1;
                let result = {
                    jenisDokumen: "KTP",
                    detail: "Kartu Tanda Penduduk",
                    subDetail: i.birth_place + " - issued:" + i.ktp_issue_date,
                    catatan: i.catatan,
                    status: i.status,
                    fileUrl: i.fileUrl,
                    badge: "success",
                     Upload: new Date(i.createdAt).toLocaleString("en-GB", { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }).replace(/ /g, ' ') ,
                    id: i.id + "-" + i.nik+"-Ktp"
                }
                data.push(result)
            }
            let dataNpwp = await Npwp.findAll({
                where: {
                    status: { [Op.ne]: "Deleted"},
                    nik: req.account.nik
                }
            });
            for (let i of dataNpwp) {
                if (i.status == "Pending") {
                    pendingCount += 1;
                } else if (i.status == "Rejected") {
                    rejectedCount +=1;
                } else if (i.status == "Verified") {
                    verifiedCount += 1;
                }
                totalDocuments += 1;
                let result = {
                    jenisDokumen: "NPWP",
                    detail: "Nomor Pokok Wajib Pajak",
                    subDetail: i.npwp_number,
                    catatan: i.catatan,
                    status: i.status,
                    fileUrl: i.fileUrl,
                    badge: "success",
                     Upload: new Date(i.createdAt).toLocaleString("en-GB", { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }).replace(/ /g, ' ') ,
                    id: i.id + "-" + i.nik+"-Npwp"
                }
                data.push(result)
            }
            let dataCv = await Cv.findAll({
                where: {
                    status: { [Op.ne]: "Deleted"},
                    nik: req.account.nik
                }
            });
            for (let i of dataCv) {
                if (i.status == "Pending") {
                    pendingCount += 1;
                } else if (i.status == "Rejected") {
                    rejectedCount +=1;
                } else if (i.status == "Verified") {
                    verifiedCount += 1;
                }
                totalDocuments += 1;
                let result = {
                    jenisDokumen: "CV",
                    detail: "Curriculum Vitae",
                    subDetail: i.cv_version,
                    catatan: i.catatan,
                    status: i.status,
                    fileUrl: i.fileUrl,
                    badge: "secondary",
                     Upload: new Date(i.createdAt).toLocaleString("en-GB", { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }).replace(/ /g, ' ') ,
                    id: i.id + "-" + i.nik+"-Cv"
                }
                data.push(result)
            }
            let dataSertifikat = await Sertifikat.findAll({
                where: {
                    status: { [Op.ne]: "Deleted"},
                    nik: req.account.nik
                }
            });
            for (let i of dataSertifikat) {
                if (i.status == "Pending") {
                    pendingCount += 1;
                } else if (i.status == "Rejected") {
                    rejectedCount +=1;
                } else if (i.status == "Verified") {
                    verifiedCount += 1;
                }
                totalDocuments += 1;
                let result = {
                    jenisDokumen: "Sertifikat",
                    detail: i.training_name,
                    subDetail: i.organizer + " - issued:" + i.training_date,
                    catatan: i.catatan,
                    status: i.status,
                    fileUrl: i.fileUrl,
                    badge: "warning",
                     Upload: new Date(i.createdAt).toLocaleString("en-GB", { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }).replace(/ /g, ' ') ,
                    id: i.id + "-" + i.nik+"-Sertifikat"
                }
                data.push(result)
            }
            let dataSkck = await Skck.findAll({
                where: {
                    status: { [Op.ne]: "Deleted"},
                    nik: req.account.nik
                }
            });
            for (let i of dataSkck) {
                if (i.status == "Pending") {
                    pendingCount += 1;
                } else if (i.status == "Rejected") {
                    rejectedCount +=1;
                } else if (i.status == "Verified") {
                    verifiedCount += 1;
                }
                totalDocuments += 1;
                let result = {
                    jenisDokumen: "SKCK",
                    detail: "Surat Keterangan Catatan Kepolisian",
                    subDetail: "issued:" + i.skck_issue_date,
                    catatan: i.catatan,
                    status: i.status,
                    fileUrl: i.fileUrl,
                    badge: "warning",
                     Upload: new Date(i.createdAt).toLocaleString("en-GB", { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }).replace(/ /g, ' ') ,
                    id: i.id + "-" + i.nik +"-Skck"
                }
                data.push(result)
            }
            let dataKontrak = await Kontrak.findAll({
                where: {
                    status: { [Op.ne]: "Deleted"},
                    nik: req.account.nik
                }
            });
            for (let i of dataKontrak) {
                if (i.status == "Pending") {
                    pendingCount += 1;
                } else if (i.status == "Rejected") {
                    rejectedCount +=1;
                } else if (i.status == "Verified") {
                    verifiedCount += 1;
                }
                totalDocuments += 1;
                let result = {
                    jenisDokumen: "Kontrak",
                    detail: "Surat Kontrak " + i.contract_type,
                    subDetail: "issued:" + i.contract_start + " - " + i.contract_end,
                    catatan: i.catatan,
                    status: i.status,
                    fileUrl: i.fileUrl,
                    badge: "success",
                     Upload: new Date(i.createdAt).toLocaleString("en-GB", { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }).replace(/ /g, ' ') ,
                    id: i.id + "-" + i.nik+"-Kontrak"
                }
                data.push(result)
            }
            let dataPangkat = await Pangkat.findAll({
                where: {
                    status: { [Op.ne]: "Deleted"},
                    nik: req.account.nik
                }
            });
            for (let i of dataPangkat) {
                if (i.status == "Pending") {
                    pendingCount += 1;
                } else if (i.status == "Rejected") {
                    rejectedCount +=1;
                } else if (i.status == "Verified") {
                    verifiedCount += 1;
                }
                totalDocuments += 1;
                let result = {
                    jenisDokumen: "Pangkat",
                    detail: "Pangkat :" + i.jabatan,
                    subDetail: "issued:" + i.document_issuer,
                    catatan: i.catatan,
                    status: i.status,
                    fileUrl: i.fileUrl,
                    badge: "success",
                     Upload: new Date(i.createdAt).toLocaleString("en-GB", { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }).replace(/ /g, ' ') ,
                    id: i.id + "-" + i.nik+"-Pangkat"
                }
                data.push(result)
            }
            let dataLainnya = await Lainnya.findAll({
                where: {
                    status: { [Op.ne]: "Deleted"},
                    nik: req.account.nik
                }
            });
            for (let i of dataLainnya) {
                if (i.status == "Pending") {
                    pendingCount += 1;
                } else if (i.status == "Rejected") {
                    rejectedCount +=1;
                } else if (i.status == "Verified") {
                    verifiedCount += 1;
                }
                totalDocuments += 1;
                let result = {
                    jenisDokumen: "Lainnya",
                    detail: i.document_name,
                    subDetail: "issued:" + i.document_date,
                    catatan: i.catatan,
                    status: i.status,
                    fileUrl: i.fileUrl,
                    badge: "light",
                     Upload: new Date(i.createdAt).toLocaleString("en-GB", { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }).replace(/ /g, ' ') ,
                    id: i.id + "-" + i.nik+"-Lainnya"
                }
                data.push(result)
            }
            await req.cache.set(`SIMPEG:dokumen:${req.account.nik}`, JSON.stringify(data));
            return res.status(200).json({
                error: false,
                message: "success",
                
                data: {
                    record: {
                        verifiedCount,
                        pendingCount,
                        rejectedCount,
                        totalDocuments
                    },
                    data
                },
            })
        } catch (error) {
            return res.status(400).json({
                error: true,
                message: error.message,
                data: error
            })
        }
    },
    deleteDoc: async (req, res) => {
        let t = await sequelize.transaction();
        let param = req.params.id;
        try {
            param = param.split("-");
            let id = param[0];
            let nik = param[1];
            let jenis = param[2];
            if (jenis == "Ijazah") {
                await Ijazah.update(
                    {
                        status: "Deleted"
                    },{
                    where: {
                        id: id,
                        nik: nik
                    }
                }, { transaction: t });
                await Riwayat_ijazah.create({
                    fileId: id,
                    status: "Deleted",
                    keterangan: "File deleted oleh " + req.account.nama
                }, { transaction: t });

            }
            if (jenis == "Str") {
                await Str.update(
                    {
                        status: "Deleted"
                    },{
                    where: {
                        id: id,
                        nik: nik
                    }
                }, { transaction: t });
                await Riwayat_str.create(
                    {
                        fileId: id,
                        status: "Deleted",
                        keterangan: "File deleted oleh " + req.account.nama
                    }, { transaction: t }
                )
            }
            if (jenis == "Kk") {
                await Kk.update(
                    {
                        status: "Deleted"
                    },{
                    where: {
                        id: id,
                        nik: nik
                    }
                }, { transaction: t });
                await Riwayat_kk.create(
                    {
                        fileId: id,
                        status: "Deleted",
                        keterangan: "File deleted oleh " + req.account.nama
                    }, { transaction: t }
                )
            }
            if (jenis == "Ktp") {
                await Ktp.update(
                    {
                        status: "Deleted"
                    },{
                    where: {
                        id: id,
                        nik: nik
                    }
                }, { transaction: t });
                await Riwayat_ktp.create(
                    {
                        fileId: id,
                        status: "Deleted",
                        keterangan: "File deleted oleh " + req.account.nama
                    }, { transaction: t }
                )
            }
            if (jenis == "Npwp") {
                await Npwp.update(
                    {
                        status: "Deleted"
                    },{
                    where: {
                        id: id,
                        nik: nik
                    }
                }, { transaction: t });
                await Riwayat_npwp.create(
                    {
                        fileId: id,
                        status: "Deleted",
                        keterangan: "File deleted oleh " + req.account.nama
                    }, { transaction: t }
                )
            }
            if (jenis == "Cv") {
                await Cv.update(
                    {
                        status: "Deleted"
                    },{
                    where: {
                        id: id,
                        nik: nik
                    }
                }, { transaction: t });
                await Riwayat_cv.create(
                    {
                        fileId: id,
                        status: "Deleted",
                        keterangan: "File deleted oleh " + req.account.nama
                    }, { transaction: t }
                )
            }
            if (jenis == "Sertifikat") {
               await Sertifikat.update(
                   {
                       status: "Deleted"
                   },{
                   where: {
                       id: id,
                       nik: nik
                   }
               }, { transaction: t });
               await Riwayat_sertifikat.create(
                   {
                       fileId: id,
                       status: "Deleted",
                       keterangan: "File deleted oleh " + req.account.nama
                   }, { transaction: t }
               )
            }
            if (jenis == "Skck") {
                await Skck.update(
                    {
                        status: "Deleted"
                    },{
                    where: {
                        id: id,
                        nik: nik
                    }
                }, { transaction: t });
                await Riwayat_skck.create(
                    {
                        fileId: id,
                        status: "Deleted",
                        keterangan: "File deleted oleh " + req.account.nama
                    }, { transaction: t }
                )
            }
            if (jenis == "Kontrak") {
                await Kontrak.update(
                    {
                        status: "Deleted"
                    },{
                    where: {
                        id: id,
                        nik: nik
                    }
                }, { transaction: t });
                await Riwayat_kontrak.create(
                    {
                        fileId: id,
                        status: "Deleted",
                        keterangan: "File deleted oleh " + req.account.nama
                    }, { transaction: t }
                )
            }
            if (jenis == "Pangkat") {
                await Pangkat.update(
                    {
                        status: "Deleted"
                    },{
                    where: {
                        id: id,
                        nik: nik
                    }
                }, { transaction: t });
                await Riwayat_pangkat.create(
                    {
                        fileId: id,
                        status: "Deleted",
                        keterangan: "File deleted oleh " + req.account.nama
                    }, { transaction: t }
                )
            }
            if (jenis == "Lainnya") {
                await Lainnya.update(
                    {
                        status: "Deleted"
                    },{
                    where: {
                        id: id,
                        nik: nik
                    }
                }, { transaction: t });
                await Riwayat_lainnya.create(
                    {
                        fileId: id,
                        status: "Deleted",
                        keterangan: "File deleted oleh " + req.account.nama
                    }, { transaction: t }
                )
            }
            t.commit();
            return res.status(200).json({
                error: false,
                message: "success",
                data: id
            })
        } catch (error) {
            await t.rollback();
            return res.status(400).json({
                error: true,
                message: error.message,
                data: error
            })
        }
    }
}
async function uploadIjazah(body, account) {
     let t = await sequelize.transaction();
     try {
        let fileAdd = await Ijazah.create(body, { transaction: t });
        console.log(fileAdd)
         await Riwayat_ijazah.create({
             fileId: fileAdd.dataValues.id,
             status: "Uploaded",
             keterangan: "File uploaded oleh " + account.nama
         }, { transaction: t });
         
     } catch (error) {
         await t.rollback();
         throw new Error(error)
     }
     t.commit();
    return;
}
async function uploadStr(body, account) {
    let t = await sequelize.transaction();
    try {
       let fileAdd = await Str.create(body, { transaction: t });
       console.log(fileAdd)
        await Riwayat_str.create({
            fileId: fileAdd.dataValues.id,
            status: "Uploaded",
            keterangan: "File uploaded oleh " + account.nama
        }, { transaction: t });
        
    } catch (error) {
        await t.rollback();
        throw new Error(error)
    }
    t.commit();
   return;
}
async function uploadKtp(body, account) {
    let t = await sequelize.transaction();
    try {
       let fileAdd = await Ktp.create(body, { transaction: t });
       console.log(fileAdd)
        await Riwayat_ktp.create({
            fileId: fileAdd.dataValues.id,
            status: "Uploaded",
            keterangan: "File uploaded oleh " + account.nama
        }, { transaction: t });
        
    } catch (error) {
        await t.rollback();
        throw new Error(error)
    }
    t.commit();
   return;
}
async function uploadKk(body, account) {
    let t = await sequelize.transaction();
    try {
       let fileAdd = await Kk.create(body, { transaction: t });
       console.log(fileAdd)
        await Riwayat_kk.create({
            fileId: fileAdd.dataValues.id,
            status: "Uploaded",
            keterangan: "File uploaded oleh " + account.nama
        }, { transaction: t });
        
    } catch (error) {
        await t.rollback();
        throw new Error(error)
    }
    t.commit();
   return;
}
async function uploadNpwp(body, account) {
    let t = await sequelize.transaction();
    try {
       let fileAdd = await Npwp.create(body, { transaction: t });
       console.log(fileAdd)
        await Riwayat_npwp.create({
            fileId: fileAdd.dataValues.id,
            status: "Uploaded",
            keterangan: "File uploaded oleh " + account.nama
        }, { transaction: t });
        
    } catch (error) {
        await t.rollback();
        throw new Error(error)
    }
    t.commit();
   return;
}
async function uploadCv(body, account) {
    let t = await sequelize.transaction();
    try {
       let fileAdd = await Cv.create(body, { transaction: t });
       console.log(fileAdd)
        await Riwayat_cv.create({
            fileId: fileAdd.dataValues.id,
            status: "Uploaded",
            keterangan: "File uploaded oleh " + account.nama
        }, { transaction: t });
        
    } catch (error) {
        await t.rollback();
        throw new Error(error)
    }
    t.commit();
   return;
}
async function uploadSertifikat(body, account) {
    let t = await sequelize.transaction();
    try {
       let fileAdd = await Sertifikat.create(body, { transaction: t });
       console.log(fileAdd)
        await Riwayat_sertifikat.create({
            fileId: fileAdd.dataValues.id,
            status: "Uploaded",
            keterangan: "File uploaded oleh " + account.nama
        }, { transaction: t });
        
    } catch (error) {
        await t.rollback();
        throw new Error(error)
    }
    t.commit();
   return;
}
async function uploadSkck(body, account) {
    let t = await sequelize.transaction();
    try {
       let fileAdd = await Skck.create(body, { transaction: t });
       console.log(fileAdd)
        await Riwayat_skck.create({
            fileId: fileAdd.dataValues.id,
            status: "Uploaded",
            keterangan: "File uploaded oleh " + account.nama
        }, { transaction: t });
        
    } catch (error) {
        await t.rollback();
        throw new Error(error)
    }
    t.commit();
   return;
}
async function uploadKontrak(body, account) {
    let t = await sequelize.transaction();
    try {
       let fileAdd = await Kontrak.create(body, { transaction: t });
       console.log(fileAdd)
        await Riwayat_kontrak.create({
            fileId: fileAdd.dataValues.id,
            status: "Uploaded",
            keterangan: "File uploaded oleh " + account.nama
        }, { transaction: t });
        
    } catch (error) {
        await t.rollback();
        throw new Error(error)
    }
    t.commit();
   return;
}
async function uploadPangkat(body, account) {
    let t = await sequelize.transaction();
    try {
       let fileAdd = await Pangkat.create(body, { transaction: t });
       console.log(fileAdd)
        await Riwayat_pangkat.create({
            fileId: fileAdd.dataValues.id,
            status: "Uploaded",
            keterangan: "File uploaded oleh " + account.nama
        }, { transaction: t });
        
    } catch (error) {
        await t.rollback();
        throw new Error(error)
    }
    t.commit();
   return;
}
async function uploadLainnya(body, account) {
    let t = await sequelize.transaction();
    try {
       let fileAdd = await Lainnya.create(body, { transaction: t });
       console.log(fileAdd)
        await Riwayat_lainnya.create({
            fileId: fileAdd.dataValues.id,
            status: "Uploaded",
            keterangan: "File uploaded oleh " + account.nama
        }, { transaction: t });
        
    } catch (error) {
        await t.rollback();
        throw new Error(error)
    }
    t.commit();
   return;
    
}

