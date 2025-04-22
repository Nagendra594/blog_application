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
    const sq = "INSERT INTO blogs(userid,title,content,image) VALUES($1,$2,$3,$4)";
    const values = [credentials.userid, credentials.title, credentials.content, credentials.image];
    yield dbConfig_1.default.query(sq, values);
    return;
});
exports.createBlog = createBlog;
const getBlog = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const sq = "SELECT b.userid as userid,b.image as image FROM blogs b WHERE b.blogid=($1)";
    const values = [id];
    const { rows } = yield dbConfig_1.default.query(sq, values);
    if (rows.length === 0) {
        return null;
    }
    return rows[0];
});
exports.getBlog = getBlog;
const updateBlog = (credentials) => __awaiter(void 0, void 0, void 0, function* () {
    let sq = "UPDATE blogs SET title=($1),content=($2) WHERE blogid=($3)";
    let values = [credentials.title, credentials.content, credentials.blogid];
    if (credentials.image) {
        sq = "UPDATE blogs SET title=($1),content=($2),image=($3) WHERE blogid=($4)";
        values = [credentials.title, credentials.content, credentials.image, credentials.blogid];
    }
    yield dbConfig_1.default.query(sq, values);
    return;
});
exports.updateBlog = updateBlog;
const deleteBlog = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const sq = "DELETE FROM blogs WHERE blogid=($1)";
    const values = [id];
    yield dbConfig_1.default.query(sq, values);
});
exports.deleteBlog = deleteBlog;
const getBlogs = () => __awaiter(void 0, void 0, void 0, function* () {
    const sq = "SELECT b.blogid,b.title as title,b.content as content,b.image as image,u.username as username,u.userid as userid,b.created_at as date FROM blogs b JOIN users u on b.userid=u.userid ORDER BY b.created_at DESC";
    const { rows } = yield dbConfig_1.default.query(sq);
    return rows;
});
exports.getBlogs = getBlogs;
