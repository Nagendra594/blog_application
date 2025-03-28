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
const insertBlog = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, content } = req.body;
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
        const userId = Number(req.userId);
        const blogData = {
            userId,
            title,
            content
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
    const userId = Number(req.userId);
    const updatedBlog = {
        blogId: Number(id),
        title,
        content
    };
    try {
        if (ERR.length > 0) {
            const error = {
                message: "Please provide valid detials",
                status: 422,
                name: "Invalid details"
            };
            throw error;
        }
        const blog = yield (0, blogServices_1.getBlog)(Number(id));
        if (!blog) {
            const error = {
                name: "Not Found",
                message: "No blog found",
                status: 404
            };
            throw error;
        }
        if (blog.userId !== userId) {
            const error = {
                message: "Invalid user",
                status: 422,
                name: "Incorrect user"
            };
            throw error;
        }
        yield (0, blogServices_1.updateBlog)(updatedBlog);
        res.status(200).json({ message: "update success" });
        return;
    }
    catch (err) {
        next(err);
    }
});
exports.updateUserBlog = updateUserBlog;
const deleteUserBlog = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const userId = Number(req.userId);
    try {
        const blog = yield (0, blogServices_1.getBlog)(Number(id));
        if (!blog) {
            const error = {
                name: "Not Found",
                message: "No blog found",
                status: 404
            };
            throw error;
        }
        if (blog.userId !== userId) {
            const error = {
                message: "Invalid user",
                status: 422,
                name: "Incorrect user"
            };
            throw error;
        }
        yield (0, blogServices_1.deleteBlog)(Number(id));
        res.status(200).json({ message: "deleted success" });
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
