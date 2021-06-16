import axios from 'axios';
import { api, success, error } from "./services.common";
import { constants } from '../../config';

import { ChatClient } from "@azure/communication-chat";
import { AzureCommunicationTokenCredential } from "@azure/communication-common";

import { newMessageReceivedAction, newSupportThreadCreatedAction } from "../actions/chat.actions";

import { reduxStore } from "../../index";

let chatClient = undefined;
let chatThreadClient = undefined;
let currentThreadId = undefined;

let supportThreads = [];
let appointmentThreads = [];

export const getChatClient = () => {
    if (chatClient !== undefined) {
        return chatClient
    }
    else {
        let spoolID = localStorage.getItem(constants.KEY_SPOOL_ID)
        let spoolToken = localStorage.getItem(constants.KEY_SPOOL_TOKEN)

        chatClient = new ChatClient(constants.acsEndpoint, new AzureCommunicationTokenCredential(spoolToken))
        chatClient.startRealtimeNotifications()
            .then(() => {
                chatClient.on("chatMessageReceived", async (e) => {
                    if (currentThreadId !== undefined  && e.threadId === currentThreadId) {
                        reduxStore.dispatch(newMessageReceivedAction(e))
                    }
                    else if (e.senderDisplayName === 'Bot') {
                        // create a new support thread
                        let chatThread = await chatClient.getChatThread(e.threadId)
                        chatThread.messages = await getAllMessages(e.threadId)
                        supportThreads.push(chatThread)
                        reduxStore.dispatch(newSupportThreadCreatedAction(chatThread))
                    }
                })
            })

        console.log('new chat client initialized')
        return chatClient
    }
}

export const createThreadAPI = async (patientEmail, doctorEmail) => {
    try {
        let token = localStorage.getItem(constants.KEY_AUTH_TOKEN)
        let headers = {
            'Authorization': 'Bearer ' + token
        }

        let response = await axios.post(`${api}/chat/createThread`, { patientEmail, doctorEmail }, { headers })
        currentThreadId = response.data.threadId

        appointmentThreads.push(response.data)
        let messages = await getAllMessages(currentThreadId)
        return success({ ...response.data, messages })
    }
    catch (e) {
        console.log(e);
        return error(e);
    }
}

export const createBotThreadAPI = async (patientEmail) => {
    try {
        let token = localStorage.getItem(constants.KEY_AUTH_TOKEN)
        let headers = {
            'Authorization': 'Bearer ' + token
        }

        let response = await axios.get(`${api}/bot/createBotThread`, { headers })
        currentThreadId = response.data.threadId

        let messages = await getAllMessages(currentThreadId)
        return success({ ...response.data, messages })
    }
    catch (e) {
        console.log(e)
        return error(e)
    }
}

export const setActiveThread = (thread) => {
    currentThreadId = thread.id
}

export const sendMessageAPI = async (threadId, messageText, senderId) => {
    if (chatThreadClient === undefined || chatThreadClient.threadId !== threadId) {
        // reinitialize the thread client
        chatThreadClient = await getChatClient().getChatThreadClient(threadId)
    }

    let message = await chatThreadClient.sendMessage({ content: messageText }, { senderDisplayName: localStorage.getItem(constants.KEY_DISPLAY_NAME), priority: 'Normal' })
    return success({ ...message, senderId, content: { message: messageText }})
}

export const getMessagesAPI = async (threadId) => {
    let messages = await getAllMessages(threadId)
    return success(messages)
}

const getAllMessages = async (threadId) => {
    if (chatThreadClient === undefined || chatThreadClient.threadId !== threadId) {
        // reinitialize the thread client
        chatThreadClient = await getChatClient().getChatThreadClient(threadId)
    }

    let messages = [];
    let messageIterator = chatThreadClient.listMessages();

    let next = await messageIterator.next()
    while (!next.done) {
        let message = next.value
        if (message !== undefined && message.type === 'text') {
            messages.push(message)
        }
        next = await messageIterator.next()
    }

    // console.log(`Received ${messages.length} messages`);
    // console.dir(messages);

    return messages.reverse();
}