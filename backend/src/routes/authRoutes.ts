import { Router } from "express";

import { signUp, logIn, logout } from "../controllers/authController";
import { isAuth } from "../util/isAuth";
import { body } from "express-validator";
const router = Router();

const signUpValidation = [body("userName", "Invalid userName").isLength({ min: 3 })]
const signUpOrSignInvalidation = [body("email", "Invalid email").isEmail(),
body("password", "Invalid password").isLength({ min: 8 })]


router.post("/register", signUpValidation, signUpOrSignInvalidation, signUp);
router.post("/login", signUpOrSignInvalidation, logIn);
router.post("/logout", isAuth, logout);

export default router;
