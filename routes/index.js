const express = require('express');
const router = express.Router();
const controller = require('../controllers');
const api = require('../controllers/api');
const middleware = require('../middleware');
const ajax = require('../controllers/ajax');
const report = require('../controllers/report');
// router.get('/', (req, res) => {
//     // res.send('Hello World!')
//     res.render('login', { title: "login" })
// })

router.get('/',middleware.checkLogin, controller.login);
router.get('/daily', middleware.login, controller.daily);
router.get('/monthly', middleware.login, controller.monthly);
router.get('/report', middleware.login, controller.report);
router.get('/profile', middleware.login, controller.profile);
router.get('/logout', middleware.logout);

router.post('/api/send-otp', api.sendOtp);
router.post('/api/verify-otp', api.verifyOtp);

router.post('/api/updateProfile', middleware.login, middleware.Profile, ajax.updateProfile);
router.get('/api/getAnggota', middleware.login, ajax.getAnggota);

router.post('/api/progress', middleware.login, ajax.progress);
router.get('/api/monthly', middleware.login, ajax.monthly);
router.get('/api/monthly/score', middleware.login, ajax.getScore);
router.delete('/api/monthly', middleware.login, ajax.deleteLpkp);
router.post('/api/monthly', middleware.login, ajax.createReport);
router.get('/api/monthly/report', middleware.login, ajax.getReport);
router.get('/api/monthly/activity', middleware.login, ajax.getActivity);

router.get('/api/report', middleware.login, report.person);

module.exports = router;