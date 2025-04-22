
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,

} from "@mui/material";

import { Outlet, useNavigate } from "react-router-dom";
import { logout } from "../../../services/AuthServices/AuthServices";
import UserContext from "../../../context/UserDataCtx/userContext";

import { useContext, useEffect } from "react";
import { getUser } from "../../../services//UserServices/userServices";
import { UserModel } from "../../../models/UserModel";
import { APIResponseModel } from "../../../types/APIResponseModel";



const UserMainNavigation = () => {
  const ctx = useContext(UserContext);

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
      ctx.setUser({ loading: false, error: "Failed to fetch user" });

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