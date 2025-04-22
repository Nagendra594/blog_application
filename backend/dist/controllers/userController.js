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
exports.deleteUser = exports.getAllUsers = exports.getById = void 0;
const userServices_1 = require("../services/userServices");
const getById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    try {
        const userData = yield (0, userServices_1.getUserByIdOrEmail)(userId);
        if (!userData) {
            const error = {
                message: "User Not Found",
                name: "Not Found",
                status: 404,
            };
            throw error;
        }
        const returnUserData = {
            userid: userData.userid,
            username: userData.username,
            email: userData.email,
            role: userData.role
        };
        res.status(200).json(returnUserData);
        return;
    }
    catch (err) {
        next(err);
    }
});
exports.getById = getById;
const getAllUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const usersData = yield (0, userServices_1.getAllUsers)();
        res.status(200).json(usersData);
        return;
    }
    catch (err) {
        next(err);
    }
});
exports.getAllUsers = getAllUsers;
const deleteUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const userData = yield (0, userServices_1.getUserByIdOrEmail)(id, undefined);
        if (!userData) {
            const error = {
                message: "User Not Found",
                name: "Not Found",
                status: 404,
            };
            throw error;
        }
        yield (0, userServices_1.deleteUser)(id);
        res.status(200).json({ message: "success" });
    }
    catch (err) {
        next(err);
    }
});
exports.deleteUser = deleteUser;
