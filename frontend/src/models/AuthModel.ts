import { UserModel } from "./UserModel";


export interface AuthModel extends Partial<UserModel> {
    password: string;
    email: string;
}

