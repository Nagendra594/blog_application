import { Router } from "express";
const router = Router();
import { body } from "express-validator";
import { insertBlog, getAllBlogs, updateUserBlog, deleteUserBlog } from "../controllers/blogsController"
import { isAuth } from "../util/isAuth";


const insertOrUpdateBlogValidation = [body("title", "Invalid Title").isLength({ min: 3 }), body("content", "Invalid Content").isLength({ min: 3 })];


router.post("/", isAuth, insertOrUpdateBlogValidation, insertBlog);
router.get("/", isAuth, getAllBlogs);
router.patch("/:id", isAuth, insertOrUpdateBlogValidation, updateUserBlog);
router.delete("/:id", isAuth, deleteUserBlog);

export default router;
