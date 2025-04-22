import db from "../config/dbConfig";

import { UserModel } from "../models/userModel";
export const createUser = async (credentials: Partial<UserModel>): Promise<void> => {
  const sq = "INSERT INTO users (username,email,password) VALUES ($1,$2,$3)";
  const values = [
    credentials.username,
    credentials.email,
    credentials.password,
  ];
  await db.query(sq, values);
  return;
};


export const getUserByIdOrEmail = async (id?: string, email?: string): Promise<UserModel | null> => {
  let sq = "SELECT userid,username,email,role FROM users WHERE userid=$1";
  let values: [string];
  if (email) {
    sq = "SELECT userid,username,email,password,role FROM users WHERE email=$1";
    values = [email];
  } else {
    values = [id!];
  }
  const { rows } = await db.query(sq, values);
  if (rows.length === 0) {
    return null;
  }

  return rows[0];
};

export const deleteUser = async (id: string) => {
  const sq = "DELETE FROM users WHERE userid=$1";
  const values: [string] = [id];
  await db.query(sq, values);
  return;
}

export const getAllUsers = async (): Promise<Partial<UserModel>[]> => {
  const sq = "SELECT userid,username,email FROM users WHERE role=$1";
  const values: [string] = ["user"];
  const { rows } = await db.query(sq, values);
  return rows as unknown as UserModel[];

}