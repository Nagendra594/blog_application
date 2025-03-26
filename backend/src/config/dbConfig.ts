import mySql2 from "mysql2";
import dotenv from "dotenv";
import { Pool } from "mysql2/typings/mysql/lib/Pool";
dotenv.config();
const pool: Pool = mySql2.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB,
});

export default pool.promise();