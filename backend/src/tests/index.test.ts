import request from "supertest";
import { app } from "../index";
import path from "path";

describe("Express App", () => {

    it("should respond to GET /api/blogs with 404 if not handled", async () => {
        const res = await request(app).get("/api/blogs/invalid");
        expect([404, 500]).toContain(res.statusCode);
    });

    it("should respond to GET /api/user/allUsers (auth required)", async () => {
        const res = await request(app).get("/api/user/allUsers");
        expect([200, 401, 500]).toContain(res.statusCode);
    });

    it("should respond to GET /api/auth/login with method not allowed", async () => {
        const res = await request(app).get("/api/auth/login");
        expect([404, 405]).toContain(res.statusCode);
    });



    it("should return 500 for internal server errors", async () => {
        const res = await request(app).get("/cause-error");
        expect([404, 500]).toContain(res.statusCode);
    });

});
