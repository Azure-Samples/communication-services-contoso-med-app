import axios from 'axios';
import { api, success, error } from "./services.common";

import neuro from '../../assets/images/doc-types/neurologist.png'
import dentist from '../../assets/images/doc-types/dentist.png'
import cardiologist from "../../assets/images/doc-types/cardiologist.png"
import orthopaedic from "../../assets/images/doc-types/orthopaedic-icon.png"
import oncologist from '../../assets/images/doc-types/oncologist.png'
import orthologist from '../../assets/images/doc-types/orthologist.png'
import generalPhysician from '../../assets/images/doc-types/general-physician.png'

import { constants } from '../../config';

export const getDoctorsStatsForCategoryAPI = async () => {
    try {
        let response = await axios.get(`${api}/doctors/byspeciality`);
        var allDocs = response.data;
        var docStats = [];
        for (var docKey in allDocs) {
            if (allDocs.hasOwnProperty(docKey)) {
                docStats.push({
                    name: docKey,
                    count: allDocs[docKey].length,
                    imageUrl: getIconForDocCategory(docKey)
                })
            }
        }
        return success(docStats);
    }
    catch (e) {
        console.log(e);
        return error(e);
    }
}

export const getDoctorsListForCategoryAPI = async (category) => {
    try {
        let response = await axios.get(`${api}/doctors?category=${category}`);
        return success(response.data);
    }
    catch (e) {
        console.log(e);
        return error(e);
    }
}

export const getDoctorByIdAPI = async (doctorId) => {
    try {
        let response = await axios.get(`${api}/doctors/byId?doctorId=${doctorId}`);
        return success(response.data);
    }
    catch (e) {
        console.log(e);
        return error(e);
    }
}

export const bookAppointmentAPI = async (doctorId, slotId, appointment) => {
    try {
        let token = localStorage.getItem(constants.KEY_AUTH_TOKEN)
        let headers = {
            'Authorization': 'Bearer ' + token
        }

        let response = await axios.post(`${api}/appointments/slots/book?doctorId=${doctorId}&slot_id=${slotId}`, appointment, { headers })
        return success(response.data)
    }
    catch (e) {
        console.log(e);
        return error(e);
    }
}

export const getActiveAppointmentsAPI = async () => {
    try {
        let token = localStorage.getItem(constants.KEY_AUTH_TOKEN)
        let headers = {
            'Authorization': 'Bearer ' + token
        }

        let response = await axios.get(`${api}/appointments/active`, { headers })
        return success(response.data)
    }
    catch (e) {
        console.log(e);
        return error(e);
    }
}

const getIconForDocCategory = (categoryName) => {
    switch (categoryName) {
        case "Dentist": 
            return dentist;
        case "Neurologist":
            return neuro;
        case "Cardiologist":
            return cardiologist;
        case "Orthopaedic":
            return orthopaedic;
        case "Oncologist":
            return oncologist;
        case "Orthologist":
            return orthologist;
        default:
            return generalPhysician;
    }
}