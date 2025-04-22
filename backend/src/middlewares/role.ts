import { NextFunction, Response } from "express";
import { roles } from "../types/role.type";
import { ModReq } from "../types/customReq.type";
import { customError } from "../types/error.type";


export const checkRole = (roles: roles[]) => {
    return (req: ModReq, res: Response, next: NextFunction) => {
        try {
            const currRole = req.role as unknown as roles;
            if (!currRole || !roles.includes(currRole)) {
                const error: customError = {
                    message: "Not Authorized",
                    status: 403,
                    name: "Forbidden"
                }
                throw error;
            }
            next();
        } catch (err) {
            next(err);
        }


    }
}