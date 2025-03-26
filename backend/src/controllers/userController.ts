import { getUserByIdOrEmail } from "../services/userServices";
import { NextFunction, Request, Response } from "express";
import { ModReq } from "../models/customReqModel"
import { UserModel } from "../models/userModel";
import { customError } from "../models/errorModel";

export const getByEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email } = req.body;
  try {
    const userData: UserModel | null = await getUserByIdOrEmail(undefined, email);
    if (!userData) {
      const error: customError = {
        message: "User Not Found",
        name: "Not Found",
        status: 404,
      }
      throw error;
    }
    const returnUserData: Partial<UserModel> = {
      userId: userData.userId,
      userName: userData.userName,
      email: email
    }
    res.status(200).json(returnUserData);
    return;
  } catch (err) {
    next(err);
  }
};

export const getById = async (req: ModReq, res: Response, next: NextFunction): Promise<void> => {
  const userId: string = req.userId!;
  try {
    const userData: UserModel | null = await getUserByIdOrEmail(Number(userId));
    if (!userData) {
      const error: customError = {
        message: "User Not Found",
        name: "Not Found",
        status: 404,
      }
      throw error;
    }
    const returnUserData: Partial<UserModel> = {
      userId: userData.userId,
      userName: userData.userName,
    }

    res.status(200).json(returnUserData);
    return;
  } catch (err) {
    next(err)
  }
};
