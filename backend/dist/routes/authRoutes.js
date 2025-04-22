"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const isAuth_1 = require("../middlewares/isAuth");
const express_validator_1 = require("express-validator");
const router = (0, express_1.Router)();
const signUpValidation = [(0, express_validator_1.body)("userName", "Invalid userName").isLength({ min: 3 })];
const signUpOrSignInvalidation = [
    (0, express_validator_1.body)("email", "Invalid email").isEmail(),
    (0, express_validator_1.body)("password", "Invalid password").isLength({ min: 8 }),
];
router.post("/register", signUpValidation, signUpOrSignInvalidation, authController_1.signUp);
router.post("/login", signUpOrSignInvalidation, authController_1.logIn);
router.post("/logout", isAuth_1.isAuth, authController_1.logout);
exports.default = router;
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication routes
 */
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userName
 *               - email
 *               - password
 *             properties:
 *               userName:
 *                 type: string
 *                 example: Testuser
 *               email:
 *                 type: string
 *                 example: test@gmail.com
 *               password:
 *                 type: string
 *                 example: testpass123
 *     responses:
 *       201:
 *         description: User registered successfully
 *       422:
 *         description: Invalid input
 *       409:
 *         description: User already exists
 *       500:
 *         description: Internal server error
 *
 */
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: u@gmail.com
 *               password:
 *                 type: string
 *                 example: 11111111
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       401:
 *         description: Invalid credentials
 *       404:
 *         description: No User found
 *       422:
 *         description: validation Error
 */
/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Log out the current user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 *       401:
 *         description: Unauthorized
 */ 
