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
  image?:File | null
}
interface LocationState extends Required<BlogState> {
  blogId: string;

}
const BlogForm = () => {
  const location = useLocation();
  const Locstate: LocationState = location.state as LocationState || {};
  const [BlogData, setBlogData] = useState<BlogState>({ title: Locstate.title || "", content: Locstate.content || "", image:null });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchParams] = useSearchParams();

  const isUpdate = searchParams.get("update") === "true";
  const navigate = useNavigate();
  const blogDataChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
   let name:string=e.target.name;
   let value:File | string;

    if(name==="image" && e.target.files && e.target.files.length>0){
      value=e.target.files[0]
    }else{
      value=e.target.value;
    }
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
    if (!BlogData.title || !BlogData.content || (!isUpdate && !BlogData.image)) {
      setError("Please fill all the fields");
      setLoading(false);
      return;
    }
    setError(null);
    const blogData: Partial<BlogModel> = {
      title: BlogData.title,
      content: BlogData.content,
    }
    if (isUpdate) {
      blogData.blogId = Locstate.blogId;
      if(BlogData.image){
        blogData.image=BlogData.image;
      }
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
      blogData.image=BlogData.image!;
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
      <form onSubmit={submitBlog} className={classes.form} encType="multipart/form-data">
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
        <input type="file" accept="image/jpeg, image/png" name="image" onChange={blogDataChangeHandler} required={!isUpdate}/>
        <button type="submit" disabled={loading}>{!loading ? isUpdate ? "Update" : "Add Blog" : <Loader />}</button>
      </form>
      <Link className={classes.back} to="..">
        Go back?
      </Link>
    </main>
  );
};
export default BlogForm;

