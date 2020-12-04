import {
    CREATE_BOT_THREAD_LOADING,
    CREATE_BOT_THREAD_SUCCESS,
    CREATE_BOT_THREAD_FAILURE,
} from '../actions/bot.actions'

const initialState = {}

export default function botInfo(state = initialState, action) {
    switch (action.type) {
        case CREATE_BOT_THREAD_LOADING:
            return { ...state, loading: true }
        case CREATE_BOT_THREAD_SUCCESS:
            return { ...state, loading: false, ...action.payload}
        case CREATE_BOT_THREAD_FAILURE:
            return { ...state, loading: false, ...action.payload}
        default:
            return state;
    }
}