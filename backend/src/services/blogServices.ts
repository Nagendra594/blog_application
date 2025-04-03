
import db from "../config/dbConfig";
import { RowDataPacket } from "mysql2";

import { BlogModel } from "../models/blogModel";



export const createBlog = async (credentials: Partial<BlogModel>): Promise<void> => {
  const sq = "INSERT INTO blogs(userId,title,content,image) VALUES(?,?,?,?)";
  const values = [credentials.userId, credentials.title, credentials.content,credentials.image];
  await db.execute(sq, values);
  return;
};

export const getBlog = async (id: number): Promise<Partial<BlogModel> | null> => {
  const sq = "SELECT b.userId as userId,b.image as image FROM blogs b WHERE b.id=(?)";
  const values = [id];
  const [rows] = await db.execute<RowDataPacket[]>(sq, values);
  if (rows.length === 0) {
    return null;
  }
  const blog: Partial<BlogModel> = {
    userId: rows[0].userId,
    image:rows[0].image
  };
  return blog;
};
export const updateBlog = async (credentials: Partial<BlogModel>): Promise<void> => {
  let sq = "UPDATE blogs SET title=(?),content=(?) WHERE id=(?)";
  let values=[credentials.title, credentials.content, credentials.blogId];
  if(credentials.image){
    sq="UPDATE blogs SET title=(?),content=(?),image=(?) WHERE id=(?)";
    values=[credentials.title, credentials.content, credentials.image,credentials.blogId];
  }
  await db.execute(sq, values);
  return;

};
export const deleteBlog = async (id: number): Promise<void> => {
  const sq = "DELETE FROM blogs WHERE id=(?)";
  const values = [id];
  await db.execute(sq, values);

};

export const getBlogs = async (): Promise<BlogModel[]> => {
  const sq =
    "SELECT b.id as id,b.title as title,b.content as content,b.image as image,u.username as username,u.id as userId,b.created_at as date FROM blogs b JOIN users u on b.userId=u.id";
  const [rows] = await db.execute<RowDataPacket[]>(sq);

  const blogs: BlogModel[] = rows.map((row) => {
    return {
      blogId: row.id,
      userName: row.username,
      title: row.title,
      content: row.content,
      date: row.date,
      userId: row.userId,
      image:row.image
    };
  });
  return blogs;
};
