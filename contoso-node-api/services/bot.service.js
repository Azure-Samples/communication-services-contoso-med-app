const { ChatClient } = require("@azure/communication-chat");
const { AzureCommunicationUserCredential } = require("@azure/communication-common");
const { CommunicationIdentityClient } = require('@azure/communication-administration')
const W3CWebSocket = require('websocket').w3cwebsocket
const config = require('../config.json')
const axios = require("axios").default
const { fork } = require('child_process')

const dbClient = require("../db/index");

const spoolService = require('./spool.service')
const userService = require('./user.service');

let botSpoolIdentity = undefined

// we assign a spool ID to a bot
const getBotSpoolID = async () => {
    if (botSpoolIdentity === undefined) {
        let db = dbClient.getDB()
        let bot = await db.collection("Bots").findOne({ type: 'helper-bot' })
        console.log('getting bot spool id')
        console.log(bot)
        const identityClient = new CommunicationIdentityClient(config.connectionString)

        if (bot === null) {
            // generate new communication user id for bot
            let userResponse = await identityClient.createUser();
            console.log('user response')
            console.log(userResponse)
            bot = { type: 'helper-bot', communicationUserId: userResponse.communicationUserId }

            // save bot to database
            await db.collection("Bots").insertOne(bot)
        }

        botSpoolIdentity = await identityClient.issueToken({ communicationUserId: bot.communicationUserId }, ["voip", "chat"]);
    }
    return botSpoolIdentity
}

const createBotThread = async (patientUser) => {
    let botSpoolIdentity = await getBotSpoolID();

    let patient = await userService.findUser(patientUser)

    let db = dbClient.getDB();
    /*------------------------------------------------*/
    /** uncomment this block to save conversation by 
     * re-using the same thread between bot and user */

    // let botThreads = await db.collection("BotThreads").find({}).toArray();

    // if (botThreads !== undefined && botThreads.length > 0) {
    //     // check if thread exists
    //     let thread = botThreads.find(
    //         (thread) => thread.members.find(member => member.user.communicationUserId === patient.spoolID) !== undefined
    //     )

    //     if (thread !== undefined) {
    //         console.log('bot thread already exists')
    //         return thread;
    //     }
    // }
    /*------------------------------------------------*/

    let threadOptions = {
        topic: `Support Conversation with ${patient.name}`,
        members: [
            {
                user: { communicationUserId: botSpoolIdentity.user.communicationUserId },
                displayName: 'Bot'
            },
            {
                user: { communicationUserId: await spoolService.getSpoolID(patientUser, 'Patient') },
                displayName: patient.name
            }
        ]
    }

    let chatClient = new ChatClient(config.endpoint, new AzureCommunicationUserCredential(botSpoolIdentity.token))
    let thread = await chatClient.createChatThread(threadOptions)

    threadOptions.threadId = thread.threadId
    await db.collection("BotThreads").insertOne(threadOptions)

    return thread
}

/**
 * Creates a proxy bridge between the Azure bot service and ACS
 * @param {string} userId userID (in this case emailID) of the user
 * @param {string} threadId threadID of the thread between the user and the bot
 */
const createBotConnection = async (userId, threadId) => {

    const botSpoolIdentity = await getBotSpoolID()
    const compute = fork('./bot.worker.js')
    compute.send({ userId, threadId, botSpoolIdentity })

}

exports.getBotSpoolID = getBotSpoolID
exports.createBotThread = createBotThread
exports.createBotConnection = createBotConnection





// const messageClient = new W3CWebSocket(conversation.streamUrl)
    // messageClient.onmessage = async (e) => {
    //     console.log('new message from bot')
    //     console(e.data)
    //     await chatThreadClient.sendMessage({
    //         content: message
    //     })
    // }

    // // chatThreadClient.on("chatMessageReceived", async (e) => {
    // //     if (e.threadId === threadId) {
    // //         console.log(e)

    // //         // send to bot
    // //         await axios.post(`https://directline.botframework.com/v3/directline/conversations/${conversation.conversationId}/activities`, {
    // //             type: 'message',
    // //             from: { id: userId },
    // //             text: e.content
    // //         }, {
    // //             headers: { 'Authorization': `Bearer ${config.botDirectLineToken}`}
    // //         })
    // //     }
    // // })

    // let lastMessageId = undefined;

    // setInterval(async () => {
    //     console.log('polling for messages...')
    //     let messageIterator = chatThreadClient.listMessages();
    //     let next = await messageIterator.next();
    //     while (!next.done) {
    //         let message = next.value
    //         if (message !== undefined && message.id !== lastMessageId) {
    //             lastMessageId = message.id;

    //             if (message.type === 'Text') {
    //                 console.log('new text message')
    //                 console.log(message)
    //                 // send to bot
    //                 await axios.post(`https://directline.botframework.com/v3/directline/conversations/${conversation.conversationId}/activities`, {
    //                     type: 'message',
    //                     from: { id: userId },
    //                     text: e.content
    //                 }, {
    //                     headers: { 'Authorization': `Bearer ${config.botDirectLineToken}`}
    //                 })
    //             }
    //         }
    //     }
    // }, 1000)

    // store active bridges
    //activeClients.push({ chatClient, messageClient })





// let lastMessageId = undefined;

//     setInterval(async () => {
//         let messageIterator = chatThreadClient.listMessages();
//         while (1) {
//             var message = await messageIterator.next();
//             console.log(message)
//             if (message.value !== undefined) {
//                 if (message.value.id === lastMessageId) {
//                     continue;
//                 }
//                 else {
//                     // process message
//                     lastMessageId = message.value.id
//                     if (message.value.type === 'Text') {
//                         console.log('new text message')
//                         console.log(message)
//                         // send to bot
//                         await axios.post(`https://directline.botframework.com/v3/directline/conversations/${conversation.conversationId}/activities`, {
//                             type: 'message',
//                             from: { id: patientUser },
//                             text: e.content
//                         }, {
//                             headers: { 'Authorization': `Bearer ${config.botDirectLineToken}`}
//                         })
//                     }
//                 }
//             }

//             if (message.done) break;
//         }
//     }, 1000)