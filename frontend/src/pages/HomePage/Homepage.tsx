import { Outlet, Form,useNavigate } from "react-router";
import classes from "./HomePage.module.css";
import UserContext from "../../context/userContext.js";
import { useContext,useCallback ,useEffect} from "react";
import Loader from "../../components/UI/Loader/Loader";
import { APIResponseModel } from "../../models/APIResponseModel";
import { UserModel } from "../../models/UserModel";
import { getUser } from "../../services/userServices";
const MainNavigation = () => {
  const ctx = useContext(UserContext);
  const navigate=useNavigate();
  const unAuthorizeHandle = useCallback(() => {
      localStorage.clear();
      navigate("/login");
    }, [navigate])
  

  const fetchUser = async () => {
    ctx.setUser({ loading: true, error: null })
    const response: APIResponseModel<UserModel> = await getUser();
    if (response.status === 401) {
      unAuthorizeHandle();
      return;
    }
    if (response.status !== 200) {
      ctx.setUser({ loading: false, error: "Failed to fetch user" })
      return;
    }
    const user: UserModel = response.data!;
    ctx.setUser({ ...user, loading: false, error: null });
    return;
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <>
      <header className={classes.header}>
        <h1>Hey {ctx.loading ? <Loader /> : ctx.userName}</h1>
        <Form method="POST">
          <button className={classes.logoutBtn}>Logout</button>
        </Form>
      </header>
      <Outlet />
    </>
  );
};
export default MainNavigation;
