"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const isAuth_1 = require("../middlewares/isAuth");
const role_1 = require("../middlewares/role");
const role_type_1 = require("../types/role.type");
const router = (0, express_1.Router)();
router.get("/", isAuth_1.isAuth, (0, role_1.checkRole)([role_type_1.roles.admin, role_type_1.roles.user]), userController_1.getById);
router.get("/allUsers", isAuth_1.isAuth, (0, role_1.checkRole)([role_type_1.roles.admin]), userController_1.getAllUsers);
router.delete("/:id", isAuth_1.isAuth, (0, role_1.checkRole)([role_type_1.roles.admin]), userController_1.deleteUser);
exports.default = router;
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
