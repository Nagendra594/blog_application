import { describe, it, expect, beforeEach, vi } from "vitest";
import { getUser, getAllUsers, deleteAUser } from "./userServices";
import { UserModel } from "../../models/UserModel";
import { APIResponseModel } from "../../types/APIResponseModel";
import { Role } from "../../types/Role.type";

const API_URL = "http://localhost:3000/";
process.env.API_URL = API_URL;

describe("userApi", () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    describe("getUser", () => {
        it("should return user data on 200 OK", async () => {
            const mockUser: UserModel = {
                userid: "1",
                username: "testUser",
                email: "test@example.com",
                role: Role.user
            };

            vi.stubGlobal("fetch", vi.fn(() =>
                Promise.resolve({
                    ok: true,
                    status: 200,
                    json: () => Promise.resolve(mockUser),
                } as Response)
            ));

            const response = await getUser();
            expect(response.status).toBe(200);
            expect(response.data).toEqual(mockUser);
        });

        it("should handle 500 Internal Server Error", async () => {
            vi.stubGlobal("fetch", vi.fn(() =>
                Promise.resolve({
                    ok: false,
                    status: 500,
                    json: () => Promise.resolve({}),
                } as Response)
            ));

            const response = await getUser();
            expect(response.status).toBe(500);
            expect(response.data).toBeUndefined();
        });

        it("should handle 404 Not Found", async () => {
            vi.stubGlobal("fetch", vi.fn(() =>
                Promise.resolve({
                    ok: false,
                    status: 404,
                    json: () => Promise.resolve({}),
                } as Response)
            ));

            const response = await getUser();
            expect(response.status).toBe(404);
            expect(response.data).toBeUndefined();
        });
    });

    describe("getAllUsers", () => {
        it("should return users on 200 OK", async () => {
            const mockUsers: UserModel[] = [
                { userid: "1", username: "test1", email: "t1@example.com", role: Role.user },
                { userid: "2", username: "test2", email: "t2@example.com", role: Role.user },
            ];

            vi.stubGlobal("fetch", vi.fn(() =>
                Promise.resolve({
                    ok: true,
                    status: 200,
                    json: () => Promise.resolve(mockUsers),
                } as Response)
            ));

            const response = await getAllUsers();
            expect(response.status).toBe(200);
            expect(response.data?.length).toBe(2);
        });

        it("should handle 500 error", async () => {
            vi.stubGlobal("fetch", vi.fn(() =>
                Promise.resolve({
                    ok: false,
                    status: 500,
                    json: () => Promise.resolve({}),
                } as Response)
            ));

            const response = await getAllUsers();
            expect(response.status).toBe(500);
            expect(response.data).toBeUndefined();
        });

        it("should handle 404 error", async () => {
            vi.stubGlobal("fetch", vi.fn(() =>
                Promise.resolve({
                    ok: false,
                    status: 404,
                    json: () => Promise.resolve({}),
                } as Response)
            ));

            const response = await getAllUsers();
            expect(response.status).toBe(404);
            expect(response.data).toBeUndefined();
        });
    });

    describe("deleteAUser", () => {
        it("should return 200 on success", async () => {
            vi.stubGlobal("fetch", vi.fn(() =>
                Promise.resolve({
                    status: 200,
                } as Response)
            ));

            const response = await deleteAUser("123");
            expect(response.status).toBe(200);
        });

        it("should return 404 Not Found", async () => {
            vi.stubGlobal("fetch", vi.fn(() =>
                Promise.resolve({
                    status: 404,
                } as Response)
            ));

            const response = await deleteAUser("999");
            expect(response.status).toBe(404);
        });

        it("should return 500 Internal Server Error", async () => {
            vi.stubGlobal("fetch", vi.fn(() =>
                Promise.resolve({
                    status: 500,
                } as Response)
            ));

            const response = await deleteAUser("123");
            expect(response.status).toBe(500);
        });
    });
});
