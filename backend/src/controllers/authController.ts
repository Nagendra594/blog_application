import { createUser, getUserByIdOrEmail } from "../services/userServices";
import { Request, Response, NextFunction } from "express";
import { UserModel } from "../models/userModel";
import { customError } from "../models/errorModel";
import { validationResult } from "express-validator";
import { comparePass, hashPass, generateToken } from "../util/helper";
import dotenv from "dotenv";
dotenv.config();

export const signUp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { userName, email, password } = req.body;

  const errors = validationResult(req);

  const Err = errors.array();
  try {
    if (Err.length > 0) {
      const error: customError = {
        message: "Invalid details",
        status: 422,
        name: "Incorrect Data"
      }
      throw error;
    }
    const userData: UserModel | null = await getUserByIdOrEmail(undefined, email);
    if (userData) {
      const error: customError = {
        message: "User already exits",
        status: 409,
        name: "Invalid user"
      }
      throw error;
    }
    const hashedPassword: string = await hashPass(password, Number(process.env.SALT));
    const userDetails: Partial<UserModel> = {
      userName: userName,
      email: email,
      password: hashedPassword
    }
    await createUser(userDetails);
    res.status(201).json({ message: "user Created" });
    return;
  } catch (err) {
    next(err);
  }
};



export const logIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email, password } = req.body;
  const errors = validationResult(req);
  const Err = errors.array();
  try {
    if (Err.length > 0) {
      const error: customError = {
        message: "Invalid details",
        status: 422,
        name: "Incorrect Data"
      }
      throw error;
    }


    const userData: UserModel | null = await getUserByIdOrEmail(undefined, email);
    if (!userData) {
      const error: customError = {
        message: "No user found",
        status: 404,
        name: "Not Found"
      }
      throw error;
    }

    const isValidPass: boolean = await comparePass(password, userData.password);
    if (!isValidPass) {
      const error: customError = {
        message: "wrong password",
        status: 401,
        name: "Incorrect Data"
      }
      throw error;
    }
    const token: string = generateToken({ id: userData.userId.toString() });
    res
      .cookie("token", token, {
        maxAge: 60 * 60 * 1000,
        sameSite: "strict",
        httpOnly: true,
        secure: false,
      })
      .status(200)
      .json({ message: "logged in" });
    return;
  } catch (err) {
    next(err);
  }
};


export const logout = (req: Request, res: Response, next: NextFunction): void => {
  try {

    res
      .clearCookie("token", {
        sameSite: "strict",
        httpOnly: true,
        secure: false,
      })
      .status(200)
      .json({ message: "logout success" });
  } catch (err) {

    next(err);
  }
};
