import { UserModel } from "./userModel"
export interface BlogModel extends Partial<UserModel> {
  blogId: number,
  title: string,
  content: string,
  date: Date,
  image:string
}

