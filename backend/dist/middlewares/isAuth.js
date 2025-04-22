"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuth = void 0;
const helper_1 = require("../util/helper");
const isAuth = (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            const error = {
                message: "no token found",
                status: 401,
                name: "no token"
            };
            throw error;
        }
        let decodedToken = (0, helper_1.verifyToken)(token);
        if (!decodedToken) {
            const error = {
                message: "invalid token",
                status: 401,
                name: "invalid token"
            };
            throw error;
        }
        req.userId = decodedToken.id;
        req.role = decodedToken.role;
        next();
    }
    catch (err) {
        if (err.status === undefined) {
            const error = {
                message: "invalid token",
                status: 401,
                name: "invalid token"
            };
            next(error);
            return;
        }
        next(err);
    }
};
exports.isAuth = isAuth;
