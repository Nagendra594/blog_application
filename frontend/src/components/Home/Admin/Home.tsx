import {

    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Grid,
    Divider,
} from "@mui/material";
import { useContext, useEffect } from "react";
import { AdminContext } from "../../../context/AdmindataCtx/adminDataContext";

import { APIResponseModel } from "../../../types/APIResponseModel";
import { getAllUsers } from "../../../services/UserServices/userServices";
import { useNavigate } from "react-router-dom";
import { UserModel } from "../../../models/UserModel";
import { getBlogs } from "../../../services/BlogServices/blogServices";
import { BlogModel } from "../../../models/BlogModel";
import UserItem from "../../UserItem/UserItem";

import AdminBlogItem from "../../AdminBlog/AdminBlog";


const AdminDashboard = () => {
    const adminCtx = useContext(AdminContext);


    const navigate = useNavigate();


    const unAuthorizeHandle = () => {
        localStorage.clear();
        navigate("/login");
    };
    const fetchData = async () => {
        adminCtx.setData({ loading: true, error: null });
        const response1: APIResponseModel<UserModel[]> = await getAllUsers();
        const response2: APIResponseModel<BlogModel[]> = await getBlogs(null);
        if (response1.status === 401 || response1.status === 403 || response2.status === 401 || response2.status === 403) {
            unAuthorizeHandle();
            return;
        }

        if (response1.status !== 200 || response2.status !== 200) {
            adminCtx.setData({ loading: false, error: "Failed to fetch data" });
            return;
        }
        adminCtx.setData({ loading: false, error: null, data: [response1.data!, response2.data!] })
        return;
    }


    useEffect(() => {
        fetchData();
    }, []);

    return <Grid container spacing={3} sx={{ p: 3, display: "flex" }}>
        {adminCtx.error && <Typography>{adminCtx.error}</Typography>}
        <Grid sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ textAlign: "center" }} gutterBottom>
                Manage Users
            </Typography>
            {adminCtx.data[0]?.length === 0 ? <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
                No users found.
            </Typography> :
                <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
                    <Table stickyHeader size="small" aria-label="user table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {adminCtx.data[0]?.map((user) => (
                                <UserItem user={user} fetchData={fetchData} key={user.userid} />
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            }

        </Grid>
        <Divider orientation="vertical" flexItem />
        <Grid sx={{ flex: 1 }} >
            <Typography variant="h6" sx={{ textAlign: "center" }} gutterBottom>
                Manage Blogs
            </Typography>
            {adminCtx.data[1]?.length === 0 ? <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
                No Blogs found.
            </Typography> :
                <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
                    <Table stickyHeader size="small" aria-label="blog table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Title</TableCell>
                                <TableCell>Author</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {adminCtx.data[1]?.map((blog) => (
                                <AdminBlogItem blog={blog} fetch={fetchData} key={blog.blogid} />
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            }

        </Grid>
    </Grid>

}

export default AdminDashboard