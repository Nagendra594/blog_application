import { Response, NextFunction } from "express";

import { ModReq } from "../types/customReq.type";
import { customError } from "../types/error.type";
import { verifyToken } from "../util/helper";


export const isAuth = (req: ModReq, res: Response, next: NextFunction): void => {
  try {
    const token: string = req.cookies.token;

    if (!token) {
      const error: customError = {
        message: "no token found",
        status: 401,
        name: "no token"
      }
      throw error;
    }
    let decodedToken = verifyToken(token);
    if (!decodedToken) {
      const error: customError = {
        message: "invalid token",
        status: 401,
        name: "invalid token"
      }
      throw error;

    }
    req.userId = decodedToken.id;
    req.role = decodedToken.role;
    next();
  } catch (err) {
    if ((err as any).status === undefined) {
      const error: customError = {
        message: "invalid token",
        status: 401,
        name: "invalid token"
      }
      next(error);
      return;
    }
    next(err);

  }




};
