

import { Router } from "express";
const router = Router();
import { body } from "express-validator";
import { insertBlog, getAllBlogs, updateUserBlog, deleteUserBlog } from "../controllers/blogsController"
import { isAuth } from "../middlewares/isAuth";
import { checkRole } from "../middlewares/role";
import { roles } from "../types/role.type";


const insertOrUpdateBlogValidation = [body("title", "Invalid Title").isLength({ min: 3 }), body("content", "Invalid Content").isLength({ min: 3 })];


router.post("/", isAuth, insertOrUpdateBlogValidation, checkRole([roles.user, roles.admin]), insertBlog);
router.get("/", isAuth, checkRole([roles.user, roles.admin]), getAllBlogs);
router.patch("/:id", isAuth, insertOrUpdateBlogValidation, checkRole([roles.user, roles.admin]), updateUserBlog);
router.delete("/:id", isAuth, checkRole([roles.admin, roles.user]), deleteUserBlog);

export default router;


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