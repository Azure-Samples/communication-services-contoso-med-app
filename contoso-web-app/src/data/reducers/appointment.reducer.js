import { DOC_LIST_LOADING, DOC_LIST_SUCCESS, DOC_LIST_ERROR, 
    DOC_STATS_LOADING, DOC_STATS_SUCCESS, DOC_STATS_ERROR,
    DOC_DETAIL_LOADING, DOC_DETAIL_SUCCESS, DOC_DETAIL_ERROR,
    APPOINTMENT_BOOKING_LOADING, APPOINTMENT_BOOKING_SUCCESS, APPOINTMENT_BOOKING_ERROR,
    APPOINTMENT_LIST_LOADING, APPOINTMENT_LIST_SUCCESS, APPOINTMENT_LIST_ERROR }
from '../actions/appointment.actions'

// initial appointment state
const initialState = {
    lastVisitedDoctors: [
        {
            "_id": "5f5116bfac79513cfc99e3c8",
            "id": "9",
            "name": "Cora Thomas",
            "email": "doctor009@contosomed.com",
            "password": "009",
            "location": "Los Angeles",
            "speciality": "Dentist",
            "degree": "MD",
            "pictureUrl": "cora-thomas.jpg",
            "experience": 12,
            "reviews": [
                {
                    "rating": 5,
                    "username": "John Doe",
                    "feedbackText": ""
                }
            ],
            "slots": [
            ],
            "availableMediums": [
                "chat",
                "videoCall",
                "voice"
            ]
        },
        {
            "_id": "5f5116bfac79513cfc99e3c1",
            "id": "2",
            "name": "Fei Xiong",
            "email": "doctor002@contosomed.com",
            "password": "002",
            "location": "Los Angeles",
            "speciality": "Cardiologist",
            "degree": "MD",
            "pictureUrl": "fei-xiong.png",
            "experience": 11,
            "reviews": [
                {
                    "rating": 5,
                    "username": "John Doe",
                    "feedbackText": ""
                }
            ],
            "slots": [
            ],
            "availableMediums": [
                "chat",
                "videoCall",
                "voice"
            ]
        },
        {
            "_id": "5f5116bfac79513cfc99e3cb",
            "id": "12",
            "name": "Victoria Burke",
            "email": "doctor012@contosomed.com",
            "password": "012",
            "location": "Los Angeles",
            "speciality": "Cardiologist",
            "degree": "MD",
            "pictureUrl": "victoria-burke.png",
            "experience": 25,
            "reviews": [
                {
                    "rating": 5,
                    "username": "John Doe",
                    "feedbackText": ""
                }
            ],
            "slots": [
            ],
            "availableMediums": [
                "chat",
                "videoCall",
                "voice"
            ]
        },
        {
            "_id": "5f5116bfac79513cfc99e3d3",
            "id": "20",
            "name": "Chandrika Gupta",
            "email": "doctor020@contosomed.com",
            "password": "020",
            "location": "Los Angeles",
            "speciality": "Orthologist",
            "degree": "MD",
            "pictureUrl": "chandrika-gupta.png",
            "experience": 11,
            "reviews": [
                {
                    "rating": 5,
                    "username": "John Doe",
                    "feedbackText": ""
                }
            ],
            "slots": [
            ],
            "availableMediums": [
                "chat",
                "videoCall",
                "voice"
            ]
        },
        {
            "_id": "5f5116bfac79513cfc99e3d4",
            "id": "21",
            "name": "Aaron Gonzales",
            "email": "doctor021@contosomed.com",
            "password": "021",
            "location": "Los Angeles",
            "speciality": "General Physician",
            "degree": "MD",
            "pictureUrl": "aaron-gonzales.jpg",
            "experience": 21,
            "reviews": [
                {
                    "rating": 5,
                    "username": "John Doe",
                    "feedbackText": ""
                }
            ],
            "slots": [
            ],
            "availableMediums": [
                "chat",
                "videoCall",
                "voice"
            ]
        }
    ]
}

export default function appointment(state = initialState, action) {
    switch(action.type) {
        case DOC_STATS_LOADING:
            return { ...state, docStatsLoading: true}
        case DOC_STATS_SUCCESS:
            return { ...state, ...action.payload, docStatsLoading: false}
        case DOC_STATS_ERROR:
            return { ...state, ...action.payload, docStatsLoading: false}
        case DOC_LIST_LOADING:
            return { ...state, docsListLoading: true}
        case DOC_LIST_SUCCESS:
            return { ...state, ...action.payload, docsListLoading: false}
        case DOC_LIST_ERROR:
            return { ...state, ...action.payload, docsListLoading: false}
        case DOC_DETAIL_LOADING:
            return { ...state, docDetailsLoading: true}
        case DOC_DETAIL_SUCCESS:
            return { ...state, ...action.payload, docDetailsLoading: false}
        case DOC_DETAIL_ERROR:
            return { ...state, ...action.payload, docDetailsLoading: false}
        case APPOINTMENT_BOOKING_LOADING:
            return { ...state, bookingInProgress: true}
        case APPOINTMENT_BOOKING_SUCCESS:
            return { ...state, ...action.payload, bookingInProgress: false, bookingSuccess: true}
        case APPOINTMENT_BOOKING_ERROR:
            return { ...state, ...action.payload, bookingInProgress: false, bookingSuccess: false}
        case APPOINTMENT_LIST_LOADING:
            return { ...state, appointmentListLoading: true}
        case APPOINTMENT_LIST_SUCCESS:
            return { ...state, ...action.payload, appointmentListLoading: false}
        case APPOINTMENT_LIST_ERROR:
            return { ...state, ...action.payload, appointmentListLoading: false}
        default:
            return state;
    }
}