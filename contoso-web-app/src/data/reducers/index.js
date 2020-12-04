import { combineReducers } from "redux"
import authReducer from "./auth.reducer"
import appointmentReducer from "./appointment.reducer";
import chatReducer from './chat.reducer'
import botReducer from './bot.reducer'

const rootReducer = combineReducers({
    auth: authReducer,
    appointments: appointmentReducer,
    chat: chatReducer,
    bot: botReducer
})

export default rootReducer