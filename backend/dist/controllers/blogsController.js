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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllBlogs = exports.deleteUserBlog = exports.updateUserBlog = exports.insertBlog = void 0;
const blogServices_1 = require("../services/blogServices");
const express_validator_1 = require("express-validator");
const file_1 = require("../util/file");
const insertBlog = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { title, content } = req.body;
    const image = "uploads/" + ((_a = req.file) === null || _a === void 0 ? void 0 : _a.filename);
    const valiRes = (0, express_validator_1.validationResult)(req);
    const ERR = valiRes.array();
    try {
        if (ERR.length > 0) {
            const error = {
                message: "Please provide valid detials",
                status: 422,
                name: "Invalid details"
            };
            throw error;
        }
        const userid = req.userId;
        const blogData = {
            userid,
            title,
            content,
            image
        };
        yield (0, blogServices_1.createBlog)(blogData);
        res.status(201).json({ message: "blog created" });
        return;
    }
    catch (err) {
        next(err);
    }
});
exports.insertBlog = insertBlog;
const updateUserBlog = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, content } = req.body;
    const { id } = req.params;
    const valiRes = (0, express_validator_1.validationResult)(req);
    const ERR = valiRes.array();
    try {
        if (ERR.length > 0) {
            const error = {
                message: "Please provide valid detials",
                status: 422,
                name: "Invalid details"
            };
            throw error;
        }
        const userId = req.userId;
        const blog = yield (0, blogServices_1.getBlog)(id);
        if (!blog) {
            const error = {
                name: "Not Found",
                message: "No blog found",
                status: 404
            };
            throw error;
        }
        if (blog.userid !== userId && req.role !== "admin") {
            const error = {
                message: "Invalid user",
                status: 403,
                name: "Incorrect user"
            };
            throw error;
        }
        let updatedBlog = {
            blogid: id,
            title,
            content,
        };
        yield (0, blogServices_1.updateBlog)(updatedBlog);
        res.status(200).json({ message: "update success" });
        if (req.file) {
            const image = "uploads/" + req.file.filename;
            updatedBlog.image = image;
            (0, file_1.deleteFile)(blog.image);
        }
        return;
    }
    catch (err) {
        next(err);
    }
});
exports.updateUserBlog = updateUserBlog;
const deleteUserBlog = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const userId = req.userId;
    try {
        const blog = yield (0, blogServices_1.getBlog)(id);
        if (!blog) {
            const error = {
                name: "Not Found",
                message: "No blog found",
                status: 404
            };
            throw error;
        }
        if (blog.userid !== userId && req.role !== "admin") {
            const error = {
                message: "Invalid user",
                status: 403,
                name: "Incorrect user"
            };
            throw error;
        }
        yield (0, blogServices_1.deleteBlog)(id);
        const imagepath = blog.image;
        res.status(200).json({ message: "deleted success" });
        (0, file_1.deleteFile)(imagepath);
        return;
    }
    catch (err) {
        next(err);
    }
});
exports.deleteUserBlog = deleteUserBlog;
const getAllBlogs = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const blogs = yield (0, blogServices_1.getBlogs)();
        res.status(200).json(blogs);
    }
    catch (err) {
        next(err);
    }
});
exports.getAllBlogs = getAllBlogs;
