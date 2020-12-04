import { loginAuthenticationAPI, loginDoctorAuthenticationAPI, signupAuthenticationAPI, 
    checkLoginAPI, logoutUserAPI } from "../services/auth.service";

export const CHECK_LOGIN = "CHECK_LOGIN"
export const USER_LOGGEDIN = "USER_LOGGEDIN"
export const USER_UNAUTHORIZED = "USER_UNAUTHORIZED"

export const LOGIN_USER = "LOGIN_USER"
export const LOGIN_SUCCESSFUL = "LOGIN_SUCCESSFUL"
export const LOGIN_FAILED = "LOGIN_FAILED"

export const LOGOUT_USER = "LOGOUT_USER"

export const loginUser = (credentials) => {
    return async (dispatch) => {
        dispatch(loginLoadingAction())
        let response = await loginAuthenticationAPI(credentials.username, credentials.password);
        if (response.isSuccessful) {
            dispatch(loginSuccessfulAction(response.data))
        }
        else {
            dispatch(loginFailedAction(response.message))
        }
    }
}

export const loginDoctor = (credentials) => {
    return async (dispatch) => {
        dispatch(loginLoadingAction())
        let response = await loginDoctorAuthenticationAPI(credentials.username, credentials.password);
        if (response.isSuccessful) {
            dispatch(loginSuccessfulAction(response.data))
        }
        else {
            dispatch(loginFailedAction(response.message))
        }
    }
}

export const checkLogin = () => {
    return (dispatch) => {
        let loginInfo = checkLoginAPI();
        if (loginInfo.loggedIn) {
            dispatch(userLoggedInAction(loginInfo))
        }
        else {
            dispatch(userUnauthorizedAction)
        }
    }
}

export const logoutUser = () => {
    return (dispatch) => {
        logoutUserAPI();
        dispatch(userUnauthorizedAction())
    }
}

const userLoggedInAction = (loginInfo) => {
    return {
        type: USER_LOGGEDIN,
        payload: {
            loggedIn: true,
            userType: loginInfo.userType,
            email: loginInfo.email,
            displayName: loginInfo.displayName,
            spoolID: loginInfo.spoolID,
            spoolToken: loginInfo.spoolToken
        }
    }
}

const userUnauthorizedAction = () => {
    return {
        type: USER_UNAUTHORIZED,
        payload: {
            loggedIn: false
        }
    }
}

const loginLoadingAction = () => {
    return {
        type: LOGIN_USER
    }
}

function loginSuccessfulAction(responseData) {
    return {
        type: LOGIN_SUCCESSFUL,
        payload: {
            loggedIn: true,
            userType: responseData.userType,
            email: responseData.email,
            displayName: responseData.displayName,
            spoolID: responseData.spoolID,
            spoolToken: responseData.spoolToken
        }
    }
}

function loginFailedAction(errorMessage) {
    return {
        type: LOGIN_FAILED,
        payload: {
            loggedIn: false,
            errorMessage: errorMessage.message
        }
    }
}