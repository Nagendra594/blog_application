import express from "express"

import { getById, getAllUsers, deleteUser } from "../controllers/userController";
import { isAuth } from "../middlewares/isAuth"
import { checkRole } from "../middlewares/role";
import { roles } from "../types/role.type";
const router = express.Router();

router.get("/", isAuth, checkRole([roles.admin, roles.user]), getById);
router.get("/allUsers", isAuth, checkRole([roles.admin]), getAllUsers);
router.patch("/:id", isAuth, checkRole([roles.admin]), deleteUser)
export default router;

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management Routes
 */


/**
 * @swagger
 * /api/user:
 *   get:
 *     summary: Get current logged-in user details
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: User details retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: No user found
 * 
 * 
 */

/**
 * @swagger
 * /api/user/allUsers:
 *   get:
 *     summary: Get all users (admin only)
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of all users
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

/**
 * @swagger
 * /api/user/{id}:
 *   patch:
 *     summary: Delete a user by ID (admin only)
 *     tags: [Users]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: User ID to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted/disabled successfully
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 */
