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
Object.defineProperty(exports, "__esModule", { value: true });
const isAuth_1 = require("../../middlewares/isAuth");
const helper = __importStar(require("../../util/helper"));
jest.mock("../../util/helper", () => (Object.assign(Object.assign({}, jest.requireActual("../../util/helper")), { verifyToken: jest.fn() })));
describe("isAuth middleware", () => {
    const mockReq = {
        cookies: {},
    };
    const mockRes = {};
    const mockNext = jest.fn();
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it("should return error if no token is found", () => {
        mockReq.cookies = {};
        (0, isAuth_1.isAuth)(mockReq, mockRes, mockNext);
        expect(mockNext).toHaveBeenCalledWith(expect.objectContaining({
            message: "no token found",
            status: 401,
            name: "no token",
        }));
    });
    it("should return error if token is invalid", () => {
        mockReq.cookies = { token: "invalidToken" };
        helper.verifyToken.mockReturnValue(null);
        (0, isAuth_1.isAuth)(mockReq, mockRes, mockNext);
        expect(mockNext).toHaveBeenCalledWith(expect.objectContaining({
            message: "invalid token",
            status: 401,
            name: "invalid token",
        }));
    });
    it("should set req.userId and req.role if token is valid", () => {
        const decodedToken = { id: "123", role: "user" };
        mockReq.cookies = { token: "validToken" };
        helper.verifyToken.mockReturnValue(decodedToken);
        const reqWithMod = mockReq;
        (0, isAuth_1.isAuth)(reqWithMod, mockRes, mockNext);
        expect(reqWithMod.userId).toBe("123");
        expect(reqWithMod.role).toBe("user");
        expect(mockNext).toHaveBeenCalledWith();
    });
    it("should catch unexpected error and return default 401 error", () => {
        mockReq.cookies = { token: "causeError" };
        helper.verifyToken.mockImplementation(() => {
            throw new Error("Unexpected failure");
        });
        (0, isAuth_1.isAuth)(mockReq, mockRes, mockNext);
        expect(mockNext).toHaveBeenCalledWith(expect.objectContaining({
            message: "invalid token",
            status: 401,
            name: "invalid token",
        }));
    });
});
