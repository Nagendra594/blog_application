import { redirect, Link, useNavigate } from "react-router-dom";
import classes from "./Home.module.css";
import { useState, useEffect, useContext, useCallback } from "react";
import UserContext from "../../context/userContext.js";
import BlogItem from "../BlogItem/BlogItem.js";
import { APIResponseModel } from "../../models/APIResponseModel";
import { getBlogs } from "../../services/blogServices"
import { getUser } from "../../services/userServices"
import { BlogModel } from "../../models/BlogModel";
import { UserModel } from "../../models/UserModel";
import { logout } from "../../services/AuthServices";
import Loader from "../UI/Loader/Loader";
interface BlogDataType {
  blogs: BlogModel[],
  error: string | null,
  loading: boolean
}
const Home = () => {
  const [blogsData, setBlogsData] = useState<BlogDataType>({ blogs: [], error: null, loading: false });
  const navigate = useNavigate();
  const ctx = useContext(UserContext);


  const unAuthorizeHandle = useCallback(() => {
    localStorage.clear();
    navigate("/login");
  }, [navigate])

  const fetchPosts = async () => {
    setBlogsData((prev: BlogDataType) => {
      return { ...prev, loading: true, error: null }
    })
    const response: APIResponseModel<BlogModel[]> = await getBlogs();
    if (response.status === 401) {
      unAuthorizeHandle()
      return;
    }

    if (response.status !== 200) {
      setBlogsData((prev: BlogDataType) => {
        return { ...prev, loading: false, error: "failed  to fetch blogs" }
      })
      return;
    }
    setBlogsData((prev: BlogDataType) => {
      return { ...prev, loading: false, blogs: response.data! }
    })
  };
  

  useEffect(() => {
    fetchPosts();
  }, []);
 

  const BlogCompo = () => {
    if (blogsData.loading) {
      return <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Loader />
      </div>
    }
    if (blogsData.blogs?.length === 0) {
      return <p className={classes.noBlogs}>No blogs to show</p>
    }
    return blogsData.blogs?.map((blog) => {
      return (
        <li className={classes.item} key={blog.blogId}>

          <BlogItem blog={blog} fetchPosts={fetchPosts} />
        </li>
      );
    })
  }
  return (
    <>
      <main className={classes.main}>
        <h1>Here your blogs</h1>
        <Link className={classes.addNewBlog} to="Blog">
          Add new Blog?
        </Link>
        <div className={classes.blogs}>
          <ul className={classes.items}>
            <BlogCompo />
          </ul>
        </div>
      </main>
    </>
  );
};

export default Home;


export const logoutAction = async () => {
  const response: APIResponseModel<null> = await logout();
  if (response.status !== 200) {
    window.alert("logout failed");
    return;
  }
  localStorage.clear();
  return redirect("/login");

};
