import { getUserByIdOrEmail, getAllUsers as fetchAllUsers, deleteUser as deleteAUser } from "../services/userServices";
import { NextFunction, Request, Response } from "express";
import { ModReq } from "../types/customReq.type"
import { UserModel } from "../models/userModel";
import { customError } from "../types/error.type";

export const getById = async (req: ModReq, res: Response, next: NextFunction): Promise<void> => {
  const userId: string = req.userId!;

  try {
    const userData: UserModel | null = await getUserByIdOrEmail(userId);
    if (!userData) {
      const error: customError = {
        message: "User Not Found",
        name: "Not Found",
        status: 404,
      }
      throw error;
    }
    const returnUserData: Partial<UserModel> = {
      userid: userData.userid,
      username: userData.username,
      email: userData.email,
      role: userData.role
    }

    res.status(200).json(returnUserData);
    return;
  } catch (err) {
    next(err)
  }
};

export const getAllUsers = async (req: ModReq, res: Response, next: NextFunction): Promise<void> => {

  try {
    const usersData: Partial<UserModel>[] | null = await fetchAllUsers();
    res.status(200).json(usersData);
    return;
  } catch (err) {
    next(err)
  }
}

export const deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id;
    const userData: UserModel | null = await getUserByIdOrEmail(id, undefined);
    if (!userData) {
      const error: customError = {
        message: "User Not Found",
        name: "Not Found",
        status: 404,
      }
      throw error;
    }
    await deleteAUser(id);
    res.status(200).json({ message: "success" });
  } catch (err) {
    next(err)
  }
}