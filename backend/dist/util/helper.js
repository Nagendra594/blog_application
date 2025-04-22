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
exports.verifyToken = exports.generateToken = exports.hashPass = exports.comparePass = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const comparePass = (enteredPassword, dbPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield bcrypt_1.default.compare(enteredPassword, dbPassword);
    return result;
});
exports.comparePass = comparePass;
const hashPass = (password_1, ...args_1) => __awaiter(void 0, [password_1, ...args_1], void 0, function* (password, salt = 12) {
    const hashedPassword = yield bcrypt_1.default.hash(password, salt);
    return hashedPassword;
});
exports.hashPass = hashPass;
const generateToken = (userData) => {
    return jsonwebtoken_1.default.sign(userData, process.env.JWT_KEY, {
        expiresIn: "1h",
    });
};
exports.generateToken = generateToken;
const verifyToken = (token) => {
    return jsonwebtoken_1.default.verify(token, process.env.JWT_KEY);
};
exports.verifyToken = verifyToken;
