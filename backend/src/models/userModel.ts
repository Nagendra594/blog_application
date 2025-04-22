import { roles } from "../types/role.type"
export interface UserModel {
  userid: string,
  username: string,
  email: string,
  password: string,
  role: roles
}





