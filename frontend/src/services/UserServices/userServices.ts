import { APIResponseModel } from "../../types/APIResponseModel";
import { UserModel } from "../../models/UserModel";

const API_BASE_URL = process.env.API_URL

export const getUser = async (): Promise<APIResponseModel<UserModel>> => {
  const response = await fetch(`${API_BASE_URL}user`, {
    method: "GET",
    credentials: "include",
  });
  let ApiRes: APIResponseModel<UserModel>;
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
}


export const getAllUsers = async () => {
  const response = await fetch(`${API_BASE_URL}user/allUsers`, {
    method: "GET",
    credentials: "include"
  })
  let ApiRes: APIResponseModel<UserModel[]>;
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
}
export const deleteAUser = async (id: string): Promise<APIResponseModel<null>> => {
  const response = await fetch(`${API_BASE_URL}user/${id}`, {
    method: "PATCH",
    credentials: "include"
  });
  let ApiRes: APIResponseModel<null>;

  return ApiRes = {
    status: response.status,
  }

}