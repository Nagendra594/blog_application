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
exports.getUserByIdOrEmail = exports.createUser = void 0;
const dbConfig_1 = __importDefault(require("../config/dbConfig"));
const createUser = (credentials) => __awaiter(void 0, void 0, void 0, function* () {
    const sq = "INSERT INTO users (username,email,password) VALUES (?,?,?)";
    const values = [
        credentials.userName,
        credentials.email,
        credentials.password,
    ];
    yield dbConfig_1.default.execute(sq, values);
    return;
});
exports.createUser = createUser;
const getUserByIdOrEmail = (id, email) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let sq = "SELECT id,userName,email FROM users WHERE id=?";
    let values;
    if (email) {
        sq = "SELECT id,userName,email,password FROM users WHERE email=?";
        values = [email];
    }
    else {
        values = [id];
    }
    const [rows] = yield dbConfig_1.default.execute(sq, values);
    if (rows.length === 0) {
        return null;
    }
    const user = {
        userId: rows[0].id,
        userName: rows[0].userName,
        email: rows[0].email,
        password: (_a = rows[0]) === null || _a === void 0 ? void 0 : _a.password,
    };
    return user;
});
exports.getUserByIdOrEmail = getUserByIdOrEmail;
