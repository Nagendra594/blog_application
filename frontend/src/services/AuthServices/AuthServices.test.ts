import { describe, it, expect, beforeEach, vi } from "vitest";
import { login, register, logout } from "./AuthServices";
import { AuthModel } from "../../types/AuthModel";
import { Role } from "../../types/Role.type";

const API_URL = process.env.API_URL;

describe("authApi", () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    describe("login", () => {
        it("should return role on successful login", async () => {
            const mockResponse = { role: Role.user };
            vi.stubGlobal("fetch", vi.fn(() =>
                Promise.resolve({
                    ok: true,
                    status: 200,
                    json: () => Promise.resolve(mockResponse),
                } as Response)
            ));

            const credentials: AuthModel = { email: "test@example.com", password: "1234" };

            const response = await login(credentials);
            expect(fetch).toHaveBeenCalledWith(`${API_URL}auth/login`, expect.anything());
            expect(response.status).toBe(200);
            expect(response.data).toBe(Role.user);
        });

        it("should handle failed login", async () => {
            vi.stubGlobal("fetch", vi.fn(() =>
                Promise.resolve({
                    ok: false,
                    status: 401,
                } as Response)
            ));

            const credentials: AuthModel = { email: "wrong@example.com", password: "bad" };

            const response = await login(credentials);
            expect(response.status).toBe(401);
            expect(response.data).toBeUndefined();
        });
    });

    describe("register", () => {
        it("should return status 201 on success", async () => {
            vi.stubGlobal("fetch", vi.fn(() =>
                Promise.resolve({
                    ok: true,
                    status: 201,
                } as Response)
            ));

            const credentials: AuthModel = {
                username: "venkata",
                email: "venkata@example.com",
                password: "12345",
            };

            const response = await register(credentials);
            expect(response.status).toBe(201);
        });

        it("should handle register failure", async () => {
            vi.stubGlobal("fetch", vi.fn(() =>
                Promise.resolve({
                    ok: false,
                    status: 409,
                } as Response)
            ));

            const credentials: AuthModel = {
                username: "venkata",
                email: "venkata@example.com",
                password: "12345",
            };

            const response = await register(credentials);
            expect(response.status).toBe(409);
        });

    });

    describe("logout", () => {
        it("should return 200 on success", async () => {
            vi.stubGlobal("fetch", vi.fn(() =>
                Promise.resolve({
                    ok: true,
                    status: 200,
                } as Response)
            ));

            const response = await logout();
            expect(response.status).toBe(200);
        });

        it("should handle logout failure", async () => {
            vi.stubGlobal("fetch", vi.fn(() =>
                Promise.resolve({
                    ok: false,
                    status: 500,
                } as Response)
            ));

            const response = await logout();
            expect(response.status).toBe(500);
        });
    });
});
