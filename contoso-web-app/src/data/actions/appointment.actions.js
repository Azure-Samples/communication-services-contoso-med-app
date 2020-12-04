import { getDoctorsStatsForCategoryAPI, getDoctorsListForCategoryAPI, 
    getDoctorByIdAPI, bookAppointmentAPI, getActiveAppointmentsAPI } 
    from "../services/appointment.service";

export const DOC_STATS_LOADING = "DOC_STATS_LOADING"
export const DOC_STATS_SUCCESS = "DOC_STATS_SUCCESS";
export const DOC_STATS_ERROR = "DOC_STATS_ERROR";

export const DOC_LIST_LOADING = "DOC_LIST_LOADING"
export const DOC_LIST_SUCCESS = "DOC_LIST_SUCCESS";
export const DOC_LIST_ERROR = "DOC_LIST_ERROR";

export const DOC_DETAIL_LOADING = "DOC_DETAIL_LOADING"
export const DOC_DETAIL_SUCCESS = "DOC_DETAIL_SUCCESS";
export const DOC_DETAIL_ERROR = "DOC_DETAIL_ERROR";

export const APPOINTMENT_BOOKING_LOADING = "APPOINTMENT_BOOKING_LOADING"
export const APPOINTMENT_BOOKING_SUCCESS = "APPOINTMENT_BOOKING_SUCCESS";
export const APPOINTMENT_BOOKING_ERROR = "APPOINTMENT_BOOKING_ERROR";

export const APPOINTMENT_LIST_LOADING = "APPOINTMENT_LIST_LOADING"
export const APPOINTMENT_LIST_SUCCESS = "APPOINTMENT_LIST_SUCCESS";
export const APPOINTMENT_LIST_ERROR = "APPOINTMENT_LIST_ERROR";

export const getDoctorsStatsByCategory = () => {
    return async (dispatch) => {
        dispatch(docStatsLoadingAction())
        let response = await getDoctorsStatsForCategoryAPI();
        if (response.isSuccessful) {
            dispatch(docStatsAction(response.data))
        }
        else {
            dispatch(docStatsFailureAction(response.message))
        }
    }
}

export const getDoctorsByCategory = (category) => {
    return async (dispatch) => {
        dispatch(docListLoadingAction())
        let response = await getDoctorsListForCategoryAPI(category)
        if (response.isSuccessful)
            dispatch(docListSuccessAction(response.data))
        else
            dispatch(docListFailureAction(response.message))
    }
}

export const getDoctorById = (doctorId) => {
    return async (dispatch) => {
        dispatch(docDetailLoadingAction());
        let response = await getDoctorByIdAPI(doctorId);
        if (response.isSuccessful) dispatch(docDetailSuccessAction(response.data));
        else dispatch(docDetailFailureAction(response.message))
    }
}

export const bookAppointment = (doctorId, slotId, appointment) => {
    return async (dispatch) => {
        dispatch(appointmentBookingLoadingAction())
        let response = await bookAppointmentAPI(doctorId, slotId, appointment);
        if (response.isSuccessful) dispatch(appointmentBookingSuccessAction(response.data))
        else dispatch (appointmentBookingFailureAction(response.message))
    }
}

export const getActiveAppointments = () => {
    return async (dispatch) => {
        dispatch(appointmentsListLoadingAction())
        let response = await getActiveAppointmentsAPI();
        if (response.isSuccessful) dispatch(appointmentsListSuccessAction(response.data));
        else dispatch (appointmentsListFailureAction(response.message));
    }
}

const docStatsLoadingAction = () => ({
    type: DOC_STATS_LOADING
})

const docStatsAction = (docStats) => ({
    type: DOC_STATS_SUCCESS,
    payload: {
        docStats
    }
})

const docStatsFailureAction = (error) => ({
    type: DOC_STATS_ERROR,
    payload: error
})

const docListLoadingAction = () => ({
    type: DOC_LIST_LOADING
})

const docListSuccessAction = (docList) => ({
    type: DOC_LIST_SUCCESS,
    payload: {
        docList
    }
})

const docListFailureAction = (error) => ({
    type: DOC_LIST_ERROR,
    payload: error
})

const docDetailLoadingAction = () => ({
    type: DOC_DETAIL_LOADING
})

const docDetailSuccessAction = (docDetails) => ({
    type: DOC_DETAIL_SUCCESS,
    payload: {
        docDetails
    }
})

const docDetailFailureAction = (error) => ({
    type: DOC_DETAIL_ERROR,
    payload: error
})

const appointmentBookingLoadingAction = () => ({
    type: APPOINTMENT_BOOKING_LOADING
})

const appointmentBookingSuccessAction = (appointmentBooking) => ({
    type: APPOINTMENT_BOOKING_SUCCESS,
    payload: {
        appointmentBooking
    }
})

const appointmentBookingFailureAction = (error) => ({
    type: APPOINTMENT_BOOKING_ERROR,
    payload: error
})

const appointmentsListLoadingAction = () => ({
    type: APPOINTMENT_LIST_LOADING
})

const appointmentsListSuccessAction = (appointmentsList) => ({
    type: APPOINTMENT_LIST_SUCCESS,
    payload: {
        appointmentsList
    }
})

const appointmentsListFailureAction = (error) => ({
    type: APPOINTMENT_LIST_ERROR,
    payload: error
})