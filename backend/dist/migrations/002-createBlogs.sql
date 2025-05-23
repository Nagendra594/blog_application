CREATE TABLE IF NOT EXISTS blogs (
  blogid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  userid UUID NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  image VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE
);