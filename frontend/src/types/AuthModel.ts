import { UserModel } from "../models/UserModel";


export interface AuthModel extends Partial<UserModel> {
    password: string;
    email: string;
}

