"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const isAuth_1 = require("../util/isAuth");
const router = express_1.default.Router();
router.get("/", isAuth_1.isAuth, userController_1.getById);
exports.default = router;
