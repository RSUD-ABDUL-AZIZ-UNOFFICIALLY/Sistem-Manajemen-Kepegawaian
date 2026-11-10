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
const dokumen = require('../controllers/dokumen');


router.get('/', middleware.checkLogin, controller.login);
router.get('/test', middleware.login, controller.test);
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
router.get('/document', middleware.login, controller.doc);
router.get('/salary', middleware.login, controller.salary);

router.get('/cuti', middleware.login, controller.cuti);
router.get('/cuti/admin', middleware.login, controller.adminCuti);
router.get('/aprovecuti', middleware.login, controller.approvalcuti);
router.get('/aprovecuti/admin', middleware.login, controller.leagercuti);

router.get('/presensi', middleware.login, controller.presensi);
router.get('/presensi/setJadwal', middleware.login, controller.setJadwal);
router.get('/presensi/attendence', middleware.login, middleware.checkHakAkses('adminAttendence'), controller.attendence);
router.get('/absen', middleware.login, controller.absensi);

router.get('/logout', middleware.logout);

router.get('/helpDeskAdmin', middleware.login, controller.helpDeskAdmin);
router.get('/kepegawaian', middleware.login, controller.pegawaiAdmin);
router.get('/kepegawaian/:id', middleware.login, controller.dataAdmin);
router.get('/document/pegawaian/:id', middleware.login, controller.dataDokument);

router.post('/api/send-otp', api.sendOtp);
router.post('/api/mobile-otp', api.mobileOtp);
router.post('/api/verify-otp', api.verifyOtp);
router.get('/api/lastActivity', middleware.checkToken, api.lastActivity);
router.delete('/api/closeSession/:id', middleware.checkToken, api.closeSession);
router.get('/api/simrs/userpas', middleware.checkToken, api.getUserSimrs);
// router.get('/api/session', middleware.checkToken, api.edtoken); // cek session via backend
router.get('/api/passkey/generator', middleware.checkToken, api.generatePasskey);
router.post('/api/passkey/activate', middleware.checkToken, api.activatePasskey);
router.get('/api/microtik/userpas', middleware.checkToken, ajax.getUserMicrotik);

router.post('/api/updateProfile', middleware.checkToken, ajax.updateProfile);
router.get('/api/getAnggota', middleware.checkToken, ajax.getAnggota);
router.post('/api/updateBiodata', middleware.checkToken, ajax.updateBiodata);
router.get('/api/getBiodata', middleware.checkToken, ajax.getBiodata);
router.post('/api/postPic', middleware.checkToken, upload.single('image'), ajax.postPic);
router.get('/api/getPic', middleware.checkToken, ajax.getPic);

router.post('/api/progress', middleware.checkToken, ajax.progress);
router.get('/api/monthly', middleware.checkToken, ajax.monthly);
router.get('/api/monthly/score', middleware.checkToken, ajax.getScore);
router.post('/api/monthly', middleware.checkToken, ajax.createReport);
router.post('/api/v2/monthly', middleware.checkToken, ajax.createReport2);
router.get('/api/v2/monthly', middleware.checkToken, ajax.getStatusReport2);
router.get('/api/monthly/report', middleware.checkToken, ajax.getReport);
router.get('/api/monthly/activity', middleware.checkToken, ajax.getActivity);
router.post('/api/monthly/activity', middleware.checkToken, ajax.updateActivity);
router.delete('/api/monthly/activity', middleware.checkToken, ajax.deleteActivity);
router.get('/api/monthly/signaute', middleware.checkToken, ajax.getSignaute);
router.get('/api/monthly/approvement', middleware.checkToken, ajax.getApprovement);
router.post('/api/monthly/approvement', middleware.checkToken, ajax.signature);
router.get('/api/monthly/periode', middleware.checkToken, ajax.getperiode);
router.get('/api/template', middleware.checkToken, ajax.getTemplate);
router.post('/api/template', middleware.checkToken, ajax.createTemplate);
router.delete('/api/template', middleware.checkToken, ajax.deleteTemplate);

router.post('/api/document/:id', middleware.checkToken, dokumen.uploadDoc);
router.get('/api/document', middleware.checkToken, dokumen.getDocAll);
router.get('/api/find/document/:id', middleware.checkToken, dokumen.findDocAll);
router.put('/api/document', middleware.checkToken, dokumen.editDoc);
router.delete('/api/document/:id', middleware.checkToken, dokumen.deleteDoc);
router.get('/api/salary/gaji', middleware.checkToken, dokumen.gaji);
router.get('/api/salary/tpp', middleware.checkToken, dokumen.tpp);



router.get('/api/cuti/jns', middleware.checkToken, ajax.getJns_cuti);
router.post('/api/cuti', middleware.checkToken, ajax.postCuti);
router.post('/api/cuti/late', middleware.checkToken, ajax.postCutiLate);
router.delete('/api/cuti', middleware.checkToken, ajax.deleteCuti);
router.get('/api/cuti/riwayat', middleware.checkToken, ajax.getRiwayatCuti);
router.get('/api/cuti/sisa', middleware.checkToken, ajax.getSisaCuti);
router.get('/api/cuti/approvementcuti', middleware.checkToken, ajax.getAnggotaCuti);
router.post('/api/cuti/approvementcuti', middleware.checkToken, ajax.updateCuti);
router.get('/api/cuti/approve/all', middleware.checkToken, ajax.getAllCuti);
router.post('/api/cuti/suratCuti', middleware.checkToken, ajax.GetCuti);
router.get('/api/cuti/suratCuti', report.reportCuti);


router.get('/api/contact/user', middleware.checkToken, ajax.getProfiles);
router.get('/api/contact/pic', ajax.getProfilepic);
router.get('/api/contact/menu', middleware.checkToken, ajax.getMenu);
router.get('/api/pegawai/status', middleware.checkToken, ajax.getPegawaiStatus);
router.get('/api/pegawai/count', middleware.checkToken, ajax.getPegawaiCount);
router.get('/api/pegawai/countDep', middleware.checkToken, ajax.getDepCount);
router.get('/api/pegawai/gologan/:id', middleware.checkToken, ajax.getGologan);
router.put('/api/pegawai/data', middleware.checkToken, middleware.checkHakAkses('kepegawaian'), ajax.updateDataPegawai);
router.post('/api/pegawai/tokenDoc', middleware.checkToken, middleware.checkHakAkses('kepegawaian'), middleware.tokenGen);


router.get('/api/report', middleware.checkToken, report.person);
router.get('/api/report/preview', middleware.checkToken, report.results);

router.post('/api/tracker', middleware.checkToken, tracker.index);
router.post('/api/jwt', tracker.bio);
router.get('/api/jwt', tracker.bio);

router.post('/api/complaint', middleware.checkToken, complaint.addTiket);
router.get('/api/complaint', middleware.checkToken, complaint.getTiket);
router.get('/api/complaint/detail', middleware.checkToken, complaint.getStatus);
router.post('/api/complaint/status', middleware.checkToken, complaint.setStatus);
router.get('/api/complaint/all', middleware.checkToken, complaint.getAllTiket);
router.get('/api/complaint/updateTiket', middleware.checkToken, complaint.getUpdateTiket);
// router.post('/api/complaint/grubtiket', middleware.checkToken, complaint.updateTiket);

router.get('/api/presensi/anggota', middleware.checkToken, presensi.anggota);
// router.get('/api/presensi/jamDns', middleware.checkToken, presensi.jamDns);
router.get('/api/presensi/departemen', middleware.checkToken, presensi.departemen);
router.get('/api/presensi/jnsdns', middleware.checkToken, presensi.getTypeJadwal);
router.post('/api/presensi/jnsdns', middleware.checkToken, presensi.postTypeJadwal);
router.post('/api/presensi/anggota', middleware.checkToken, presensi.updateJadwal);
router.post('/api/presensi/getlocation', middleware.checkToken, presensi.getlocation);
router.get('/api/presensi/jdldns', middleware.checkToken, presensi.getjdlDNS);
router.get('/api/presensi/jdldnsall', middleware.checkToken, presensi.alljdlDNS);
router.post('/api/presensi/absen', middleware.checkToken, presensi.absen);
router.get('/api/presensi/riwayat', middleware.checkToken, presensi.riwayat);
router.get('/api/presensi/recap', middleware.checkToken, presensi.recap);
router.get('/api/presensi/recap/:nik', presensi.recapbyNik);
router.get('/api/presensi/attendance', middleware.checkToken, presensi.attendance);
router.get('/api/presensi/attendance/overtime', middleware.checkToken, presensi.overtime);
router.get('/api/presensi/riwayat/:nik', presensi.riwayatByNik);
router.post('/api/presensi/backdate/:nik', middleware.checkToken, middleware.checkHakAkses('adminAttendence'), presensi.backdate);

// router.get('/api/presensi/bos', middleware.login, presensi.jadwal);

router.get('/api/seen', seen.update);
router.get('/api/seen/online', seen.online);
router.get('/api/seen/last_seen', seen.last_seen);

router.get('/api/health', api.health);

module.exports = router;