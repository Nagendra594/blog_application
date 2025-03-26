import db from "../config/dbConfig";
import { RowDataPacket } from "mysql2";

import { UserModel } from "../models/userModel";
export const createUser = async (credentials: Partial<UserModel>): Promise<void> => {
  const sq = "INSERT INTO users (username,email,password) VALUES (?,?,?)";
  const values = [
    credentials.userName,
    credentials.email,
    credentials.password,
  ];
  await db.execute<RowDataPacket[]>(sq, values);
  return;
};


export const getUserByIdOrEmail = async (id?: number, email?: string): Promise<UserModel | null> => {
  let sq = "SELECT id,userName,email FROM users WHERE id=?";
  let values: [number | string];
  if (email) {
    sq = "SELECT id,userName,email,password FROM users WHERE email=?";
    values = [email];
  } else {
    values = [id!];
  }
  const [rows] = await db.execute<RowDataPacket[]>(sq, values);
  if (rows.length === 0) {
    return null;
  }
  const user: UserModel = {
    userId: rows[0].id,
    userName: rows[0].userName,
    email: rows[0].email,
    password: rows[0]?.password,
  };
  return user;
};

