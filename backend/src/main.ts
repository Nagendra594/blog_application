import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser"

import dotenv from "dotenv";


import db from "./config/dbConfig";
import blogRoutes from "./routes/blogRoutes";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";
import { customError } from "./models/errorModel";
import { createTables } from "./config/dbInit";
dotenv.config()

const app = express();

app.use(
  cors({
    origin: process.env.ORIGIN,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/blogs", blogRoutes);
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);


app.use((err: customError, req: Request, res: Response, next: NextFunction): void => {
  res.status(err.status || 500).json(err.message || "server error");
  return;
});


const server = async () => {
  try {
    const connection = await db.getConnection();
    connection.release();
    await createTables();
    console.log("connected to db")
    app.listen(8080);
  } catch (err) {
    console.log(err)
  }
}
server();
