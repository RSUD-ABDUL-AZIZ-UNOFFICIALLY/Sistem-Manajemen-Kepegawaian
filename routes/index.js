const express = require('express');
const router = express.Router();
const controller = require('../controllers');
const api = require('../controllers/api');
const middleware = require('../middleware');
const ajax = require('../controllers/ajax');
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

router.post('/api/updateProfile', middleware.login, ajax.updateProfile);
router.post('/api/progress', middleware.login, ajax.progress);
router.get('/api/monthly', middleware.login, ajax.monthly);
router.delete('/api/monthly', middleware.login, ajax.deleteLpkp);

module.exports = router;