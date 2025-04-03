import { APIResponseModel } from "../models/APIResponseModel";
import { AuthModel } from "../models/AuthModel";



const API_BASE_URL = process.env.API_URL
export const login = async (credentials: AuthModel): Promise<APIResponseModel<null>> => {
    const response = await fetch(`${API_BASE_URL}auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
        }),
    });
    let ApiRes: APIResponseModel<null>;
    if (!response.ok) {
        ApiRes = {
            status: response.status,

        }
        return ApiRes;
    }
    ApiRes = {
        status: response.status,
    }
    return ApiRes;
}

export const register = async (credentials: AuthModel): Promise<APIResponseModel<null>> => {
    const response = await fetch(`${API_BASE_URL}auth/register`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            userName: credentials.userName,
            email: credentials.email,
            password: credentials.password,
        }),
    });
    let ApiRes: APIResponseModel<null>;
    if (!response.ok) {
        ApiRes = {
            status: response.status,

        }
        return ApiRes;
    }
    ApiRes = {
        status: response.status,
    }
    return ApiRes;
}

export const logout = async (): Promise<APIResponseModel<null>> => {
    const response = await fetch(`${API_BASE_URL}auth/logout`, {
        method: "POST",
        credentials: "include",
    });
    let ApiRes: APIResponseModel<null>;
    if (!response.ok) {
        ApiRes = {
            status: response.status,
        }
        return ApiRes;
    }
    ApiRes = {
        status: response.status,
    }
    return ApiRes;
}