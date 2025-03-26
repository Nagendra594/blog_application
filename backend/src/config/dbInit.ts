import db from "./dbConfig";

export const createTables = async (): Promise<void> => {
  try {
    const userTable =
      "CREATE TABLE IF NOT EXISTS users(id int AUTO_INCREMENT PRIMARY KEY,username VARCHAR(255) NOT NULL,email VARCHAR(255) NOT NULL UNIQUE,password VARCHAR(255) NOT NULL)";
    await db.query(userTable);
    const blogsTable =
      "CREATE TABLE IF NOT EXISTS blogs(id int AUTO_INCREMENT PRIMARY KEY, userId int NOT NULL, title VARCHAR(255) NOT NULL, content TEXT NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,FOREIGN KEY (userId) REFERENCES users(id))";
    await db.query(blogsTable);
  } catch (err) {
    throw new Error("Error creating tables");
  }
};
