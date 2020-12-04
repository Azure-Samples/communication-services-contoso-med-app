const botService = require('../services/bot.service')

const createBotThread = async (req, res) => {
    let response = await botService.createBotThread(req.userData.email)
    res.status(200).json(response)
}

const getHelperBotIdentity = async (req, res) => {
    let response = await botService.getBotSpoolID()
    res.status(200).json(response)
}

exports.createBotThread = createBotThread
exports.getHelperBotIdentity = getHelperBotIdentity