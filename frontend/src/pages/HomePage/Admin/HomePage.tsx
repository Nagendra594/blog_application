import {
    AppBar,
    Toolbar,
    Typography,

    Box,

    Button,
} from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";
import { APIResponseModel } from "../../../types/APIResponseModel";
import { logout } from "../../../services/AuthServices/AuthServices";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { userActions, UserSliceType } from "../../../store/UserSlice/UserSlice";
import { AppDispatch } from "../../../store/store";
import { fetchUserThunk } from "../../../store/UserSlice/UserSlice";
import { adminActions, AdminSliceType } from "../../../store/AdminDataSlice/AdminDataSlice";
const AdminMainNavigation = () => {
    const ctx = useSelector((state: { userState: UserSliceType }) => state.userState);
    const adminCtx = useSelector((state: { AdminDataState: AdminSliceType }) => state.AdminDataState);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();


    const unAuthorizeHandle = () => {
        localStorage.clear();
        navigate("/login");
    };
    useEffect(() => {
        dispatch(fetchUserThunk());
    }, []);

    useEffect(() => {
        if (ctx.error === "UnAuthenticated") {
            unAuthorizeHandle();
            dispatch(userActions.reset());
        }
    }, [ctx])
    const logoutHandler = async () => {
        const response: APIResponseModel<null> = await logout();
        if (response.status !== 200) {
            window.alert("Logout failed");
            return;
        }
        localStorage.clear();
        dispatch(userActions.reset());
        dispatch(adminActions.reset());
        navigate("/login");
    };
    return (
        <Box sx={{ height: "100vh" }}>
            <AppBar position="static" sx={{ bgcolor: "#1e88e5" }}>
                <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography variant="h6">Admin Dashboard</Typography>
                    <Box display="flex" alignItems="center" gap={2}>
                        <Typography>{ctx.username}</Typography>
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





