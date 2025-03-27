import { FormEvent, useState } from "react";
import classes from "./BlogForm.module.css";
import { useNavigate, Link, useSearchParams, useLocation } from "react-router";
import { APIResponseModel } from "../../models/APIResponseModel";
import { BlogModel } from "../../models/BlogModel";
import { insertBlog, updateBlog } from "../../services/blogServices";
import Loader from "../UI/Loader/Loader";
interface BlogState {
  title?: string;
  content?: string;
}
interface LocationState extends Required<BlogState> {
  blogId: string;

}
const BlogForm = () => {
  const location = useLocation();
  const Locstate: LocationState = location.state as LocationState || {};
  const [BlogData, setBlogData] = useState<BlogState>({ title: Locstate.title || "", content: Locstate.content || "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchParams] = useSearchParams();

  const isUpdate = searchParams.get("update") === "true";
  const navigate = useNavigate();
  const blogDataChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBlogData((prev) => {
      return {
        ...prev,
        [name]: value
      }
    })
  }

  const submitBlog = async (e: FormEvent<HTMLFormElement>) => {

    e.preventDefault();
    setLoading(true);
    if (!BlogData.title || !BlogData.content) {
      setError("Please fill all the fields");
      setLoading(false);
      return;
    }
    setError(null);
    const blogData: Partial<BlogModel> = {
      title: BlogData.title,
      content: BlogData.content
    }
    if (isUpdate) {
      blogData.blogId = Locstate.blogId;
      const response: APIResponseModel<null> = await updateBlog(blogData);
      if(response.status===401){
        localStorage.clear();
        navigate("/login");
        return;
      }
      if (response.status !== 200) {
        setLoading(false);
        setError("Failed to update blog");
        return
      }
    } else {
      const response: APIResponseModel<null> = await insertBlog(blogData);
      if(response.status===401){
        localStorage.clear();
        navigate("/login");
        return;
      }
      if (response.status !== 201) {
        setLoading(false);
        setError("Failed to add blog");
        return
      }
    }
    setLoading(false);
    setError(null);
    return navigate("/");
  };

  return (
    <main className={classes.main}>
      <h1>{isUpdate ? "Update Blog" : "Add Blog"}</h1>
      {error && <p className={classes.error} style={{ color: "red", marginTop: "1rem", fontSize: "1.2rem" }}>{error}</p>}
      <form onSubmit={submitBlog} className={classes.form}>
        <input
          type="text"
          name="title"
          onChange={blogDataChangeHandler}
          value={BlogData.title}
          placeholder="title"
          required
        />
        <input
          type="text"
          name="content"
          placeholder="content"
          onChange={blogDataChangeHandler}
          value={BlogData.content}
          required
        />
        <button type="submit" disabled={loading}>{!loading ? isUpdate ? "Update" : "Add Blog" : <Loader />}</button>
      </form>
      <Link className={classes.back} to="..">
        Go back?
      </Link>
    </main>
  );
};
export default BlogForm;

