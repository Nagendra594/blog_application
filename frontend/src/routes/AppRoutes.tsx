import { createBrowserRouter } from "react-router";
import LoginPage from "../pages/LoginPage/Loginpage";
import RegisterPage from "../pages/RegisterPage/Registerpage";
import UserMainNavigation from "../pages/HomePage/User/Homepage";
import AdminMainNavigation from "../pages/HomePage/Admin/HomePage";
import ProtectedRoute from "./ProtectedRoute";
import ErrorPage from "../pages/ErrorPage/ErrorPage";
import NotFoundPage from "../pages/ErrorPage/NotFound";
import UserDashboard from "../components/Home/User/Home";
import AdminDashboard from "../components/Home/Admin/Home";
import { Role } from "../types/Role.type";
const routes = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
    errorElement: <ErrorPage />
  },
  {
    path: "/register",
    element: <RegisterPage />,
    errorElement: <ErrorPage />
  },

  {
    path: "/",
    element: <ProtectedRoute roles={[Role.user, Role.admin]}><UserMainNavigation /></ProtectedRoute>,
    children: [
      {
        index: true,
        element: <UserDashboard />
      },

    ]
  },
  {
    path: "/admin",
    element: <ProtectedRoute roles={[Role.admin]}><AdminMainNavigation /></ProtectedRoute>,
    children: [
      {
        index: true,
        element: <AdminDashboard />
      }

    ]
  },
  {
    path: "/*",
    element: <NotFoundPage />
  }
]);

export default routes;