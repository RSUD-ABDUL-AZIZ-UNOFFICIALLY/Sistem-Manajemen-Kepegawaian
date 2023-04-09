const express = require('express');
const router = express.Router();
const controller = require('../controllers');
const api = require('../controllers/api');

// router.get('/', (req, res) => {
//     // res.send('Hello World!')
//     res.render('login', { title: "login" })
// })

router.get('/', controller.login);
router.post('/api/send-otp', api.sendOtp);
router.post('/api/verify-otp', api.verifyOtp);

module.exports = router;