import { Response, NextFunction } from "express";

import { ModReq } from "../models/customReqModel";
import { customError } from "../models/errorModel";
import { verifyToken } from "./helper";


export const isAuth = (req: ModReq, res: Response, next: NextFunction): void => {

  const token: string = req.cookies.token;
  if (!token) {
    const error: customError = {
      message: "no token found",
      status: 401,
      name: "no token"
    }
    next(error);
    return;
  }
  let decodedToken= verifyToken(token);
  if (!decodedToken) {
    const error: customError = {
      message: "invalid token",
      status: 401,
      name: "invalid token"
    }
    next(error);
    return;
  }
  req.userId = decodedToken.id;
  next();
};
