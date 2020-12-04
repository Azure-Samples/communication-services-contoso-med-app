const userService = require('../services/user.service')
const chatService = require('../services/chat.service')

const createThread = async (req, res) => {
    let primaryUsername = req.body.patientEmail;
    let secondaryUsername = req.body.doctorEmail;

    let response = await chatService.createThread(primaryUsername, "Conversation", secondaryUsername);
    res.status(200).json(response);
}

const addUserToThread = async (req, res) => {
    res.status(501).send()
}

exports.createThread = createThread;
exports.addUserToThread = addUserToThread;