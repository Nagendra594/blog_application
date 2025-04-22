import request from "supertest";
import { UserModel } from "../../models/userModel";
import { roles } from "../../types/role.type";
import * as userServices from "../../services/userServices";

jest.mock("../../services/userServices");
import { app } from "../../index";
import { generateToken } from "../../util/helper";

describe("User Controller", () => {


    describe("GET /api/user", () => {
        afterAll(() => {
            jest.clearAllMocks();
        })
        it("should return 401 if user doest not logged in", async () => {

            const res = await request(app).get("/api/user");
            expect(res.status).toBe(401);
            expect(userServices.getUserByIdOrEmail).not.toHaveBeenCalled();

        })
        it("get a user with invalid token", async () => {
            const res = await request(app).get("/api/user").set("Cookie", "token=invalidHeader.invalidData.invalidSignature");
            expect(res.status).toBe(401);
            expect(userServices.getUserByIdOrEmail).not.toHaveBeenCalled();

        })
        it("handling when no user found", async () => {
            const token = generateToken({ id: "123", role: roles.user });
            (userServices.getUserByIdOrEmail as jest.Mock).mockResolvedValue(null);
            const res = await request(app).get("/api/user").set("Cookie", `token=${token}`);
            expect(res.status).toBe(404);
            expect(userServices.getUserByIdOrEmail).toHaveBeenCalled();

        })
        it("get a user with Valid token", async () => {
            const mockUser: Partial<UserModel> = {
                userid: "123",
                username: "testuser1",
                email: "test@gmail.com",
                role: roles.user
            };
            (userServices.getUserByIdOrEmail as jest.Mock).mockResolvedValue(mockUser);
            const token = generateToken({ id: "123", role: roles.user });
            const res = await request(app).get("/api/user").set("Cookie", `token=${token}`);
            expect(res.status).toBe(200);
            expect(userServices.getUserByIdOrEmail).toHaveBeenCalled();
        })


    })



    describe("GET /api/allUsers", () => {
        it("should return 401 if user doest not logged in", async () => {

            const res = await request(app).get("/api/user/allUsers");
            expect(res.status).toBe(401);
            expect(userServices.getUserByIdOrEmail).not.toHaveBeenCalled();

        })
        it("get all users with invalid Role", async () => {
            const token = generateToken({ id: "123", role: roles.user });
            const res = await request(app).get("/api/user/allUsers").set("Cookie", `token=${token}`);
            expect(res.status).toBe(403);
            expect(userServices.getAllUsers).not.toHaveBeenCalled();
        })
        it("get all users with valid Role", async () => {

            const mockUsersData: Partial<UserModel>[] = [
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

            (userServices.getAllUsers as jest.Mock).mockResolvedValue(mockUsersData);
            const token = generateToken({ id: "123", role: roles.admin });
            const res = await request(app).get("/api/user/allUsers").set('Cookie', `token=${token}`);
            expect(res.status).toBe(200);
            expect(userServices.getAllUsers).toHaveBeenCalled();
            expect(res.body[0].username).toBe("testUser1");
            expect(res.body[1].username).toBe("testUser2");
        })


    })



    describe("DELETE /api/user", () => {
        it("should return 401 if user doest not logged in", async () => {

            const res = await request(app).patch("/api/user/456");
            expect(res.status).toBe(401);
            expect(userServices.getUserByIdOrEmail).not.toHaveBeenCalled();

        })
        it("delete a user with invalid role", async () => {
            const token = generateToken({ id: "123", role: roles.user });
            const res = await request(app).patch("/api/user/456").set("Cookie", `token=${token}`);
            expect(res.status).toBe(403);
            expect(userServices.getUserByIdOrEmail).not.toHaveBeenCalled();
            expect(userServices.deleteUser).not.toHaveBeenCalled();

        })
        it("delete a non existing user with valid role", async () => {
            (userServices.getUserByIdOrEmail as jest.Mock).mockResolvedValue(null);
            const token = generateToken({ id: "123", role: roles.admin });
            const res = await request(app).patch("/api/user/456").set("Cookie", `token=${token}`);
            expect(res.status).toBe(404);
            expect(userServices.getUserByIdOrEmail).toHaveBeenCalled();
            expect(userServices.deleteUser).not.toHaveBeenCalled();
        })
        it("delete a existing user with valid role", async () => {
            const mockUser: Partial<UserModel> = {
                userid: "123",
                username: "testuser1",
                email: "test@gmail.com",
                role: roles.user
            };
            (userServices.getUserByIdOrEmail as jest.Mock).mockResolvedValue(mockUser);
            (userServices.deleteUser as jest.Mock).mockResolvedValue(null);
            const token = generateToken({ id: "123", role: roles.admin });
            const res = await request(app).patch("/api/user/456").set("Cookie", `token=${token}`);
            expect(res.status).toBe(200);
            expect(userServices.getUserByIdOrEmail).toHaveBeenCalled();
            expect(userServices.deleteUser).toHaveBeenCalled();
        })
    })



})