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
const role_type_1 = require("../../types/role.type");
const userServices = __importStar(require("../../services/userServices"));
jest.mock("../../services/userServices");
const index_1 = require("../../index");
const helper_1 = require("../../util/helper");
describe("User Controller", () => {
    describe("GET /api/user", () => {
        afterAll(() => {
            jest.clearAllMocks();
        });
        it("should return 401 if user doest not logged in", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(index_1.app).get("/api/user");
            expect(res.status).toBe(401);
            expect(userServices.getUserByIdOrEmail).not.toHaveBeenCalled();
        }));
        it("get a user with invalid token", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(index_1.app).get("/api/user").set("Cookie", "token=invalidHeader.invalidData.invalidSignature");
            expect(res.status).toBe(401);
            expect(userServices.getUserByIdOrEmail).not.toHaveBeenCalled();
        }));
        it("handling when no user found", () => __awaiter(void 0, void 0, void 0, function* () {
            const token = (0, helper_1.generateToken)({ id: "123", role: role_type_1.roles.user });
            userServices.getUserByIdOrEmail.mockResolvedValue(null);
            const res = yield (0, supertest_1.default)(index_1.app).get("/api/user").set("Cookie", `token=${token}`);
            expect(res.status).toBe(404);
            expect(userServices.getUserByIdOrEmail).toHaveBeenCalled();
        }));
        it("get a user with Valid token", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockUser = {
                userid: "123",
                username: "testuser1",
                email: "test@gmail.com",
                role: role_type_1.roles.user
            };
            userServices.getUserByIdOrEmail.mockResolvedValue(mockUser);
            const token = (0, helper_1.generateToken)({ id: "123", role: role_type_1.roles.user });
            const res = yield (0, supertest_1.default)(index_1.app).get("/api/user").set("Cookie", `token=${token}`);
            expect(res.status).toBe(200);
            expect(userServices.getUserByIdOrEmail).toHaveBeenCalled();
        }));
    });
    describe("GET /api/allUsers", () => {
        it("should return 401 if user doest not logged in", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(index_1.app).get("/api/user/allUsers");
            expect(res.status).toBe(401);
            expect(userServices.getUserByIdOrEmail).not.toHaveBeenCalled();
        }));
        it("get all users with invalid Role", () => __awaiter(void 0, void 0, void 0, function* () {
            const token = (0, helper_1.generateToken)({ id: "123", role: role_type_1.roles.user });
            const res = yield (0, supertest_1.default)(index_1.app).get("/api/user/allUsers").set("Cookie", `token=${token}`);
            expect(res.status).toBe(403);
            expect(userServices.getAllUsers).not.toHaveBeenCalled();
        }));
        it("get all users with valid Role", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockUsersData = [
                {
                    userid: "1",
                    username: "testUser1",
                    email: "test@gmail.com"
                },
                {
                    userid: "2",
                    username: "testUser2",
                    email: "test2@gmail.com"
                }
            ];
            userServices.getAllUsers.mockResolvedValue(mockUsersData);
            const token = (0, helper_1.generateToken)({ id: "123", role: role_type_1.roles.admin });
            const res = yield (0, supertest_1.default)(index_1.app).get("/api/user/allUsers").set('Cookie', `token=${token}`);
            expect(res.status).toBe(200);
            expect(userServices.getAllUsers).toHaveBeenCalled();
            expect(res.body[0].username).toBe("testUser1");
            expect(res.body[1].username).toBe("testUser2");
        }));
    });
    describe("DELETE /api/user", () => {
        it("should return 401 if user doest not logged in", () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(index_1.app).patch("/api/user/456");
            expect(res.status).toBe(401);
            expect(userServices.getUserByIdOrEmail).not.toHaveBeenCalled();
        }));
        it("delete a user with invalid role", () => __awaiter(void 0, void 0, void 0, function* () {
            const token = (0, helper_1.generateToken)({ id: "123", role: role_type_1.roles.user });
            const res = yield (0, supertest_1.default)(index_1.app).patch("/api/user/456").set("Cookie", `token=${token}`);
            expect(res.status).toBe(403);
            expect(userServices.getUserByIdOrEmail).not.toHaveBeenCalled();
            expect(userServices.deleteUser).not.toHaveBeenCalled();
        }));
        it("delete a non existing user with valid role", () => __awaiter(void 0, void 0, void 0, function* () {
            userServices.getUserByIdOrEmail.mockResolvedValue(null);
            const token = (0, helper_1.generateToken)({ id: "123", role: role_type_1.roles.admin });
            const res = yield (0, supertest_1.default)(index_1.app).patch("/api/user/456").set("Cookie", `token=${token}`);
            expect(res.status).toBe(404);
            expect(userServices.getUserByIdOrEmail).toHaveBeenCalled();
            expect(userServices.deleteUser).not.toHaveBeenCalled();
        }));
        it("delete a existing user with valid role", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockUser = {
                userid: "123",
                username: "testuser1",
                email: "test@gmail.com",
                role: role_type_1.roles.user
            };
            userServices.getUserByIdOrEmail.mockResolvedValue(mockUser);
            userServices.deleteUser.mockResolvedValue(null);
            const token = (0, helper_1.generateToken)({ id: "123", role: role_type_1.roles.admin });
            const res = yield (0, supertest_1.default)(index_1.app).patch("/api/user/456").set("Cookie", `token=${token}`);
            expect(res.status).toBe(200);
            expect(userServices.getUserByIdOrEmail).toHaveBeenCalled();
            expect(userServices.deleteUser).toHaveBeenCalled();
        }));
    });
});
