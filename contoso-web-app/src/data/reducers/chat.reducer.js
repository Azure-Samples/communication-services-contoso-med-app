import { 
    OPERATION_IN_PROGRESS,
    OPERATION_FAILED,
    CREATE_THREAD_SUCCESS,
    NEW_MESSAGE_RECEIVED,
    SEND_MESSAGE_SUCCESS,
    NEW_SUPPORT_THREAD_CREATED
 } from "../actions/chat.actions";

 const initialState = {
     currentThreadId: undefined,
     messages: [],
     supportThreads: [],
     appointmentThreads: []
 }

 export default function chatInfo(state = initialState, action) {
     switch (action.type) {
        case OPERATION_IN_PROGRESS:
            return { ...state, loading: true }
        case CREATE_THREAD_SUCCESS:
            return { ...state, ...action.payload, appointmentThreads: [ ...state.appointmentThreads, action.payload.currentThreadInfo ], currentThreadId: action.payload.currentThreadInfo.threadId, messages: action.payload.currentThreadInfo.messages, loading: false }
        case SEND_MESSAGE_SUCCESS:
            return { ...state, ...action.payload, loading: false }
        case NEW_MESSAGE_RECEIVED:
            return { ...state, messages: [ ...state.messages, action.payload.newMessage] }
        case NEW_SUPPORT_THREAD_CREATED:
            return { ...state, supportThreads: [ ...state.supportThreads, action.payload.supportThreadInfo ] }
        case OPERATION_FAILED:
            return { ...state, ...action.payload, loading: false }
        default: 
            return state;
     }
 }