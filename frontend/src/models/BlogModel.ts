import { UserModel } from "./UserModel";
export interface BlogModel extends UserModel {
    blogId: string;
    title: string;
    content: string;
    date: Date;
    image:File | string
}