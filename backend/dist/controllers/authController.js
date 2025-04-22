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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.logIn = exports.signUp = void 0;
const userServices_1 = require("../services/userServices");
const express_validator_1 = require("express-validator");
const helper_1 = require("../util/helper");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const signUp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userName, email, password } = req.body;
    const errors = (0, express_validator_1.validationResult)(req);
    const Err = errors.array();
    try {
        if (Err.length > 0) {
            const error = {
                message: "Invalid details",
                status: 422,
                name: "Incorrect Data"
            };
            throw error;
        }
        const userData = yield (0, userServices_1.getUserByIdOrEmail)(undefined, email);
        if (userData) {
            const error = {
                message: "User already exits",
                status: 409,
                name: "Invalid user"
            };
            throw error;
        }
        const hashedPassword = yield (0, helper_1.hashPass)(password, Number(process.env.SALT));
        const userDetails = {
            username: userName,
            email: email,
            password: hashedPassword
        };
        yield (0, userServices_1.createUser)(userDetails);
        res.status(201).json({ message: "user Created" });
        return;
    }
    catch (err) {
        next(err);
    }
});
exports.signUp = signUp;
const logIn = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const errors = (0, express_validator_1.validationResult)(req);
    const Err = errors.array();
    try {
        if (Err.length > 0) {
            const error = {
                message: "Invalid details",
                status: 422,
                name: "Incorrect Data"
            };
            throw error;
        }
        const userData = yield (0, userServices_1.getUserByIdOrEmail)(undefined, email);
        if (!userData) {
            const error = {
                message: "No user found",
                status: 404,
                name: "Not Found"
            };
            throw error;
        }
        const isValidPass = yield (0, helper_1.comparePass)(password, userData.password);
        if (!isValidPass) {
            const error = {
                message: "wrong password",
                status: 401,
                name: "Incorrect Data"
            };
            throw error;
        }
        const token = (0, helper_1.generateToken)({ id: userData.userid.toString(), role: userData.role });
        res
            .cookie("token", token, {
            maxAge: 60 * 60 * 1000,
            sameSite: "strict",
            httpOnly: true,
            secure: false,
        })
            .status(200)
            .json({ message: "logged in", role: userData.role });
        return;
    }
    catch (err) {
        next(err);
    }
});
exports.logIn = logIn;
const logout = (req, res, next) => {
    try {
        res
            .clearCookie("token", {
            sameSite: "strict",
            httpOnly: true,
            secure: false,
        })
            .status(200)
            .json({ message: "logout success" });
    }
    catch (err) {
        next(err);
    }
};
exports.logout = logout;
