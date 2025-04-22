"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const userService = __importStar(require("../../services/userServices"));
const dbConfig_1 = __importDefault(require("../../config/dbConfig"));
jest.mock("../../config/dbConfig", () => ({
    query: jest.fn()
}));
const mockedQuery = dbConfig_1.default.query;
describe("userService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe("createUser", () => {
        it("should call db.query with correct SQL and values", () => __awaiter(void 0, void 0, void 0, function* () {
            const credentials = {
                username: "testUser",
                email: "test@example.com",
                password: "hashedPassword"
            };
            yield userService.createUser(credentials);
            expect(mockedQuery).toHaveBeenCalledWith("INSERT INTO users (username,email,password) VALUES ($1,$2,$3)", [credentials.username, credentials.email, credentials.password]);
        }));
    });
    describe("getUserByIdOrEmail", () => {
        it("should query by email if email is provided", () => __awaiter(void 0, void 0, void 0, function* () {
            const email = "test@example.com";
            const fakeUser = {
                userid: "1",
                username: "testUser",
                email,
                password: "hashedPassword",
                role: "user"
            };
            mockedQuery.mockResolvedValueOnce({ rows: [fakeUser] });
            const result = yield userService.getUserByIdOrEmail(undefined, email);
            expect(mockedQuery).toHaveBeenCalledWith("SELECT userid,username,email,password,role FROM users WHERE email=$1", [email]);
            expect(result).toEqual(fakeUser);
        }));
        it("should query by id if email is not provided", () => __awaiter(void 0, void 0, void 0, function* () {
            const id = "123";
            const fakeUser = {
                userid: id,
                username: "testUser",
                email: "test@example.com",
                role: "user"
            };
            mockedQuery.mockResolvedValueOnce({ rows: [fakeUser] });
            const result = yield userService.getUserByIdOrEmail(id);
            expect(mockedQuery).toHaveBeenCalledWith("SELECT userid,username,email,role FROM users WHERE userid=$1", [id]);
            expect(result).toEqual(fakeUser);
        }));
        it("should return null if no user found", () => __awaiter(void 0, void 0, void 0, function* () {
            mockedQuery.mockResolvedValueOnce({ rows: [] });
            const result = yield userService.getUserByIdOrEmail("123");
            expect(result).toBeNull();
        }));
    });
    describe("deleteUser", () => {
        it("should call db.query with correct SQL and values", () => __awaiter(void 0, void 0, void 0, function* () {
            const id = "123";
            yield userService.deleteUser(id);
            expect(mockedQuery).toHaveBeenCalledWith("DELETE FROM users WHERE userid=$1", [id]);
        }));
    });
    describe("getAllUsers", () => {
        it("should return all users with role 'user'", () => __awaiter(void 0, void 0, void 0, function* () {
            const users = [
                { userid: "1", username: "A", email: "a@mail.com" },
                { userid: "2", username: "B", email: "b@mail.com" }
            ];
            mockedQuery.mockResolvedValueOnce({ rows: users });
            const result = yield userService.getAllUsers();
            expect(mockedQuery).toHaveBeenCalledWith("SELECT userid,username,email FROM users WHERE role=$1", ["user"]);
            expect(result).toEqual(users);
        }));
    });
});
