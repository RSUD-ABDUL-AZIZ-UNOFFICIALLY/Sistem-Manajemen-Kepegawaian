const express = require('express');
const router = express.Router();
const controller = require('../controllers');
const api = require('../controllers/api');
const middleware = require('../middleware');
const ajax = require('../controllers/ajax');
const report = require('../controllers/report');
const tracker = require('../controllers/tracker');
const complaint = require('../controllers/complaint');
const { upload } = require('../middleware/upload');
const seen = require('../controllers/seen');
const presensi = require('../controllers/presensi');


router.get('/',middleware.checkLogin, controller.login);
router.get('/daily', middleware.login, controller.daily);
router.get('/monthly', middleware.login, controller.monthly);
router.get('/approvement', middleware.login, controller.approvement);
router.get('/review', middleware.login, controller.review);
router.get('/report', middleware.login, controller.report);
router.get('/contact', middleware.login, controller.getContact); 

router.get('/simrs/regis', middleware.login, middleware.checkHakAkses('rm'), controller.addAnggotaPasien);

router.get('/helpdesk', middleware.login, controller.helpDesk);

router.get('/profile', middleware.login, controller.profile);
router.get('/account', middleware.login, controller.account);

router.get('/cuti', middleware.login, controller.cuti);
router.get('/cuti/admin', middleware.login, controller.adminCuti);
router.get('/aprovecuti', middleware.login, controller.approvalcuti);
router.get('/aprovecuti/admin', middleware.login, controller.leagercuti);

router.get('/presensi', middleware.login, controller.presensi);
router.get('/absen', middleware.login, controller.absensi);

router.get('/logout', middleware.logout);

router.get('/helpDeskAdmin', middleware.login, controller.helpDeskAdmin);

router.post('/api/send-otp', api.sendOtp);
router.post('/api/verify-otp', api.verifyOtp);
router.get('/api/simrs/userpas', middleware.login, api.getUserSimrs);
router.get('/api/microtik/userpas', middleware.login, ajax.getUserMicrotik);

router.post('/api/updateProfile', middleware.login, ajax.updateProfile);
router.get('/api/getAnggota', middleware.login, ajax.getAnggota);
router.post('/api/updateBiodata', middleware.login, ajax.updateBiodata);
router.get('/api/getBiodata', middleware.login, ajax.getBiodata);
router.post('/api/postPic', middleware.login, upload.single('image'), ajax.postPic);
router.get('/api/getPic', middleware.login, ajax.getPic);

router.post('/api/progress', middleware.login, ajax.progress);
router.get('/api/monthly', middleware.login, ajax.monthly);
router.get('/api/monthly/score', middleware.login, ajax.getScore);
router.post('/api/monthly', middleware.login, ajax.createReport);
router.get('/api/monthly/report', middleware.login, ajax.getReport);
router.get('/api/monthly/activity', middleware.login, ajax.getActivity);
router.post('/api/monthly/activity', middleware.login, ajax.updateActivity);
router.delete('/api/monthly/activity', middleware.login, ajax.deleteActivity);
router.get('/api/monthly/signaute', middleware.login, ajax.getSignaute);
router.get('/api/monthly/approvement', middleware.login, ajax.getApprovement);
router.post('/api/monthly/approvement', middleware.login, ajax.signature);
router.get('/api/template', middleware.login, ajax.getTemplate);
router.post('/api/template', middleware.login, ajax.createTemplate);
router.delete('/api/template', middleware.login, ajax.deleteTemplate);


router.get('/api/cuti/jns', middleware.login, ajax.getJns_cuti);
router.post('/api/cuti', middleware.login, ajax.postCuti);
router.post('/api/cuti/late', middleware.login, ajax.postCutiLate);
router.delete('/api/cuti', middleware.login, ajax.deleteCuti);
router.get('/api/cuti/riwayat', middleware.login, ajax.getRiwayatCuti);
router.get('/api/cuti/sisa', middleware.login, ajax.getSisaCuti);
router.get('/api/cuti/approvementcuti', middleware.login, ajax.getAnggotaCuti);
router.post('/api/cuti/approvementcuti', middleware.login, ajax.updateCuti);
router.get('/api/cuti/approve/all', middleware.login, ajax.getAllCuti);
router.post('/api/cuti/suratCuti', middleware.login, ajax.GetCuti);
router.get('/api/cuti/suratCuti', report.reportCuti);


router.get('/api/contact/user', middleware.login, ajax.getProfiles);
router.get('/api/contact/pic', ajax.getProfilepic);
router.get('/api/contact/menu', middleware.login, ajax.getMenu);


router.get('/api/report', middleware.login, report.person);
router.get('/api/report/preview', middleware.login, report.results);

router.post('/api/tracker', middleware.login, tracker.index);
router.post('/api/jwt', tracker.bio);
router.get('/api/jwt', tracker.bio);

router.post('/api/complaint', middleware.login, complaint.addTiket);
router.get('/api/complaint', middleware.login, complaint.getTiket);
router.get('/api/complaint/detail', middleware.login, complaint.getStatus);
router.post('/api/complaint/status', middleware.login, complaint.setStatus);
router.get('/api/complaint/all', middleware.login, complaint.getAllTiket);
router.get('/api/complaint/updateTiket', middleware.login, complaint.getUpdateTiket);
// router.post('/api/complaint/grubtiket', middleware.login, complaint.updateTiket);

router.get('/api/presensi/anggota', middleware.login, presensi.anggota);
router.get('/api/presensi/departemen', middleware.login, presensi.departemen);
router.get('/api/presensi/jnsdns', middleware.login, presensi.getTypeJadwal);
router.post('/api/presensi/anggota', middleware.login, presensi.updateJadwal);
router.post('/api/presensi/getlocation', middleware.login, presensi.getlocation);
router.get('/api/presensi/jdldns', middleware.login, presensi.getjdlDNS);
router.post('/api/presensi/absen', middleware.login, presensi.absen);
router.get('/api/presensi/riwayat', middleware.login, presensi.riwayat);

// router.get('/api/presensi/bos', middleware.login, presensi.jadwal);

router.get('/api/seen', seen.update);
router.get('/api/seen/online', seen.online);
router.get('/api/seen/last_seen', seen.last_seen);

module.exports = router;