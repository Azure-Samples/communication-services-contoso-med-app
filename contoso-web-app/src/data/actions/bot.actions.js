import { createBotThreadAPI } from "../services/bot.service";

export const CREATE_BOT_THREAD_LOADING = "CREATE_BOT_THREAD_LOADING"
export const CREATE_BOT_THREAD_SUCCESS = "CREATE_BOT_THREAD_SUCCESS"
export const CREATE_BOT_THREAD_FAILURE = "CREATE_BOT_THREAD_FAILURE"

export const createBotThread = (patientEmail) => {
    return async (dispatch) => {
        dispatch(createBotThreadLoadingAction())
        let response = await createBotThreadAPI(patientEmail)
        if (response.isSuccessful) dispatch(createBotThreadSuccessAction(response.data))
        else dispatch(createBotThreadFailureAction(response.message))
    }
}

const createBotThreadLoadingAction = () => ({
    type: CREATE_BOT_THREAD_LOADING
})

const createBotThreadSuccessAction = (currentBotThreadInfo) => ({
    type: CREATE_BOT_THREAD_SUCCESS,
    payload: {
        currentBotThreadInfo
    }
})

const createBotThreadFailureAction = (error) => ({
    type: CREATE_BOT_THREAD_FAILURE,
    payload: error
})