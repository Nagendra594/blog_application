"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const express_validator_1 = require("express-validator");
const blogsController_1 = require("../controllers/blogsController");
const isAuth_1 = require("../middlewares/isAuth");
const role_1 = require("../middlewares/role");
const role_type_1 = require("../types/role.type");
const insertOrUpdateBlogValidation = [(0, express_validator_1.body)("title", "Invalid Title").isLength({ min: 3 }), (0, express_validator_1.body)("content", "Invalid Content").isLength({ min: 3 })];
router.post("/", isAuth_1.isAuth, insertOrUpdateBlogValidation, (0, role_1.checkRole)([role_type_1.roles.user, role_type_1.roles.admin]), blogsController_1.insertBlog);
router.get("/", isAuth_1.isAuth, (0, role_1.checkRole)([role_type_1.roles.user, role_type_1.roles.admin]), blogsController_1.getAllBlogs);
router.patch("/:id", isAuth_1.isAuth, insertOrUpdateBlogValidation, (0, role_1.checkRole)([role_type_1.roles.user, role_type_1.roles.admin]), blogsController_1.updateUserBlog);
router.delete("/:id", isAuth_1.isAuth, (0, role_1.checkRole)([role_type_1.roles.admin, role_type_1.roles.user]), blogsController_1.deleteUserBlog);
exports.default = router;
/**
 * @swagger
 * tags:
 *   name: Blogs
 *   description: Blog management routes
 */
/**
 * @swagger
 * /api/blogs:
 *   post:
 *     summary: Create a new blog post
 *     tags: [Blogs]
 *     requestBody:
 *       required: true
 *       content:
 *        multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *               - image
 *             properties:
 *               title:
 *                 type: string
 *                 example: My First Blog
 *               content:
 *                 type: string
 *                 example: This is the content of the blog.
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Blog created successfully
 *       401:
 *         description: Unauthorized
 *       422:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */
/**
 * @swagger
 * /api/blogs:
 *   get:
 *     summary: Get all blog posts
 *     tags: [Blogs]
 *     responses:
 *       200:
 *         description: List of blogs
 *       401:
 *         description: Unauthorized
 */
/**
 * @swagger
 * /api/blogs/{id}:
 *   patch:
 *     summary: Update a user's blog post
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Updated Blog Title
 *               content:
 *                 type: string
 *                 example: Updated blog content
 *     responses:
 *       200:
 *         description: Blog updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Blog not found
 *       403:
 *         description: Forbidden
 *       422:
 *         description: Invalid input
 */
/**
 * @swagger
 * /api/blogs/{id}:
 *   delete:
 *     summary: Delete a blog post
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog ID
 *     responses:
 *       200:
 *         description: Blog deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Blog not found
 */ 
