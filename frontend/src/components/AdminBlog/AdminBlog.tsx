import { Button, CircularProgress, IconButton, TableCell, TableRow, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { BlogModel } from "../../models/BlogModel";
import { useState } from "react";
import AddOrEditBlogModal from "../BlogForm/AddOrEditBlog";
import { APIResponseModel } from "../../types/APIResponseModel";
import { deleteBlog } from "../../services/BlogServices/blogServices";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import { fetchAdminDataThunk } from "../../store/AdminDataSlice/AdminDataSlice";
interface AdminBlogItemProps {
    blog: BlogModel;
}

const AdminBlogItem: React.FC<AdminBlogItemProps> = ({ blog }) => {
    const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null)
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const deleteHandler = async (id: string) => {
        setLoading(true);
        setError(null)
        const response: APIResponseModel<null> = await deleteBlog(id);
        setLoading(false);

        if (response.status === 401) {
            localStorage.clear();
            navigate("/login");
            return;
        }
        if (response.status !== 200) {
            setError("Failed to delete blog");
            return;
        }
        dispatch(fetchAdminDataThunk());
    };
    return (

        <TableRow>
            {error && <Typography color="error">{error}</Typography>}
            {createPortal(<AddOrEditBlogModal
                open={open}
                handleClose={() => setOpen(false)}
                blog={blog}
                fetch={() => dispatch(fetchAdminDataThunk())}
            />, document.getElementById("modal")!)}
            <TableCell>{blog.title}</TableCell>
            <TableCell>{blog.username}</TableCell>
            <TableCell>
                <IconButton color="primary" onClick={() => setOpen(true)} data-testid="edit">
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
                    {loading ? <CircularProgress /> : <DeleteIcon />}
                </Button>
            </TableCell>


        </TableRow>



    );
};

export default AdminBlogItem;
