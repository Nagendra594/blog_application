import { describe, it, expect, beforeEach, vi } from "vitest";
import { getBlogs, insertBlog, updateBlog, deleteBlog } from "./blogServices";
import { BlogModel } from "../../models/BlogModel";
import { Role } from "../../types/Role.type";

const API_URL = "http://localhost:3000/";
process.env.API_URL = API_URL;

describe("blogApi", () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    describe("getBlogs", () => {
        it("should return blog list on success", async () => {
            const mockBlogs: BlogModel[] = [
                {
                    blogid: "1", title: "First", content: "Content", image: "img.jpg", date: new Date(),
                    userid: "123",
                    username: "test",
                    role: Role.user
                },
            ];
            vi.stubGlobal("fetch", vi.fn(() =>
                Promise.resolve({
                    ok: true,
                    status: 200,
                    json: () => Promise.resolve(mockBlogs),
                } as Response)
            ));

            const response = await getBlogs(null);
            expect(response.status).toBe(200);
            expect(response.data?.length).toBe(1);
        });
        it("should handle unAuthenticated user", async () => {
            vi.stubGlobal("fetch", vi.fn(() =>
                Promise.resolve({
                    ok: false,
                    status: 401,
                    json: () => Promise.resolve({}),
                } as Response)
            ));

            const response = await getBlogs(null);
            expect(response.status).toBe(401);
            expect(response.data).toBeUndefined();
        });
        it("should handle fetch error", async () => {
            vi.stubGlobal("fetch", vi.fn(() =>
                Promise.resolve({
                    ok: false,
                    status: 500,
                    json: () => Promise.resolve({}),
                } as Response)
            ));

            const response = await getBlogs(null);
            expect(response.status).toBe(500);
            expect(response.data).toBeUndefined();
        });
    });

    describe("insertBlog", () => {
        const blogData = {
            title: "New",
            content: "New content",
            image: new File(["dummy content"], "image.png", { type: "image/png" }),
        };

        it("should return 201 on successful insert", async () => {
            vi.stubGlobal("fetch", vi.fn(() =>
                Promise.resolve({
                    ok: true,
                    status: 201,
                } as Response)
            ));

            const response = await insertBlog(blogData);
            expect(response.status).toBe(201);
        });
        it("should handle invalid details", async () => {
            vi.stubGlobal("fetch", vi.fn(() =>
                Promise.resolve({
                    ok: false,
                    status: 422,
                    json: () => Promise.resolve({}),
                } as Response)
            ));

            const response = await insertBlog(blogData);
            expect(response.status).toBe(422);
        });

        it("should handle unAuthenticated user", async () => {
            vi.stubGlobal("fetch", vi.fn(() =>
                Promise.resolve({
                    ok: false,
                    status: 401,
                    json: () => Promise.resolve({}),
                } as Response)
            ));

            const response = await insertBlog(blogData);
            expect(response.status).toBe(401);
        });

        it("should return 500 on failure", async () => {
            vi.stubGlobal("fetch", vi.fn(() =>
                Promise.resolve({
                    ok: false,
                    status: 500,
                } as Response)
            ));

            const response = await insertBlog(blogData);
            expect(response.status).toBe(500);
        });
    });

    describe("updateBlog", () => {
        const updateData = {
            blogid: "1",
            title: "Updated title",
            content: "Updated content",
            image: new File(["new"], "new.jpg", { type: "image/jpeg" }),
        };

        it("should return 200 on successful update", async () => {
            vi.stubGlobal("fetch", vi.fn(() =>
                Promise.resolve({
                    ok: true,
                    status: 200,
                } as Response)
            ));

            const response = await updateBlog(updateData);
            expect(response.status).toBe(200);
        });
        it("should handle invalid details", async () => {
            vi.stubGlobal("fetch", vi.fn(() =>
                Promise.resolve({
                    ok: false,
                    status: 422,
                    json: () => Promise.resolve({}),
                } as Response)
            ));

            const response = await updateBlog(updateData);
            expect(response.status).toBe(422);
        });
        it("should return 500 on failure", async () => {
            vi.stubGlobal("fetch", vi.fn(() =>
                Promise.resolve({
                    ok: false,
                    status: 500,
                } as Response)
            ));

            const response = await updateBlog(updateData);
            expect(response.status).toBe(500);
        });
        it("should handle unAuthenticated user", async () => {
            vi.stubGlobal("fetch", vi.fn(() =>
                Promise.resolve({
                    ok: false,
                    status: 401,
                    json: () => Promise.resolve({}),
                } as Response)
            ));

            const response = await updateBlog(updateData);
            expect(response.status).toBe(401);
        });
    });

    describe("deleteBlog", () => {
        it("should return 204 on success", async () => {
            vi.stubGlobal("fetch", vi.fn(() =>
                Promise.resolve({
                    ok: true,
                    status: 204,
                } as Response)
            ));

            const response = await deleteBlog("123");
            expect(response.status).toBe(204);
        });
        it("should handle unAuthenticated user", async () => {
            vi.stubGlobal("fetch", vi.fn(() =>
                Promise.resolve({
                    ok: false,
                    status: 401,
                    json: () => Promise.resolve({}),
                } as Response)
            ));

            const response = await deleteBlog("123");
            expect(response.status).toBe(401);
            expect(response.data).toBeUndefined();
        });
        it("should return 500 on failure", async () => {
            vi.stubGlobal("fetch", vi.fn(() =>
                Promise.resolve({
                    ok: false,
                    status: 500,
                } as Response)
            ));

            const response = await deleteBlog("123");
            expect(response.status).toBe(500);
        });
    });
});
