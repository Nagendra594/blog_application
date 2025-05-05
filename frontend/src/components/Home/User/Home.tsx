
import {

  Typography,
  Box,
  Button,
  Paper,
  Select,
  MenuItem,
  CircularProgress,

} from "@mui/material";
import Grid from "@mui/material/Grid"
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import useFetch from "../../../hooks/useFetch";
import { BlogModel } from "../../../models/BlogModel";
import { getBlogs } from "../../../services/BlogServices/blogServices";
import AddOrEditBlogModal from "../../BlogForm/AddOrEditBlog";
import BlogItem from "../../BlogItem/BlogItem";
import { createPortal } from "react-dom";
import { useSelector } from "react-redux";
import { UserSliceType } from "../../../store/UserSlice/UserSlice";


const UserDashboard = () => {
  const [viewFilter, setViewFilter] = useState<"my" | "all">("all");
  const [open, setOpen] = useState<boolean>(false);
  const { data: blogs, loading, error, fetchAgain } = useFetch<BlogModel[]>(getBlogs);
  const ctx = useSelector((state: { userState: UserSliceType, }) => state.userState)
  const filteredBlogs =
    viewFilter === "my"
      ? blogs.filter((blog) => blog.userid === ctx.userid)
      : blogs;
  const handleViewChange = (e: any) => {
    setViewFilter(e.target.value);
  };
  const BlogCompo = () => {
    if (loading) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" mt={4}>
          <CircularProgress />
        </Box>
      );
    } else if (error) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" mt={4}>
          <Typography sx={{ color: "red" }}>{error}</Typography>
        </Box>
      );
    }

    return <Grid container spacing={2}>
      {filteredBlogs.map((blog) => (
        <Grid key={blog.blogid}>
          <Box sx={{ height: "100%" }}>
            <BlogItem blog={blog} fetchPosts={fetchAgain} />
          </Box>
        </Grid>

      ))}

      {filteredBlogs.length === 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
          No blogs found.
        </Typography>
      )}
    </Grid>
  };




  return <Grid container spacing={3} sx={{ p: 3, marginTop: "70px", flexDirection: "column" }}>
    <Grid >
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Profile Info
        </Typography>
        <Box display="flex" flexDirection="column" gap={1}>
          <Typography>
            <strong>Name:</strong> {ctx.username}
          </Typography>
          <Typography>
            <strong>Email:</strong> {ctx.email}
          </Typography>
        </Box>
      </Paper>
    </Grid>

    {/* Blogs Section */}
    <Grid >
      <Paper sx={{ p: 3 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6">Blogs</Typography>
          <Box display="flex" alignItems="center" gap={2}>

            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)} >
              Add New Blog
            </Button>
            {createPortal(<AddOrEditBlogModal
              open={open}
              handleClose={() => setOpen(false)}
              blog={null}
              fetch={fetchAgain}
            />, document.getElementById("modal")!)}

            <Select
              size="small"
              value={viewFilter}
              onChange={handleViewChange}
            >
              <MenuItem value="all">All Blogs</MenuItem>
              <MenuItem value="my">My Blogs</MenuItem>
            </Select>
          </Box>
        </Box>
        <BlogCompo />
      </Paper>
    </Grid>
  </Grid >

}



export default UserDashboard;

