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
const blogService = __importStar(require("../../services/blogServices"));
const dbConfig_1 = __importDefault(require("../../config/dbConfig"));
jest.mock("../../config/dbConfig", () => ({
    query: jest.fn(),
}));
const mockedQuery = dbConfig_1.default.query;
describe("blogService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe("createBlog", () => {
        it("should call db.query with correct values", () => __awaiter(void 0, void 0, void 0, function* () {
            const data = {
                userid: "u1",
                title: "Test Title",
                content: "Some content",
                image: "img.png"
            };
            yield blogService.createBlog(data);
            expect(mockedQuery).toHaveBeenCalledWith("INSERT INTO blogs(userid,title,content,image) VALUES($1,$2,$3,$4)", [data.userid, data.title, data.content, data.image]);
        }));
    });
    describe("getBlog", () => {
        it("should call db.query with correct values", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockRow = { userid: "u1", image: "img.png" };
            mockedQuery.mockResolvedValueOnce({ rows: [mockRow] });
            const result = yield blogService.getBlog("1");
            expect(mockedQuery).toHaveBeenCalledWith("SELECT b.userid as userid,b.image as image FROM blogs b WHERE b.blogid=($1)", ["1"]);
        }));
        it("should return null if no blog is found", () => __awaiter(void 0, void 0, void 0, function* () {
            mockedQuery.mockResolvedValueOnce({ rows: [] });
            const result = yield blogService.getBlog("nonexistent");
            expect(result).toBeNull();
        }));
        it("should return blog data if found", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockRow = { userid: "u1", image: "img.png" };
            mockedQuery.mockResolvedValueOnce({ rows: [mockRow] });
            const result = yield blogService.getBlog("1");
            expect(mockedQuery).toHaveBeenCalledWith("SELECT b.userid as userid,b.image as image FROM blogs b WHERE b.blogid=($1)", ["1"]);
            expect(result).toEqual(mockRow);
        }));
    });
    describe("updateBlog", () => {
        it("should call db.query with correct values", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockedData = { title: "hello", content: "someContent", blogid: "1" };
            yield blogService.updateBlog(mockedData);
            expect(mockedQuery).toHaveBeenCalledWith("UPDATE blogs SET title=($1),content=($2) WHERE blogid=($3)", [mockedData.title, mockedData.content, mockedData.blogid]);
        }));
    });
    describe("deleteBlog", () => {
        it("should call db.query with correct values", () => __awaiter(void 0, void 0, void 0, function* () {
            yield blogService.deleteBlog("1");
            expect(mockedQuery).toHaveBeenCalledWith("DELETE FROM blogs WHERE blogid=($1)", ["1"]);
        }));
    });
    describe("getBlogs", () => {
        it("should call db.query with correct values", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockRow = [{
                    blogid: "1",
                    title: "test",
                    content: "testing",
                    date: new Date(),
                    image: "img.png",
                    username: "testuser",
                    userid: "123",
                }];
            mockedQuery.mockResolvedValueOnce({ rows: mockRow });
            const value = yield blogService.getBlogs();
            expect(mockedQuery).toHaveBeenCalledWith("SELECT b.blogid,b.title as title,b.content as content,b.image as image,u.username as username,u.userid as userid,b.created_at as date FROM blogs b JOIN users u on b.userid=u.userid ORDER BY b.created_at DESC");
            expect(value).toEqual(mockRow);
        }));
    });
});
