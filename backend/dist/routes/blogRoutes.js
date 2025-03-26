"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const express_validator_1 = require("express-validator");
const blogsController_1 = require("../controllers/blogsController");
const isAuth_1 = require("../util/isAuth");
const insertOrUpdateBlogValidation = [(0, express_validator_1.body)("title", "Invalid Title").isLength({ min: 3 }), (0, express_validator_1.body)("content", "Invalid Content").isLength({ min: 3 })];
router.post("/", isAuth_1.isAuth, insertOrUpdateBlogValidation, blogsController_1.insertBlog);
router.get("/", isAuth_1.isAuth, blogsController_1.getAllBlogs);
router.patch("/:id", isAuth_1.isAuth, insertOrUpdateBlogValidation, blogsController_1.updateUserBlog);
router.delete("/:id", isAuth_1.isAuth, blogsController_1.deleteUserBlog);
exports.default = router;
