"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const isAuth_1 = require("../util/isAuth");
const express_validator_1 = require("express-validator");
const router = (0, express_1.Router)();
const signUpValidation = [(0, express_validator_1.body)("userName", "Invalid userName").isLength({ min: 3 })];
const signUpOrSignInvalidation = [(0, express_validator_1.body)("email", "Invalid email").isEmail(),
    (0, express_validator_1.body)("password", "Invalid password").isLength({ min: 8 })];
router.post("/register", signUpValidation, signUpOrSignInvalidation, authController_1.signUp);
router.post("/login", signUpOrSignInvalidation, authController_1.logIn);
router.post("/logout", isAuth_1.isAuth, authController_1.logout);
exports.default = router;
