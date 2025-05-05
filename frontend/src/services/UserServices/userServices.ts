import { APIResponseModel } from "../../types/APIResponseModel";
import { UserModel } from "../../models/UserModel";

const API_BASE_URL = process.env.API_URL

export const getUser = async (): Promise<APIResponseModel<UserModel>> => {
  let ApiRes: APIResponseModel<UserModel>;
  try {

    const response = await fetch(`${API_BASE_URL}user`, {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) {
      ApiRes = {
        status: response.status,

      }
      return ApiRes;
    }
    const User: UserModel = await response.json();

    ApiRes = {
      data: User,
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


export const getAllUsers = async () => {
  let ApiRes: APIResponseModel<UserModel[]>;
  try {


    const response = await fetch(`${API_BASE_URL}user/allUsers`, {
      method: "GET",
      credentials: "include"
    })
    if (!response.ok) {
      return ApiRes = {
        status: response.status
      }
    }
    const Users: UserModel[] = await response.json();
    return ApiRes = {
      data: Users,
      status: response.status
    }

  } catch (err) {
    ApiRes = {
      status: 500,
    }
    return ApiRes;

  }
}
export const deleteAUser = async (id: string): Promise<APIResponseModel<null>> => {
  let ApiRes: APIResponseModel<null>;
  try {


    const response = await fetch(`${API_BASE_URL}user/${id}`, {
      method: "DELETE",
      credentials: "include"
    });

    return ApiRes = {
      status: response.status,
    }
  } catch (err) {
    ApiRes = {
      status: 500,
    }
    return ApiRes;

  }

}