
import db from "../config/dbConfig";

import { BlogModel } from "../models/blogModel";



export const createBlog = async (credentials: Partial<BlogModel>): Promise<void> => {
  const sq = "INSERT INTO blogs(userid,title,content,image) VALUES($1,$2,$3,$4)";
  const values = [credentials.userid, credentials.title, credentials.content, credentials.image];
  await db.query(sq, values);
  return;
};


export const getBlog = async (id: string): Promise<Partial<BlogModel> | null> => {
  const sq = "SELECT b.userid as userid,b.image as image FROM blogs b WHERE b.blogid=($1)";
  const values = [id];
  const { rows } = await db.query(sq, values);
  if (rows.length === 0) {
    return null;
  }

  return rows[0];
};


export const updateBlog = async (credentials: Partial<BlogModel>): Promise<void> => {
  let sq = "UPDATE blogs SET title=($1),content=($2) WHERE blogid=($3)";
  let values = [credentials.title, credentials.content, credentials.blogid];
  if (credentials.image) {
    sq = "UPDATE blogs SET title=($1),content=($2),image=($3) WHERE blogid=($4)";
    values = [credentials.title, credentials.content, credentials.image, credentials.blogid];
  }
  await db.query(sq, values);
  return;
};


export const deleteBlog = async (id: string): Promise<void> => {
  const sq = "DELETE FROM blogs WHERE blogid=($1)";
  const values = [id];
  await db.query(sq, values);
};


export const getBlogs = async (): Promise<BlogModel[]> => {
  const sq =
    "SELECT b.blogid,b.title as title,b.content as content,b.image as image,u.username as username,u.userid as userid,b.created_at as date FROM blogs b JOIN users u on b.userid=u.userid ORDER BY b.created_at DESC";
  const { rows } = await db.query(sq);
  return rows;
};
