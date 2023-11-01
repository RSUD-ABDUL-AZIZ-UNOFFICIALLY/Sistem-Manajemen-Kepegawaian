const express = require('express');
const router = express.Router();
const middleware = require('../middleware/rest');
const controller = require('../controllers/rest');

router.post('/getOtp', middleware.check, controller.getOtp);
router.post('/login', middleware.check, controller.login);    

module.exports = router;