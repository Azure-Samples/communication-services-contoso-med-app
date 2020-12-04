const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const checkToken = require('../middlewares/checkToken');

// only authenticated routes
// below this line
//router.use(checkToken);

module.exports = router;
