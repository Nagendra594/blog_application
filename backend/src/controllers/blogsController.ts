
import { createBlog, updateBlog, deleteBlog, getBlog, getBlogs } from "../services/blogServices"
import { Response, NextFunction } from "express";
import { ModReq } from "../types/customReq.type"
import { BlogModel } from "../models/blogModel";
import { validationResult } from "express-validator";
import { customError } from "../types/error.type";
import { deleteFile } from "../util/file";


export const insertBlog = async (req: ModReq, res: Response, next: NextFunction): Promise<void> => {
  const { title, content } = req.body;
  const image = "uploads/" + req.file?.filename;
  const valiRes = validationResult(req);
  const ERR = valiRes.array();
  try {
    if (ERR.length > 0) {
      const error: customError = {
        message: "Please provide valid detials",
        status: 422,
        name: "Invalid details"
      }
      throw error;
    }
    const userid: string = req.userId!;
    const blogData: Partial<BlogModel> = {
      userid,
      title,
      content,
      image

    }

    await createBlog(blogData);
    res.status(201).json({ message: "blog created" });
    return;
  } catch (err) {
    next(err);
  }
};



export const updateUserBlog = async (req: ModReq, res: Response, next: NextFunction): Promise<void> => {
  const { title, content } = req.body;
  const { id } = req.params;
  const valiRes = validationResult(req);

  const ERR = valiRes.array();
  try {
    if (ERR.length > 0) {
      const error: customError = {
        message: "Please provide valid detials",
        status: 422,
        name: "Invalid details"
      }
      throw error;
    }
    const userId: string = req.userId!;

    const blog: Partial<BlogModel> | null = await getBlog(id);
    if (!blog) {
      const error: customError = {
        name: "Not Found",
        message: "No blog found",
        status: 404
      }
      throw error;
    }
    if (blog.userid !== userId && req.role !== "admin") {
      const error: customError = {
        message: "Invalid user",
        status: 403,
        name: "Incorrect user"
      }
      throw error;
    }
    let updatedBlog: Partial<BlogModel> = {
      blogid: id,
      title,
      content,
    }
    if (req.file) {
      const image = "uploads/" + req.file.filename;
      updatedBlog.image = image;

    }
    await updateBlog(updatedBlog);
    res.status(200).json({ message: "update success" });
    if (req.file) {

      deleteFile(blog.image!);

    }
    return;

  } catch (err) {
    next(err);
  }
};

export const deleteUserBlog = async (req: ModReq, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  const userId: string = req.userId!;
  try {
    const blog: Partial<BlogModel> | null = await getBlog(id);
    if (!blog) {
      const error: customError = {
        name: "Not Found",
        message: "No blog found",
        status: 404
      }
      throw error;
    }
    if (blog.userid !== userId && req.role !== "admin") {
      const error: customError = {
        message: "Invalid user",
        status: 403,
        name: "Incorrect user"
      }
      throw error;
    }
    await deleteBlog(id);
    const imagepath = blog.image;
    res.status(200).json({ message: "deleted success" });
    deleteFile(imagepath!);
    return;
  } catch (err) {
    next(err);
  }
};
export const getAllBlogs = async (req: ModReq, res: Response, next: NextFunction): Promise<void> => {
  try {
    const blogs: BlogModel[] = await getBlogs();
    res.status(200).json(blogs);
  } catch (err) {
    next(err);
  }
};
