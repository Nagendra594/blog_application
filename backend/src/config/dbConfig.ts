import {Pool}from "pg";
import dotenv from "dotenv";
dotenv.config();
const pool= new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB,
  port: Number(process.env.DB_PORT),
});

export default pool;