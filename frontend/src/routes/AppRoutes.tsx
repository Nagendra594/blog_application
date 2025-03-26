import { createBrowserRouter} from "react-router";
import LoginPage from "../pages/LoginPage/Loginpage";
import RegisterPage from "../pages/RegisterPage/Registerpage";
import { LoginAction } from "../components/Login/Login";
import { logoutAction } from "../components/Home/Home";
import { signUpAction } from "../components/Register/Register";
import BlogForm from "../components/BlogForm/BlogForm";
import MainNavigation from "../pages/HomePage/Homepage";
import Home from "../components/Home/Home";
import ProtectedRoute from "./ProtectedRoute";
const routes = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
    action: LoginAction,
  },
  {
    path: "/register",
    element: <RegisterPage />,
    action: signUpAction,
  },
  {
    path: "/",
    element: <ProtectedRoute><MainNavigation /></ProtectedRoute>,
    action: logoutAction,


    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "Blog",
        element: <BlogForm />,
      },
    ],
  },
]);

export default routes;