import { APIResponseModel } from "../../types/APIResponseModel";
import { AuthModel } from "../../types/AuthModel";
import { Role } from "../../types/Role.type";


const API_BASE_URL = process.env.API_URL
export const login = async (credentials: AuthModel): Promise<APIResponseModel<Role>> => {
    let ApiRes: APIResponseModel<Role>;
    try {

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

        if (!response.ok) {
            ApiRes = {
                status: response.status,
            }
            return ApiRes;
        }
        const data = await response.json();
        ApiRes = {
            status: response.status,
            data: data.role
        }
        return ApiRes;
    } catch (err) {
        ApiRes = {
            status: 500,
        }
        return ApiRes;

    }
}

export const register = async (credentials: AuthModel): Promise<APIResponseModel<null>> => {
    let ApiRes: APIResponseModel<null>;
    try {

        const response = await fetch(`${API_BASE_URL}auth/register`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userName: credentials.username,
                email: credentials.email,
                password: credentials.password,
            }),
        });
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
    } catch (err) {
        ApiRes = {
            status: 500,
        }
        return ApiRes;
    }
}

export const logout = async (): Promise<APIResponseModel<null>> => {
    let ApiRes: APIResponseModel<null>;
    try {


        const response = await fetch(`${API_BASE_URL}auth/logout`, {
            method: "POST",
            credentials: "include",
        });
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
    } catch (err) {
        ApiRes = {
            status: 500,
        }
        return ApiRes;
    }
}