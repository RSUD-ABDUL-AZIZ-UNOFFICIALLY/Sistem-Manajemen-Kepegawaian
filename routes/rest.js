const express = require('express');
const router = express.Router();
const middleware = require('../middleware/rest');
const controller = require('../controllers/rest');

router.post('/getOtp', controller.getOtp);
router.post('/login', controller.login);    

module.exports = router;