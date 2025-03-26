"use strict";
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
exports.getBlogs = exports.deleteBlog = exports.updateBlog = exports.getBlog = exports.createBlog = void 0;
const dbConfig_1 = __importDefault(require("../config/dbConfig"));
const createBlog = (credentials) => __awaiter(void 0, void 0, void 0, function* () {
    const sq = "INSERT INTO blogs(userId,title,content) VALUES(?,?,?)";
    const values = [credentials.userId, credentials.title, credentials.content];
    yield dbConfig_1.default.execute(sq, values);
    return;
});
exports.createBlog = createBlog;
const getBlog = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const sq = "SELECT b.id as id,b.title as title,b.content as content,u.id as userId,b.created_at as date FROM blogs b JOIN users u on b.userId=u.id WHERE b.id=(?)";
    const values = [id];
    const [rows] = yield dbConfig_1.default.execute(sq, values);
    if (rows.length === 0) {
        return null;
    }
    const blog = {
        userId: rows[0].userId,
    };
    return blog;
});
exports.getBlog = getBlog;
const updateBlog = (credentials) => __awaiter(void 0, void 0, void 0, function* () {
    const sq = "UPDATE blogs SET title=(?),content=(?) WHERE id=(?)";
    const values = [credentials.title, credentials.content, credentials.blogId];
    yield dbConfig_1.default.execute(sq, values);
    return;
});
exports.updateBlog = updateBlog;
const deleteBlog = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const sq = "DELETE FROM blogs WHERE id=(?)";
    const values = [id];
    yield dbConfig_1.default.execute(sq, values);
});
exports.deleteBlog = deleteBlog;
const getBlogs = () => __awaiter(void 0, void 0, void 0, function* () {
    const sq = "SELECT b.id as id,b.title as title,b.content as content,u.username as username,u.id as userId,b.created_at as date FROM blogs b JOIN users u on b.userId=u.id";
    const [rows] = yield dbConfig_1.default.execute(sq);
    const blogs = rows.map((row) => {
        return {
            blogId: row.id,
            userName: row.username,
            title: row.title,
            content: row.content,
            date: row.date,
            userId: row.userId,
        };
    });
    return blogs;
});
exports.getBlogs = getBlogs;
