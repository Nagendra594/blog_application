"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuth = void 0;
const helper_1 = require("./helper");
const isAuth = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        const error = {
            message: "no token found",
            status: 401,
            name: "no token"
        };
        next(error);
        return;
    }
    let decodedToken = (0, helper_1.verifyToken)(token);
    if (!decodedToken) {
        const error = {
            message: "invalid token",
            status: 401,
            name: "invalid token"
        };
        next(error);
        return;
    }
    req.userId = decodedToken.id;
    next();
};
exports.isAuth = isAuth;
