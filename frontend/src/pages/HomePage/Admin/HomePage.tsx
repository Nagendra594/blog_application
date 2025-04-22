import {
    AppBar,
    Toolbar,
    Typography,
    Avatar,
    Box,

    Button,
} from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";
import { APIResponseModel } from "../../../types/APIResponseModel";
import { logout } from "../../../services/AuthServices/AuthServices";
import UserContext from "../../../context/UserDataCtx/userContext";
import { useContext, useEffect } from "react";

import { UserModel } from "../../../models/UserModel";
import { getUser } from "../../../services/UserServices/userServices";
import { AdminContext } from "../../../context/AdmindataCtx/adminDataContext";

const AdminMainNavigation = () => {
    const ctx = useContext(UserContext);
    const adminCtx = useContext(AdminContext);

    const navigate = useNavigate();


    const unAuthorizeHandle = () => {
        localStorage.clear();
        navigate("/login");
    };




    const fetchUser = async () => {
        ctx.setUser({ loading: true, error: null });
        const response: APIResponseModel<UserModel> = await getUser();
        if (response.status === 401 || response.status === 403) {
            unAuthorizeHandle();
            ctx.reset();
            adminCtx.reset();
            return;
        }

        if (response.status !== 200) {
            ctx.setUser({ loading: false, error: "Failed to fetch user" });
            return;
        }
        const user: UserModel = response.data!;
        ctx.setUser({ ...user, loading: false, error: null });
    };

    useEffect(() => {
        fetchUser();
    }, []);
    const logoutHandler = async () => {
        const response: APIResponseModel<null> = await logout();
        if (response.status !== 200) {
            window.alert("Logout failed");
            return;
        }
        localStorage.clear();
        ctx.reset();
        adminCtx.reset();
        navigate("/login");
    };
    return (
        <Box sx={{ height: "100vh" }}>
            <AppBar position="static" sx={{ bgcolor: "#1e88e5" }}>
                <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="h6">Admin Dashboard</Typography>
                    <Box display="flex" alignItems="center" gap={2}>
                        <Typography>{ctx.username}</Typography>
                        <Avatar alt="Admin" src="https://i.pravatar.cc/300" />
                        <Button
                            variant="contained"
                            color="secondary"
                            size="small"
                            onClick={logoutHandler}
                        >
                            Logout
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>
            {ctx.error && <Typography>{ctx.error}</Typography>}


            <Outlet />

        </Box>
    );
};

export default AdminMainNavigation;





