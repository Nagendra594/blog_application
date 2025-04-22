import { Role } from "../types/Role.type"

export interface UserModel {
    userid: string,
    username: string,
    email?: string
    role: Role | null
}