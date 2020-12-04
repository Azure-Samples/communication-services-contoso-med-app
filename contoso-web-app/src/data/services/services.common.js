import { constants } from "../../config.js";

export const api = constants.endpoint
export const error = (error) => { return { status: "error", isSuccessful: false, message: error }}
export const success = (data) => { return { status: "success", isSuccessful: true, data: data }}