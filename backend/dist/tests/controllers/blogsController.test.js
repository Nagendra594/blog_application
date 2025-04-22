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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const index_1 = require("../../index");
const blogServices = __importStar(require("../../services/blogServices"));
const helper_1 = require("../../util/helper");
jest.mock("../../util/file");
jest.mock('../../services/blogServices');
const mockedCreateBlog = blogServices.createBlog;
const mockedGetBlog = blogServices.getBlog;
const mockedUpdateBlog = blogServices.updateBlog;
const mockedDeleteBlog = blogServices.deleteBlog;
const mockedGetBlogs = blogServices.getBlogs;
describe('Blog Controller', () => {
    describe('GET /api/blog', () => {
        it("should return 401 if user doest not logged in", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(index_1.app).post("/api/auth/logout");
            expect(response.status).toBe(401);
        }));
        it('should return all blogs', () => __awaiter(void 0, void 0, void 0, function* () {
            const token = (0, helper_1.generateToken)({ id: 'user123', role: 'user' });
            const fakeBlogs = [
                { blogid: '1', userid: 'user123', title: 'Blog 1', content: 'Content 1', image: 'img.jpg', username: "test1", date: new Date() },
                { blogid: '2', userid: 'user123', title: 'Blog 2', content: 'Content 2', image: 'img2.jpg', username: "test2", date: new Date() }
            ];
            mockedGetBlogs.mockResolvedValueOnce(fakeBlogs);
            const res = yield (0, supertest_1.default)(index_1.app).get('/api/blogs/').set('Cookie', [`token=${token}`]);
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(mockedGetBlogs).toHaveBeenCalled();
        }));
    });
    describe('POST /api/blog', () => {
        it("should return 401 if user doest not logged in", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(index_1.app).post("/api/auth/logout");
            expect(response.status).toBe(401);
        }));
        it('should response 422 with invalid details', () => __awaiter(void 0, void 0, void 0, function* () {
            const token = (0, helper_1.generateToken)({ id: 'user123', role: 'user' });
            const res = yield (0, supertest_1.default)(index_1.app).post("/api/blogs").set("Cookie", `token=${token}`).field('title', 'st').field('content', 'st');
            expect(res.status).toBe(422);
            expect(mockedCreateBlog).not.toHaveBeenCalled();
        }));
        it('should create a new blog', () => __awaiter(void 0, void 0, void 0, function* () {
            const token = (0, helper_1.generateToken)({ id: 'user123', role: 'user' });
            mockedCreateBlog.mockResolvedValueOnce(undefined);
            const res = yield (0, supertest_1.default)(index_1.app).post("/api/blogs").set("Cookie", `token=${token}`).field('title', 'valid').field('content', 'valid').field("image", "dummy.jpeg");
            expect(res.status).toBe(201);
            expect(mockedCreateBlog).toHaveBeenCalled();
        }));
    });
    describe('Patch /api/blog/:id', () => {
        it("should return 401 if user doest not logged in", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(index_1.app).post("/api/auth/logout");
            expect(response.status).toBe(401);
        }));
        it('should response 422 with invalid details', () => __awaiter(void 0, void 0, void 0, function* () {
            const token = (0, helper_1.generateToken)({ id: 'user123', role: 'user' });
            const res = yield (0, supertest_1.default)(index_1.app).patch("/api/blogs/1").set("Cookie", `token=${token}`).field('title', 'st').field('content', 'st');
            expect(res.status).toBe(422);
            expect(mockedGetBlog).not.toHaveBeenCalled();
            expect(mockedUpdateBlog).not.toHaveBeenCalled();
        }));
        it("should not update blog if does not exists", () => __awaiter(void 0, void 0, void 0, function* () {
            const token = (0, helper_1.generateToken)({ id: 'user123', role: 'user' });
            mockedGetBlog.mockResolvedValueOnce(null);
            const res = yield (0, supertest_1.default)(index_1.app).patch("/api/blogs/1").set("Cookie", `token=${token}`).field('title', 'valid').field('content', 'valid');
            expect(res.status).toBe(404);
            expect(mockedGetBlog).toHaveBeenCalled();
            expect(mockedUpdateBlog).not.toHaveBeenCalled();
        }));
        it('should not update blog if user is not owner', () => __awaiter(void 0, void 0, void 0, function* () {
            const token = (0, helper_1.generateToken)({ id: 'user124', role: 'user' });
            mockedGetBlog.mockResolvedValueOnce({
                blogid: '1',
                userid: 'user123',
                title: 'Old Title',
                content: 'Old Content',
                image: 'uploads/old.jpg'
            });
            mockedUpdateBlog.mockResolvedValueOnce(undefined);
            const res = yield (0, supertest_1.default)(index_1.app)
                .patch('/api/blogs/1')
                .set('Cookie', [`token=${token}`])
                .field('title', 'Updated Title')
                .field('content', 'Updated content');
            expect(res.status).toBe(403);
            expect(mockedGetBlog).toHaveBeenCalled();
            expect(mockedUpdateBlog).not.toHaveBeenCalled();
        }));
        it('should update blog if user is not owner but admin', () => __awaiter(void 0, void 0, void 0, function* () {
            const token = (0, helper_1.generateToken)({ id: 'user124', role: 'admin' });
            mockedGetBlog.mockResolvedValueOnce({
                blogid: '1',
                userid: 'user123',
                title: 'Old Title',
                content: 'Old Content',
                image: 'uploads/old.jpg'
            });
            mockedUpdateBlog.mockResolvedValueOnce(undefined);
            const res = yield (0, supertest_1.default)(index_1.app)
                .patch('/api/blogs/1')
                .set('Cookie', [`token=${token}`])
                .field('title', 'Updated Title')
                .field('content', 'Updated content');
            expect(res.status).toBe(200);
            expect(mockedGetBlog).toHaveBeenCalled();
            expect(mockedUpdateBlog).toHaveBeenCalled();
        }));
    });
    describe('DELETE /api/blog/:id', () => {
        it("should return 401 if user doest not logged in", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(index_1.app).post("/api/auth/logout");
            expect(response.status).toBe(401);
        }));
        it("should not delete blog if does not exists", () => __awaiter(void 0, void 0, void 0, function* () {
            const token = (0, helper_1.generateToken)({ id: 'user123', role: 'user' });
            mockedGetBlog.mockResolvedValueOnce(null);
            const res = yield (0, supertest_1.default)(index_1.app).delete("/api/blogs/1").set("Cookie", `token=${token}`);
            expect(res.status).toBe(404);
            expect(mockedGetBlog).toHaveBeenCalled();
            expect(mockedDeleteBlog).not.toHaveBeenCalled();
        }));
        it('should delete blog if user is owner', () => __awaiter(void 0, void 0, void 0, function* () {
            const token = (0, helper_1.generateToken)({ id: 'user123', role: 'user' });
            mockedGetBlog.mockResolvedValueOnce({
                blogid: '1',
                userid: 'user123',
                title: 'Title',
                content: 'Content',
                image: 'uploads/image.jpg'
            });
            mockedDeleteBlog.mockResolvedValueOnce(undefined);
            const res = yield (0, supertest_1.default)(index_1.app)
                .delete('/api/blogs/1')
                .set('Cookie', [`token=${token}`]);
            expect(res.status).toBe(200);
            expect(mockedDeleteBlog).toHaveBeenCalled();
        }));
        it('should delete blog if user is not owner but admin', () => __awaiter(void 0, void 0, void 0, function* () {
            const token = (0, helper_1.generateToken)({ id: 'user124', role: 'admin' });
            mockedGetBlog.mockResolvedValueOnce({
                blogid: '1',
                userid: 'user123',
                title: 'Title',
                content: 'Content',
                image: 'uploads/image.jpg'
            });
            mockedDeleteBlog.mockResolvedValueOnce(undefined);
            const res = yield (0, supertest_1.default)(index_1.app)
                .delete('/api/blogs/1')
                .set('Cookie', [`token=${token}`]);
            expect(res.status).toBe(200);
            expect(mockedDeleteBlog).toHaveBeenCalled();
        }));
        it('should not delete if user is not owner', () => __awaiter(void 0, void 0, void 0, function* () {
            const token = (0, helper_1.generateToken)({ id: 'user124', role: 'user' });
            mockedGetBlog.mockResolvedValueOnce({
                blogid: '1',
                userid: 'anotherUser',
                title: 'Title',
                content: 'Content',
                image: 'uploads/image.jpg'
            });
            const res = yield (0, supertest_1.default)(index_1.app)
                .delete('/api/blogs/1')
                .set('Cookie', [`token=${token}`]);
            expect(res.status).toBe(403);
        }));
    });
});
