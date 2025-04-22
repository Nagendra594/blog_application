import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { deleteBlog } from "../../services/BlogServices/blogServices";
import { BlogModel } from "../../models/BlogModel";
import { APIResponseModel } from "../../types/APIResponseModel";
import UserContext from "../../context/UserDataCtx/userContext";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddOrEditBlogModal from "../BlogForm/AddOrEditBlog";

import { Card, CardContent, Typography, Button, CardMedia, CardActions, IconButton, CircularProgress } from "@mui/material";
import { createPortal } from "react-dom";

interface BlogProps {
  blog: BlogModel;
  fetchPosts: (singal: any) => void;
}

const BlogItem: React.FC<BlogProps> = ({ blog, fetchPosts }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const ctx = useContext(UserContext);

  const deleteHandler = async (id: string) => {
    setLoading(true);
    setError(null);
    const response: APIResponseModel<null> = await deleteBlog(id);
    setLoading(false);

    if (response.status === 401 || response.status === 403) {
      localStorage.clear();
      navigate("/login");
      return;
    }
    if (response.status !== 200) {
      setError("Failed to delete blog");
      return;
    }
    fetchPosts(null);
  };

  const date: string = blog.date as unknown as string;
  let blogImage = blog.image?.toString();
  if (typeof blogImage === "string") {
    blogImage = blogImage.replaceAll(" ", "%20");
  }

  return <Card
    sx={{
      height: "400px",
      width: "400px ",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      borderRadius: 2,
      boxShadow: 2,
      overflow: "hidden",
    }}
  >
    <CardMedia
      component="img"
      image={`${process.env.API_URL}${blogImage}`}
      alt={blog.title}
      sx={{
        width: "100%",
        height: "40%",
        objectFit: "cover",
      }}
    />

    <CardContent sx={{ flexGrow: 1 }}>
      {error && (
        <Typography sx={{ color: "red", fontSize: "1rem", mb: 1 }}>
          {error}
        </Typography>
      )}

      <Typography variant="h6" gutterBottom>
        {blog.title}
      </Typography>

      <Typography variant="body2">{typeof date === "string" && date.split("T")[0]}</Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          mt: 1,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {blog.content}
      </Typography>

      <Typography variant="caption" sx={{ mt: 1, display: "block" }}>
        Author: {blog.username}
      </Typography>
    </CardContent>
    {createPortal(<AddOrEditBlogModal
      open={open}
      handleClose={() => setOpen(false)}
      blog={blog}
      fetch={fetchPosts}
    />, document.getElementById("modal")!)}

    {ctx.userid === blog.userid && (
      <CardActions
        sx={{
          justifyContent: "space-between",
          mt: "auto",
          px: 2,
          pb: 2,
        }}
      >
        <IconButton onClick={() => setOpen(true)} color="primary" data-testid="edit">
          <EditIcon />
        </IconButton>

        <Button
          onClick={() => deleteHandler(blog.blogid)}
          variant="contained"
          color="error"
          size="small"
          disabled={loading}
          data-testid="delete"
        >
          {loading ? <CircularProgress data-testid="progress" /> : <DeleteIcon />}
        </Button>
      </CardActions>
    )}
  </Card>






};

export default BlogItem;
