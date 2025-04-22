"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const role_1 = require("../../middlewares/role");
const role_type_1 = require("../../types/role.type");
describe("checkRole middleware", () => {
    let mockReq;
    const mockRes = {};
    const mockNext = jest.fn();
    beforeEach(() => {
        mockReq = {};
        jest.clearAllMocks();
    });
    it("should allow access if role is included", () => {
        mockReq.role = role_type_1.roles.admin;
        const middleware = (0, role_1.checkRole)([role_type_1.roles.admin, role_type_1.roles.user]);
        middleware(mockReq, mockRes, mockNext);
        expect(mockNext).toHaveBeenCalledWith();
    });
    it("should block access if role is not included", () => {
        mockReq.role = "guest";
        const middleware = (0, role_1.checkRole)([role_type_1.roles.user]);
        middleware(mockReq, mockRes, mockNext);
        expect(mockNext).toHaveBeenCalledWith(expect.objectContaining({
            message: "Not Authorized",
            status: 403,
            name: "Forbidden",
        }));
    });
    it("should block access if no role is provided", () => {
        const middleware = (0, role_1.checkRole)([role_type_1.roles.admin]);
        middleware(mockReq, mockRes, mockNext);
        expect(mockNext).toHaveBeenCalledWith(expect.objectContaining({
            message: "Not Authorized",
            status: 403,
            name: "Forbidden",
        }));
    });
});
