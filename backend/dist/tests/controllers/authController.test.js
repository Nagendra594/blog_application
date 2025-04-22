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
const supertest_1 = __importDefault(require("supertest"));
const index_1 = require("../../index");
const userServices = __importStar(require("../../services/userServices"));
const helper_1 = require("../../util/helper");
const role_type_1 = require("../../types/role.type");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
jest.mock("../../services/userServices");
jest.mock("../../util/helper", () => {
    const actuals = jest.requireActual("../../util/helper");
    return Object.assign(Object.assign({}, actuals), { hashPass: jest.fn(), comparePass: jest.fn() });
});
const mockGetUserByIdOrEmail = userServices.getUserByIdOrEmail;
const mockCreateUser = userServices.createUser;
const mockHashPass = helper_1.hashPass;
const mockComparePass = helper_1.comparePass;
describe("Auth Controller", () => {
    describe("POST /api/auth/regiser", () => {
        afterAll(() => {
            jest.clearAllMocks();
        });
        it("should return 422 for invalid details", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(index_1.app).post("/api/auth/register").field("userName", "st").field("email", "invalid").field("password", "short");
            expect(response.status).toBe(422);
            expect(mockGetUserByIdOrEmail).not.toHaveBeenCalled();
            expect(mockHashPass).not.toHaveBeenCalled();
            expect(mockCreateUser).not.toHaveBeenCalled();
        }));
        it("should return 409 for already exits user", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockedUserData = {
                userid: "123",
                username: "test",
                email: "valid@gmail.com",
                password: "validPassword",
                role: role_type_1.roles.user
            };
            mockGetUserByIdOrEmail.mockResolvedValue(mockedUserData);
            const response = yield (0, supertest_1.default)(index_1.app).post("/api/auth/register").field("userName", "valid").field("email", "valid@gmail.com").field("password", "validPassword");
            expect(response.status).toBe(409);
            expect(mockGetUserByIdOrEmail).toHaveBeenCalledTimes(1);
            expect(mockGetUserByIdOrEmail).toHaveBeenCalledWith(undefined, "valid@gmail.com");
            expect(mockHashPass).not.toHaveBeenCalled();
            expect(mockCreateUser).not.toHaveBeenCalled();
        }));
        it("should register a user with valid data", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockedUserData = null;
            mockGetUserByIdOrEmail.mockResolvedValue(mockedUserData);
            mockHashPass.mockReturnValue("someHasedPassword");
            const response = yield (0, supertest_1.default)(index_1.app).post("/api/auth/register").field("userName", "valid").field("email", "valid@gmail.com").field("password", "validPassword");
            expect(response.status).toBe(201);
            expect(mockGetUserByIdOrEmail).toHaveBeenCalledTimes(2);
            expect(mockGetUserByIdOrEmail).toHaveBeenCalledWith(undefined, "valid@gmail.com");
            expect(mockHashPass).toHaveBeenCalled();
            expect(mockHashPass).toHaveBeenCalledWith("validPassword", Number(process.env.SALT));
            expect(mockCreateUser).toHaveBeenCalled();
            expect(mockCreateUser).toHaveBeenCalledWith({ username: "valid", email: "valid@gmail.com", password: "someHasedPassword" });
        }));
    });
    describe("POST /api/auth/login", () => {
        it("should return 422 for invalid details", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(index_1.app).post("/api/auth/login").field("email", "invalid").field("password", "short");
            expect(response.status).toBe(422);
            expect(mockGetUserByIdOrEmail).not.toHaveBeenCalled();
            expect(mockComparePass).not.toHaveBeenCalled();
        }));
        it("should return 404 if user does not exists", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockedUserData = null;
            mockGetUserByIdOrEmail.mockResolvedValue(mockedUserData);
            const response = yield (0, supertest_1.default)(index_1.app).post("/api/auth/login").field("email", "valid@gmail.com").field("password", "validPassword");
            expect(response.status).toBe(404);
            expect(mockGetUserByIdOrEmail).toHaveBeenCalledTimes(1);
            expect(mockGetUserByIdOrEmail).toHaveBeenCalledWith(undefined, "valid@gmail.com");
            expect(mockComparePass).not.toHaveBeenCalled();
        }));
        it("should return 401 if user enter wrong password", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockedUserData = {
                userid: "123",
                username: "test",
                email: "valid@gmail.com",
                password: "validPassword",
                role: role_type_1.roles.user
            };
            mockGetUserByIdOrEmail.mockResolvedValue(mockedUserData);
            mockComparePass.mockReturnValue(false);
            const response = yield (0, supertest_1.default)(index_1.app).post("/api/auth/login").field("email", "valid@gmail.com").field("password", "wrongPassword");
            expect(response.status).toBe(401);
            expect(mockGetUserByIdOrEmail).toHaveBeenCalledTimes(2);
            expect(mockGetUserByIdOrEmail).toHaveBeenCalledWith(undefined, "valid@gmail.com");
            expect(mockComparePass).toHaveBeenCalled();
            expect(mockComparePass).toHaveBeenCalledWith("wrongPassword", mockedUserData.password);
        }));
        it("should return 200 and generate token if user enter correct password", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockedUserData = {
                userid: "123",
                username: "test",
                email: "valid@gmail.com",
                password: "validPassword",
                role: role_type_1.roles.user
            };
            mockGetUserByIdOrEmail.mockResolvedValue(mockedUserData);
            mockComparePass.mockReturnValue(true);
            const response = yield (0, supertest_1.default)(index_1.app).post("/api/auth/login").field("email", "valid@gmail.com").field("password", "validPassword");
            expect(response.status).toBe(200);
            expect(mockGetUserByIdOrEmail).toHaveBeenCalledTimes(3);
            expect(mockGetUserByIdOrEmail).toHaveBeenCalledWith(undefined, "valid@gmail.com");
            expect(mockComparePass).toHaveBeenCalled();
            expect(mockComparePass).toHaveBeenCalledWith("validPassword", mockedUserData.password);
        }));
    });
    describe("POST /api/auth/logout", () => {
        it("should return 401 if user doest not logged in", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(index_1.app).post("/api/auth/logout");
            expect(response.status).toBe(401);
        }));
        it("should clear cookies if user logged in", () => __awaiter(void 0, void 0, void 0, function* () {
            const token = (0, helper_1.generateToken)({ id: "123", role: role_type_1.roles.user });
            const response = yield (0, supertest_1.default)(index_1.app).post("/api/auth/logout").set("Cookie", `token=${token}`);
            expect(response.status).toBe(200);
        }));
    });
});
