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
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import UserItem from "../../UserItem/UserItem";

import AdminBlogItem from "../../AdminBlog/AdminBlog";
import { adminActions, AdminSliceType, fetchAdminDataThunk } from "../../../store/AdminDataSlice/AdminDataSlice";
import { AppDispatch } from "../../../store/store";

const AdminDashboard = () => {
    const adminCtx = useSelector((state: { AdminDataState: AdminSliceType }) => state.AdminDataState);
    const dispatch = useDispatch<AppDispatch>();

    console.log(adminCtx)
    const navigate = useNavigate();


    const unAuthorizeHandle = () => {
        localStorage.clear();
        navigate("/login");
    };



    useEffect(() => {
        dispatch(fetchAdminDataThunk());
    }, []);

    useEffect(() => {
        if (adminCtx.error === "UnAuthenticated") {
            unAuthorizeHandle();
            dispatch(adminActions.reset());
        }
    }, [adminCtx])
    console.log(adminCtx.error)

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
                                <UserItem user={user} key={user.userid} />
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
                                <AdminBlogItem blog={blog} key={blog.blogid} />
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            }

        </Grid>
    </Grid>

}

export default AdminDashboard