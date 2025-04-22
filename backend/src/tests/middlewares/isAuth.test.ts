import { isAuth } from "../../middlewares/isAuth";
import { Request, Response, NextFunction } from "express";
import * as helper from "../../util/helper";
import { customError } from "../../types/error.type";
jest.mock("../../util/helper", () => ({

    ...jest.requireActual("../../util/helper"),
    verifyToken: jest.fn(),
}));

describe("isAuth middleware", () => {
    const mockReq = {
        cookies: {},
    } as any as Request;

    const mockRes = {} as Response;
    const mockNext = jest.fn() as NextFunction;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return error if no token is found", () => {
        mockReq.cookies = {};

        isAuth(mockReq, mockRes, mockNext);

        expect(mockNext).toHaveBeenCalledWith(
            expect.objectContaining<customError>({
                message: "no token found",
                status: 401,
                name: "no token",
            })
        );
    });

    it("should return error if token is invalid", () => {
        mockReq.cookies = { token: "invalidToken" };
        (helper.verifyToken as jest.Mock).mockReturnValue(null);

        isAuth(mockReq, mockRes, mockNext);

        expect(mockNext).toHaveBeenCalledWith(
            expect.objectContaining<customError>({
                message: "invalid token",
                status: 401,
                name: "invalid token",
            })
        );
    });

    it("should set req.userId and req.role if token is valid", () => {
        const decodedToken = { id: "123", role: "user" };
        mockReq.cookies = { token: "validToken" };
        (helper.verifyToken as jest.Mock).mockReturnValue(decodedToken);

        const reqWithMod = mockReq as any;

        isAuth(reqWithMod, mockRes, mockNext);

        expect(reqWithMod.userId).toBe("123");
        expect(reqWithMod.role).toBe("user");
        expect(mockNext).toHaveBeenCalledWith();
    });

    it("should catch unexpected error and return default 401 error", () => {
        mockReq.cookies = { token: "causeError" };
        (helper.verifyToken as jest.Mock).mockImplementation(() => {
            throw new Error("Unexpected failure");
        });

        isAuth(mockReq, mockRes, mockNext);

        expect(mockNext).toHaveBeenCalledWith(
            expect.objectContaining<customError>({
                message: "invalid token",
                status: 401,
                name: "invalid token",
            })
        );
    });
});
