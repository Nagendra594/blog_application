import { useState, useEffect, useReducer } from "react";
import {
    Box,
    TextField,
    Typography,
    Button,
    Modal,
    CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { APIResponseModel } from "../../types/APIResponseModel";
import { BlogModel } from "../../models/BlogModel";
import { insertBlog, updateBlog } from "../../services/BlogServices/blogServices";
import { titleState, contentState, imageState } from "../../types/newBlog";
interface AddOrEditBlogModalProps {
    open: boolean;
    handleClose: () => void;
    blog: BlogModel | null;
    fetch: Function

}

const style = {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
};


const titleReducerFunction = (state: titleState, action: { title: string, touched: boolean }) => {
    return {
        title: action.title,
        isValid: action.title.trim().length >= 3,
        touched: action.touched,
    };
};
const contentReducerFunction = (state: contentState, action: { content: string, touched: boolean }) => {
    return {
        content: action.content,
        isValid: action.content.trim().length >= 3,
        touched: action.touched,
    };
};
const imageReducerFunction = (state: imageState, action: { image: string | File | null, touched: boolean }) => {
    return {
        image: action.image,
        isValid: action.image != null,
        touched: action.touched,
    };
};

const AddOrEditBlogModal: React.FC<AddOrEditBlogModalProps> = ({ open, handleClose, blog, fetch }) => {
    const [canUpdate, setCanUpdate] = useState<boolean>(false);
    const [isTouch, setIsTouch] = useState<boolean>(false);
    const [title, titleDispatch] = useReducer(titleReducerFunction, { title: blog?.title || "", isValid: false, touched: false });
    const [content, contentDispatch] = useReducer(contentReducerFunction, { content: blog?.content || "", isValid: false, touched: false });
    const [image, imageDispatch] = useReducer(imageReducerFunction, { image: blog?.image || null, isValid: false, touched: false });

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const unAuthorizeHandle = () => {
        localStorage.clear();
        navigate("/login");
    }
    useEffect(() => {
        if (isTouch && !canUpdate) {
            setCanUpdate(true);
        }
    }, [isTouch])
    useEffect(() => {
        if (blog) {
            titleDispatch({ title: blog.title, touched: true });
            contentDispatch({ content: blog.content, touched: true });
            imageDispatch({ image: blog.image, touched: true });
        }
    }, [blog])
    const blogDataChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.name;
        const value = name === "image" && e.target.files && e.target.files.length > 0
            ? e.target.files[0]
            : e.target.value;
        if (name === "image") {
            imageDispatch({ image: value, touched: true });
        }
        else if (name === "title") {
            titleDispatch({ title: value as string, touched: true });

        } else {
            contentDispatch({ content: value as string, touched: true })

        }
        setIsTouch(true);
    };
    const submitBlog = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        if (!title.title || !content.content || (!blog && !image.image)) {
            setError("Please fill all the fields");
            setLoading(false);
            return;
        }

        setError(null);
        const blogData: Partial<BlogModel> = {
            title: title.title,
            content: content.content
        };
        if (blog) {
            blogData.blogid = blog.blogid;
            if (image.image) {
                blogData.image = image.image;
            }
            const response: APIResponseModel<null> = await updateBlog(blogData);
            if (response.status === 401) {
                unAuthorizeHandle();
                return;
            }
            if (response.status !== 200) {
                setLoading(false);
                setError("Failed to update blog");
                return;
            }
        } else {
            blogData.image = image.image!;
            const response: APIResponseModel<null> = await insertBlog(blogData);
            if (response.status === 401) {
                unAuthorizeHandle();
                return;
            }
            if (response.status !== 201) {
                setLoading(false);
                setError("Failed to add blog");
                return;
            }
        }

        setLoading(false);
        setError(null);
        fetch();
        handleClose()
        titleDispatch({ title: "", touched: false });
        contentDispatch({ content: "", touched: false });
        imageDispatch({ image: null, touched: false });
        return;
    };
    const titleInputIsValid = title.isValid || !title.touched;
    const contentInputIsValid = content.isValid || !content.touched;
    const imageInputIsValid = image.isValid || !image.touched;
    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={style}>
                <Typography variant="h4" gutterBottom textAlign="center">
                    {blog ? "Update Blog" : "Add Blog"}
                </Typography>

                {error && (
                    <Typography color="error" fontSize="1.1rem" mb={2} textAlign="center">
                        {error}
                    </Typography>
                )}
                <TextField
                    label="Title"
                    name="title"
                    value={title.title}
                    onChange={blogDataChangeHandler}
                    fullWidth
                    margin="normal"
                    error={!titleInputIsValid}
                    required
                />
                <TextField
                    label="Content"
                    name="content"
                    value={content.content}
                    onChange={blogDataChangeHandler}
                    fullWidth
                    margin="normal"
                    error={!contentInputIsValid}
                    required
                />
                <Button
                    variant="outlined"
                    component="label"
                    sx={{ mt: 2 }}
                >
                    Upload Image
                    <input
                        type="file"
                        name="image"
                        accept="image/jpeg, image/png"
                        onChange={blogDataChangeHandler}
                        hidden
                        required={!blog}
                    />
                </Button>
                <Box sx={{ mt: 4 }}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        disabled={loading || !isTouch || !titleInputIsValid || !contentInputIsValid || !imageInputIsValid || !title.touched || !content.touched || !image.touched}
                        onClick={submitBlog}
                        sx={{ py: 1.2 }}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : blog ? "Update" : "Add Blog"}
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default AddOrEditBlogModal;
