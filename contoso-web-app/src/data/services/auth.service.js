import axios from "axios";
import { decode } from "jsonwebtoken";
import { constants } from "../../config";
import { api, success, error } from "./services.common";

export const checkLoginAPI = () => {
  let token = localStorage.getItem(constants.KEY_AUTH_TOKEN)
  if (token === undefined || token === null) {
    return {
      loggedIn: false
    };
  }
  else {
    // check if token is expired
    let jsonToken = decode(token)
    if (jsonToken.exp < (new Date().getTime() + 1) / 1000) {
      return {
        loggedIn: false
      };
    }
    else {
      return {
        loggedIn: true,
        userType: localStorage.getItem(constants.KEY_USER_TYPE),
        email: localStorage.getItem(constants.KEY_USER_NAME),
        displayName: localStorage.getItem(constants.KEY_DISPLAY_NAME),
        spoolID: localStorage.getItem(constants.KEY_SPOOL_ID),
        spoolToken: localStorage.getItem(constants.KEY_SPOOL_TOKEN)
      };
    }
  }
}

export const loginAuthenticationAPI = async (email, password) => {
  try {
    let response = await axios.post(`${api}/auth/login`, { email, password });
    const credentials = response.data;

    // save token
    localStorage.setItem(constants.KEY_AUTH_TOKEN, credentials.token);
    localStorage.setItem(constants.KEY_USER_TYPE, credentials.userType);
    localStorage.setItem(constants.KEY_USER_NAME, email);
    localStorage.setItem(constants.KEY_DISPLAY_NAME, credentials.name);
    localStorage.setItem(constants.KEY_SPOOL_ID, credentials.spoolID);
    localStorage.setItem(constants.KEY_SPOOL_TOKEN, credentials.spoolToken);

    credentials.email = email;
    credentials.displayName = credentials.name;

    return success(credentials);
  }
  catch (e) {
    console.log(e);
    return error(e);
  }
};

export const loginDoctorAuthenticationAPI = async (email, password) => {
  try {
    let response = await axios.post(`${api}/auth/doctorLogin`, { email, password });
    const credentials = response.data;

    // save token
    localStorage.setItem(constants.KEY_AUTH_TOKEN, credentials.token);
    localStorage.setItem(constants.KEY_USER_TYPE, credentials.userType);
    localStorage.setItem(constants.KEY_USER_NAME, email);
    localStorage.setItem(constants.KEY_DISPLAY_NAME, credentials.name);
    localStorage.setItem(constants.KEY_SPOOL_ID, credentials.spoolID);
    localStorage.setItem(constants.KEY_SPOOL_TOKEN, credentials.spoolToken);

    credentials.email = email;
    credentials.displayName = credentials.name;

    return success(credentials);
  }
  catch (e) {
    console.log(e);
    return error(e);
  }
}

export const logoutUserAPI = () => {
  localStorage.clear();
  return true;
}