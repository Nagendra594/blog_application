
import express from "express"

import { getById } from "../controllers/userController";
import { isAuth } from "../util/isAuth"
const router = express.Router();

router.get("/", isAuth, getById);

export default router;
