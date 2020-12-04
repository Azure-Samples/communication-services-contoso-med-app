import axios from 'axios'
import { api, success, error } from './services.common'
import { constants } from '../../config'

export const createBotThreadAPI = async (patientEmail) => {
    try {
        let token = localStorage.getItem(constants.KEY_AUTH_TOKEN)
        let headers = {
            'Authorization': 'Bearer ' + token
        }

        let response = await axios.get(`${api}/bot/createBotThread`, { headers })
        return success(response.data)
    }
    catch (e) {
        console.log(e)
        return error(e)
    }
}