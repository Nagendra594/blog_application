
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,

} from "@mui/material";

import { Outlet, useNavigate } from "react-router-dom";
import { logout } from "../../../services/AuthServices/AuthServices";
import { useSelector, useDispatch } from "react-redux";
import { userActions, UserSliceType } from "../../../store/UserSlice/UserSlice";
import { useEffect } from "react";
import { APIResponseModel } from "../../../types/APIResponseModel";
import { fetchUserThunk } from "../../../store/UserSlice/UserSlice";
import { AppDispatch } from "../../../store/store";

const UserMainNavigation = () => {
  const ctx = useSelector((state: { userState: UserSliceType }) => state.userState);
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
    navigate("/login");
  };
  return (
    <Box sx={{ height: "100vh" }}>
      <AppBar position="fixed" sx={{ bgcolor: "#1976d2", top: 0 }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6">User Dashboard</Typography>
          <Box display="flex" alignItems="center" gap={2}>
            <Typography>{ctx.username}</Typography>
            <Button
              color="secondary"
              variant="contained"
              onClick={logoutHandler}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Outlet />

    </Box>
  );
};

export default UserMainNavigation;