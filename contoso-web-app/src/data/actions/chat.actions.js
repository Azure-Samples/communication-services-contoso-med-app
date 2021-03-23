import { createThreadAPI, sendMessageAPI, createBotThreadAPI, setActiveThread } from "../services/chat.service";

export const OPERATION_IN_PROGRESS = "OPERATION_IN_PROGRESS"
export const OPERATION_FAILED = "OPERATION_FAILED"

export const CREATE_THREAD_SUCCESS = "CREATE_THREAD_SUCCESS"
export const NEW_MESSAGE_RECEIVED = "NEW_MESSAGE_RECEIVED"
export const NEW_SUPPORT_THREAD_CREATED = "NEW_SUPPORT_THREAD_CREATED"
export const SEND_MESSAGE_SUCCESS = "SEND_MESSAGE_SUCCESS"

export const createThread = (patientEmail, doctorEmail) => {
    return async (dispatch) => {
        dispatch(operationInProgressAction())
        let response = await createThreadAPI(patientEmail, doctorEmail)
        if (response.isSuccessful) dispatch(createThreadSuccessAction(response.data))
        else dispatch(operationFailedAction(response.message))
    }
}

export const createBotThread = (patientEmail) => {
    return async (dispatch) => {
        dispatch(operationInProgressAction())
        let response = await createBotThreadAPI(patientEmail)
        if (response.isSuccessful) dispatch(createThreadSuccessAction(response.data))
        else dispatch(operationFailedAction(response.message))
    }
}

export const selectActiveBotThread = (threadInfo) => {
    return (dispatch) => {
        setActiveThread(threadInfo)
        dispatch(createThreadSuccessAction(threadInfo))
    }
}

export const sendMessage = (threadId, messageText, spoolID) => {
    return async (dispatch) => {
        dispatch(operationInProgressAction())
        let response = await sendMessageAPI(threadId, messageText, spoolID)
        if (response.isSuccessful) dispatch(sendMessageSuccessAction(response.data))
        else dispatch (operationFailedAction(response.message))
    }
}

const sendMessageSuccessAction = (newMessage) => ({
    type: SEND_MESSAGE_SUCCESS,
    payload: {
        newMessage
    }
})

const createThreadSuccessAction = (currentThreadInfo) => ({
    type: CREATE_THREAD_SUCCESS,
    payload: {
        currentThreadInfo
    }
})

export const newMessageReceivedAction = (newMessage) => ({
    type: NEW_MESSAGE_RECEIVED,
    payload: {
        newMessage
    }
})

export const newSupportThreadCreatedAction = (supportThreadInfo) => ({
    type: NEW_SUPPORT_THREAD_CREATED,
    payload: {
        supportThreadInfo
    }
})

const operationInProgressAction = () => ({
    type: OPERATION_IN_PROGRESS
})

const operationFailedAction = (error) => ({
    type: OPERATION_FAILED,
    payload: error
})