const express = require('express');
const router = express.Router();
const middleware = require('../middleware/rest');
const controller = require('../controllers/hardin');

router.post('/daftar/sendOtp', controller.sendOtp);
router.post('/daftar', controller.daftar);
router.post('/login/sendOtp', controller.loginSendOtp);
router.post('/login', controller.login);

router.get('/family', middleware.check, controller.getFamily);
router.post('/family', middleware.check, controller.addFamily);
router.get('/rm/user', controller.getUser);
router.get('/rm/pasie', controller.getPasien);

module.exports = router;