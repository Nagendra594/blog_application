import { UserModel } from "./userModel"
export interface BlogModel extends Partial<UserModel> {
  blogid: string,
  title: string,
  content: string,
  date: Date,
  image: string
}

