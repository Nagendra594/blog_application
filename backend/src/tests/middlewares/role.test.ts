import { checkRole } from "../../middlewares/role";
import { NextFunction, Request, Response } from "express";
import { roles } from "../../types/role.type";
import { ModReq } from "../../types/customReq.type";

describe("checkRole middleware", () => {
    let mockReq: ModReq;
    const mockRes = {} as Response;
    const mockNext = jest.fn() as NextFunction;

    beforeEach(() => {
        mockReq = {} as ModReq;
        jest.clearAllMocks();
    });

    it("should allow access if role is included", () => {
        mockReq.role = roles.admin;
        const middleware = checkRole([roles.admin, roles.user]);

        middleware(mockReq as any, mockRes, mockNext);

        expect(mockNext).toHaveBeenCalledWith();
    });

    it("should block access if role is not included", () => {
        mockReq.role = "guest";
        const middleware = checkRole([roles.user]);

        middleware(mockReq as any, mockRes, mockNext);

        expect(mockNext).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "Not Authorized",
                status: 403,
                name: "Forbidden",
            })
        );
    });

    it("should block access if no role is provided", () => {
        const middleware = checkRole([roles.admin]);

        middleware(mockReq as any, mockRes, mockNext);

        expect(mockNext).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "Not Authorized",
                status: 403,
                name: "Forbidden",
            })
        );
    });
});
