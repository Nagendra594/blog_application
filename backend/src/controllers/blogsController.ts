
import { createBlog, updateBlog, deleteBlog, getBlog, getBlogs } from "../services/blogServices"
import { Response, NextFunction } from "express";
import { ModReq } from "../models/customReqModel"
import { BlogModel } from "../models/blogModel";
import { validationResult } from "express-validator";
import { customError } from "../models/errorModel";
import { deleteFile } from "../util/file";


export const insertBlog = async (req: ModReq, res: Response, next: NextFunction): Promise<void> => {
  const { title, content } = req.body;
  const image="uploads/"+req.file?.filename;
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
    const userId: number = Number(req.userId!);
    const blogData: Partial<BlogModel> = {
      userId,
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
    const userId: number = Number(req.userId!);
    
    const blog: Partial<BlogModel> | null = await getBlog(Number(id));
    if (!blog) {
      const error: customError = {
        name: "Not Found",
        message: "No blog found",
        status: 404
      }
      throw error;
    }
    if (blog.userId !== userId) {
      const error: customError = {
        message: "Invalid user",
        status: 422,
        name: "Incorrect user"
      }
      throw error;
    }
    let updatedBlog: Partial<BlogModel> = {
      blogId: Number(id),
      title,
      content,
    }
    if(req.file){
      const image="uploads/"+req.file.filename;
      updatedBlog.image=image;
      deleteFile(blog.image!);
    }
    await updateBlog(updatedBlog);
    res.status(200).json({ message: "update success" });
    return;
  } catch (err) {
    next(err);
  }
};

export const deleteUserBlog = async (req: ModReq, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  const userId: number = Number(req.userId!);
  try {
    const blog: Partial<BlogModel> | null = await getBlog(Number(id));
    if (!blog) {
      const error: customError = {
        name: "Not Found",
        message: "No blog found",
        status: 404
      }
      throw error;
    }
    if (blog.userId !== userId) {
      const error: customError = {
        message: "Invalid user",
        status: 422,
        name: "Incorrect user"
      }
      throw error;
    }
    await deleteBlog(Number(id));
    const imagepath=blog.image;
    deleteFile(imagepath!);
    res.status(200).json({ message: "deleted success" });
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
