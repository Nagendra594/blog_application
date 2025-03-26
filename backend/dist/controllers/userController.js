"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getById = exports.getByEmail = void 0;
const userServices_1 = require("../services/userServices");
const getByEmail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        const userData = yield (0, userServices_1.getUserByIdOrEmail)(undefined, email);
        if (!userData) {
            const error = {
                message: "User Not Found",
                name: "Not Found",
                status: 404,
            };
            throw error;
        }
        const returnUserData = {
            userId: userData.userId,
            userName: userData.userName,
            email: email
        };
        res.status(200).json(returnUserData);
        return;
    }
    catch (err) {
        next(err);
    }
});
exports.getByEmail = getByEmail;
const getById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    try {
        const userData = yield (0, userServices_1.getUserByIdOrEmail)(Number(userId));
        if (!userData) {
            const error = {
                message: "User Not Found",
                name: "Not Found",
                status: 404,
            };
            throw error;
        }
        const returnUserData = {
            userId: userData.userId,
            userName: userData.userName,
        };
        res.status(200).json(returnUserData);
        return;
    }
    catch (err) {
        next(err);
    }
});
exports.getById = getById;
