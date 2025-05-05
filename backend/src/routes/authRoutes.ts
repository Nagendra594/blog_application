import { Router } from "express";
import { signUp, logIn, logout } from "../controllers/authController";
import { isAuth } from "../middlewares/isAuth";
import { body } from "express-validator";

const router = Router();

const signUpValidation = [body("userName", "Invalid userName").isLength({ min: 3 })];
const signUpOrSignInvalidation = [
    body("email", "Invalid email").isEmail(),
    body("password", "Invalid password").isLength({ min: 8 }),
];

router.post("/register", signUpValidation, signUpOrSignInvalidation, signUp);
router.post("/login", signUpOrSignInvalidation, logIn);
router.post("/logout", isAuth, logout);

export default router;

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
 *     responses:
 *       200:
 *         description: Logged out successfully
 *       401:
 *         description: Unauthorized
 */