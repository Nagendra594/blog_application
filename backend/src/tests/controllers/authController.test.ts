import request from "supertest";

import { app } from "../../index";

import * as userServices from "../../services/userServices";
import { UserModel } from "../../models/userModel";

import { comparePass, hashPass, generateToken } from "../../util/helper";
import { roles } from "../../types/role.type";
import dotenv from "dotenv";
dotenv.config();
jest.mock("../../services/userServices");
jest.mock("../../util/helper", () => {
    const actuals = jest.requireActual("../../util/helper");
    return {
        ...actuals,
        hashPass: jest.fn(),
        comparePass: jest.fn()
    }
})

const mockGetUserByIdOrEmail = userServices.getUserByIdOrEmail as jest.Mock;

const mockCreateUser = userServices.createUser as jest.Mock;


const mockHashPass = hashPass as jest.Mock;
const mockComparePass = comparePass as jest.Mock;



describe("Auth Controller", () => {
    describe("POST /api/auth/regiser", () => {
        afterAll(() => {
            jest.clearAllMocks();
        })
        it("should return 422 for invalid details", async () => {
            const response = await request(app).post("/api/auth/register").field("userName", "st").field("email", "invalid").field("password", "short");
            expect(response.status).toBe(422);
            expect(mockGetUserByIdOrEmail).not.toHaveBeenCalled();
            expect(mockHashPass).not.toHaveBeenCalled();
            expect(mockCreateUser).not.toHaveBeenCalled();
        })

        it("should return 409 for already exits user", async () => {
            const mockedUserData: UserModel | null = {
                userid: "123",
                username: "test",
                email: "valid@gmail.com",
                password: "validPassword",
                role: roles.user
            }
            mockGetUserByIdOrEmail.mockResolvedValue(mockedUserData);
            const response = await request(app).post("/api/auth/register").field("userName", "valid").field("email", "valid@gmail.com").field("password", "validPassword");
            expect(response.status).toBe(409);
            expect(mockGetUserByIdOrEmail).toHaveBeenCalledTimes(1);
            expect(mockGetUserByIdOrEmail).toHaveBeenCalledWith(undefined, "valid@gmail.com");
            expect(mockHashPass).not.toHaveBeenCalled();
            expect(mockCreateUser).not.toHaveBeenCalled();
        })

        it("should register a user with valid data", async () => {
            const mockedUserData: UserModel | null = null;
            mockGetUserByIdOrEmail.mockResolvedValue(mockedUserData);
            mockHashPass.mockReturnValue("someHasedPassword");
            const response = await request(app).post("/api/auth/register").field("userName", "valid").field("email", "valid@gmail.com").field("password", "validPassword");
            expect(response.status).toBe(201);
            expect(mockGetUserByIdOrEmail).toHaveBeenCalledTimes(2);
            expect(mockGetUserByIdOrEmail).toHaveBeenCalledWith(undefined, "valid@gmail.com");
            expect(mockHashPass).toHaveBeenCalled();
            expect(mockHashPass).toHaveBeenCalledWith("validPassword", Number(process.env.SALT));
            expect(mockCreateUser).toHaveBeenCalled();
            expect(mockCreateUser).toHaveBeenCalledWith({ username: "valid", email: "valid@gmail.com", password: "someHasedPassword" })
        })
    })
    describe("POST /api/auth/login", () => {
        it("should return 422 for invalid details", async () => {
            const response = await request(app).post("/api/auth/login").field("email", "invalid").field("password", "short");
            expect(response.status).toBe(422);
            expect(mockGetUserByIdOrEmail).not.toHaveBeenCalled();
            expect(mockComparePass).not.toHaveBeenCalled();

        })

        it("should return 404 if user does not exists", async () => {
            const mockedUserData: UserModel | null = null
            mockGetUserByIdOrEmail.mockResolvedValue(mockedUserData);
            const response = await request(app).post("/api/auth/login").field("email", "valid@gmail.com").field("password", "validPassword");
            expect(response.status).toBe(404);
            expect(mockGetUserByIdOrEmail).toHaveBeenCalledTimes(1);
            expect(mockGetUserByIdOrEmail).toHaveBeenCalledWith(undefined, "valid@gmail.com");
            expect(mockComparePass).not.toHaveBeenCalled();
        })

        it("should return 401 if user enter wrong password", async () => {
            const mockedUserData: UserModel | null = {
                userid: "123",
                username: "test",
                email: "valid@gmail.com",
                password: "validPassword",
                role: roles.user
            }
            mockGetUserByIdOrEmail.mockResolvedValue(mockedUserData);
            mockComparePass.mockReturnValue(false);
            const response = await request(app).post("/api/auth/login").field("email", "valid@gmail.com").field("password", "wrongPassword");
            expect(response.status).toBe(401);
            expect(mockGetUserByIdOrEmail).toHaveBeenCalledTimes(2);
            expect(mockGetUserByIdOrEmail).toHaveBeenCalledWith(undefined, "valid@gmail.com");
            expect(mockComparePass).toHaveBeenCalled();
            expect(mockComparePass).toHaveBeenCalledWith("wrongPassword", mockedUserData.password);

        })
        it("should return 200 and generate token if user enter correct password", async () => {
            const mockedUserData: UserModel | null = {
                userid: "123",
                username: "test",
                email: "valid@gmail.com",
                password: "validPassword",
                role: roles.user
            }
            mockGetUserByIdOrEmail.mockResolvedValue(mockedUserData);
            mockComparePass.mockReturnValue(true);
            const response = await request(app).post("/api/auth/login").field("email", "valid@gmail.com").field("password", "validPassword");
            expect(response.status).toBe(200);
            expect(mockGetUserByIdOrEmail).toHaveBeenCalledTimes(3);
            expect(mockGetUserByIdOrEmail).toHaveBeenCalledWith(undefined, "valid@gmail.com");
            expect(mockComparePass).toHaveBeenCalled();
            expect(mockComparePass).toHaveBeenCalledWith("validPassword", mockedUserData.password);


        })
    })


    describe("POST /api/auth/logout", () => {
        it("should return 401 if user doest not logged in", async () => {
            const response = await request(app).post("/api/auth/logout");
            expect(response.status).toBe(401);

        })
        it("should clear cookies if user logged in", async () => {
            const token: string = generateToken({ id: "123", role: roles.user });
            const response = await request(app).post("/api/auth/logout").set("Cookie", `token=${token}`);
            expect(response.status).toBe(200)
        })
    })




})