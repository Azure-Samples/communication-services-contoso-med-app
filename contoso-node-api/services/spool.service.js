const ChatClient = require("@azure/communication-chat").ChatClient;
const userService = require('./user.service')
const dbClient = require("../db/index");
const { CommunicationIdentityClient } = require("@azure/communication-administration");
const config = require('../config.json')

const getSpoolID = async (userEmail, userType) => {
    var user = (userType == 'Doctor' ? await userService.findDoctor(userEmail) : await userService.findUser(userEmail));
    if (user.spoolID !== undefined) {
        return user.spoolID
    }
    else {
        try {
            // generate the spool id and token
            const identityClient = new CommunicationIdentityClient(config.connectionString)
            let userResponse = await identityClient.createUser();
            tokenResponse = await identityClient.issueToken(userResponse, ["voip", "chat"]);
            
            if (userType === 'Doctor') 
                await userService.updateSpoolIDForDoctor(tokenResponse.user.communicationUserId, tokenResponse.token, userEmail)
            else
                await userService.updateSpoolID(tokenResponse.user.communicationUserId, tokenResponse.token, userEmail)

            return tokenResponse.user.communicationUserId
        }
        catch (e) {
            console.log(e)
            return undefined;
        }
    }
}

exports.getSpoolID = getSpoolID;