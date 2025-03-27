import Card from "../UI/Card/Card";
import classes from "./BlogItem.module.css";
import { useState } from "react";
import { Link ,useNavigate} from "react-router";
import { APIResponseModel } from "../../models/APIResponseModel";
import { deleteBlog } from "../../services/blogServices";
import { BlogModel } from "../../models/BlogModel";
import UserContext from "../../context/userContext";
import { useContext } from "react";
import Loader from "../UI/Loader/Loader";
interface BlogProps {
  blog: BlogModel,
  fetchPosts: () => void;
}
const BlogItem: React.FC<BlogProps> = ({ blog, fetchPosts }) => {
  const navigate=useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const ctx = useContext(UserContext);
  const deleteHandler = async (id: string) => {
    setLoading(true);
    setError(null);
    const response: APIResponseModel<null> = await deleteBlog(id);

    setLoading(false);
    if(response.status===401){
      localStorage.clear();
      navigate("/login");
      return;
    }
    if (response.status !== 200) {
      setError("Failed to delete blog");
      return;
    }
    fetchPosts();
  };
  const date: string = blog.date as unknown as string;
  return (
    <Card>
      {error && <p className={classes.error} style={{ color: "red", marginTop: "1rem", fontSize: "1.2rem" }}>{error}</p>}
      <div className={classes.blog__head}>
        <h2 className={classes.title}>{blog.title}</h2>
        <span>{date.split("T")[0]}</span>
      </div>
      <p className={classes.author}>
        Author: <strong>{blog.userName}</strong>
      </p>
      <p className={classes.content}>{blog.content}</p>
      {ctx.userId === blog.userId && <> <Link className={classes.update} to="/Blog/?update=true" state={{ blogId: blog.blogId, title: blog.title, content: blog.content }}>
        Update
      </Link>
        <button className={classes.delete} onClick={() => deleteHandler(blog.blogId)} disabled={loading}>{loading ? <Loader /> : "delete"}</button></>}
    </Card>
  );
};

export default BlogItem;
