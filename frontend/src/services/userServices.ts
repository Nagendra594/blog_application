import { APIResponseModel } from "../models/APIResponseModel";
import { UserModel } from "../models/UserModel";

const API_BASE_URL = "http://localhost:8080/api/"

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