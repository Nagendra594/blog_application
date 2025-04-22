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
exports.getAllUsers = exports.deleteUser = exports.getUserByIdOrEmail = exports.createUser = void 0;
const dbConfig_1 = __importDefault(require("../config/dbConfig"));
const createUser = (credentials) => __awaiter(void 0, void 0, void 0, function* () {
    const sq = "INSERT INTO users (username,email,password) VALUES ($1,$2,$3)";
    const values = [
        credentials.username,
        credentials.email,
        credentials.password,
    ];
    yield dbConfig_1.default.query(sq, values);
    return;
});
exports.createUser = createUser;
const getUserByIdOrEmail = (id, email) => __awaiter(void 0, void 0, void 0, function* () {
    let sq = "SELECT userid,username,email,role FROM users WHERE userid=$1";
    let values;
    if (email) {
        sq = "SELECT userid,username,email,password,role FROM users WHERE email=$1";
        values = [email];
    }
    else {
        values = [id];
    }
    const { rows } = yield dbConfig_1.default.query(sq, values);
    if (rows.length === 0) {
        return null;
    }
    return rows[0];
});
exports.getUserByIdOrEmail = getUserByIdOrEmail;
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const sq = "DELETE FROM users WHERE userid=$1";
    const values = [id];
    yield dbConfig_1.default.query(sq, values);
    return;
});
exports.deleteUser = deleteUser;
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const sq = "SELECT userid,username,email FROM users WHERE role=$1";
    const values = ["user"];
    const { rows } = yield dbConfig_1.default.query(sq, values);
    return rows;
});
exports.getAllUsers = getAllUsers;
