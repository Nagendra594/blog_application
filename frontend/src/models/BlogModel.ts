import { UserModel } from "./UserModel";
export interface BlogModel extends UserModel {
    blogid: string;
    title: string;
    content: string;
    date: Date;
    image: File | string | null
}