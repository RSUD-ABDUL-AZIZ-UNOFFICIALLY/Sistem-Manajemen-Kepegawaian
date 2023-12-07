const express = require('express');
const router = express.Router();
const middleware = require('../middleware/rest');
const controller = require('../controllers/hardin');

router.post('/daftar/sendOtp', controller.sendOtp);
router.post('/daftar', controller.daftar);    

module.exports = router;