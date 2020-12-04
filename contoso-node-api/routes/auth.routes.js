const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');

router.post('/login', authController.login);

router.post('/doctorLogin', authController.doctorLogin);

module.exports = router;