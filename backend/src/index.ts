import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser"

import dotenv from "dotenv";
import multer from "multer";
import path from "path";


import blogRoutes from "./routes/blogRoutes";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";
import { customError } from "./types/error.type";
import { setupSwagger } from "./swagger";
dotenv.config()

export const app = express();


app.use(
  cors({
    origin: process.env.ORIGIN,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  })
);
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + file.originalname);
  }
})
const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  const allowedTypes = ["image/jpeg", "image/png"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("File format not supported"));
  }

}
setupSwagger(app);
app.use(multer({ storage: storage, fileFilter: fileFilter }).single("image"))
app.use(express.json());
app.use(cookieParser());
app.use("/api/uploads", express.static(path.join(__dirname, "uploads")))

app.use("/api/blogs", blogRoutes);
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);


app.use((err: customError, req: Request, res: Response, next: NextFunction): void => {
  res.status(err.status || 500).json(err.message || "server error");
  return;
});



