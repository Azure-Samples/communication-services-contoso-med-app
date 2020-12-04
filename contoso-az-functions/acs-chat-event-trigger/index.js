// format: https://{website_url}/qnamaker/knowledgebases/{GUID}/generateAnswer
const qnaMakerEndpoint = "QnA maker endpoint" 

// format: EndpointKey {GUID}
const qnaMakerEndpointKey = "QnA maker endpoint key for authentication" 

// format: https://{instance_name}.communication.azure.com
const acsEndpoint = "Communication Service Endpoint" 

// example: https://{deployment_url}.azurewebsites.net
const apiEndpoint = "Contoso Med API endpoint"

let { AzureCommunicationUserCredential } = require('@azure/communication-common')
let { ChatClient } = require("@azure/communication-chat");
let axios = require('axios').default;

module.exports = async function (context, eventGridEvent) {

    try {
        if (eventGridEvent.eventType === "Microsoft.Communication.ChatMessageReceived") {
            let message = eventGridEvent.data
    
            context.log('new chat message received:')
            context.log(message)
    
            // get bot identity information
            let botIdentityResponse = await axios.get(`${apiEndpoint}/bot/getHelperBotIdentity`)
            let botIdentity = botIdentityResponse.data

            context.log('currently active bot:')
            context.log(botIdentity)
    
            // initialize chat client
            let chatClient = new ChatClient(acsEndpoint, new AzureCommunicationUserCredential(botIdentity.token))
            let chatThreadClient = await chatClient.getChatThreadClient(message.threadId)
    
            // only process message if type is `Text` and is recipient is a bot
            if (message.type === 'Text' && message.recipientId === botIdentity.user.communicationUserId) {
    
                context.log('sending message to bot: ' + message.messageBody)
    
                // send to bot / QnA maker
                let result = await axios.post(qnaMakerEndpoint, {
                    question: message.messageBody
                }, {
                    headers: { 'Authorization': qnaMakerEndpointKey }
                })
    
                context.log('response from QnA maker')
                context.log(result)
    
                if (result.data.answers !== undefined && result.data.answers.length > 0) {
                    let response = {}
    
                    // send message with prompts
                    if (result.data.answers[0].context !== undefined && result.data.answers[0].context.prompts !== undefined) {
                        response = { text: result.data.answers[0].answer, prompts: result.data.answers[0].context.prompts }
                    }
    
                    // send plain answer
                    else {
                        response = { text: result.data.answers[0].answer }
                    }
    
                    context.log('posting message to chat thread')
                    context.log(response)

                    await chatThreadClient.sendMessage({ content:  JSON.stringify(response) }, { senderDisplayName: 'Bot', priority: 'Normal' })

                    // for this particular response, also add a doctor to the thread
                    if (result.data.answers[0].answer === "Please wait, while we add a doctor to this thread...") {
                        let availableDoctor = (await axios.get(`${apiEndpoint}/doctors/currently-available?category=Cardiologist`)).data
                        await chatThreadClient.addMembers({
                            members: [
                                {
                                    user: { communicationUserId: availableDoctor.spoolID },
                                    displayName: `Dr. ${availableDoctor.name}`
                                }
                            ]
                        })

                        await chatThreadClient.sendMessage({ content:  JSON.stringify({ text: `Please welcome Dr. ${availableDoctor.name} to the conversation. Thank you for using our automated assistance. Wishing you best of your health.` }) }, { senderDisplayName: 'Bot', priority: 'Normal' })
                        chatThreadClient.removeMember({ communicationUserId: botIdentity.user.communicationUserId })
                    }
                }
            }
        }
    }
    catch (e) {
        context.log(e)
    }
}