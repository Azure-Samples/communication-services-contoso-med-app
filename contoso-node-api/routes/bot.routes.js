const express = require('express')
const router = express.Router();
const botController = require('../controllers/bot.controller')
const checkToken = require('../middlewares/checkToken')

// bot/getHelperBotIdentity
// endpoint for Azure Function to get bot's spoolID 
// and token information should be secured
router.get('/getHelperBotIdentity', botController.getHelperBotIdentity)

router.use(checkToken)

// bot/createBotThread
router.get('/createBotThread', botController.createBotThread);

module.exports = router