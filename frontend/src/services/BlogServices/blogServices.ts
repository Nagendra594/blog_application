import { APIResponseModel } from "../../types/APIResponseModel";
import { BlogModel } from "../../models/BlogModel";

const API_BASE_URL = process.env.API_URL

export const getBlogs = async (signal: any): Promise<APIResponseModel<BlogModel[]>> => {
  const response = await fetch(`${API_BASE_URL}blogs`, {
    method: "GET",
    credentials: "include",
    signal: signal
  });
  const data = await response.json();
  let ApiRes: APIResponseModel<BlogModel[]>;
  if (!response.ok) {
    ApiRes = {
      status: response.status,

    }
    return ApiRes;
  }

  const Blogs: BlogModel[] = data;
  ApiRes = {
    data: Blogs,
    status: response.status,
  }
  return ApiRes;

}

export const insertBlog = async (blogData: Partial<BlogModel>): Promise<APIResponseModel<null>> => {
  const formData = new FormData();
  formData.append("title", blogData.title!);
  formData.append("content", blogData.content!);
  formData.append("image", blogData.image!);
  const response = await fetch(`${API_BASE_URL}blogs`, {
    method: "POST",
    credentials: "include",
    body: formData
  });
  let ApiRes: APIResponseModel<null>;
  if (!response.ok) {
    ApiRes = {
      status: response.status,

    }
    return ApiRes;
  }
  ApiRes = {
    status: response.status,
  }
  return ApiRes;
}

export const updateBlog = async (blogData: Partial<BlogModel>): Promise<APIResponseModel<null>> => {
  const formData = new FormData();
  formData.append("title", blogData.title!);
  formData.append("content", blogData.content!);
  if (blogData.image) {
    formData.append("image", blogData.image);
  }
  const response = await fetch(`${API_BASE_URL}blogs/${blogData.blogid}`, {
    method: "PATCH",
    credentials: "include",

    body: formData
  });
  let ApiRes: APIResponseModel<null>;
  if (!response.ok) {
    ApiRes = {
      status: response.status,

    }
    return ApiRes;
  }
  ApiRes = {
    status: response.status,
  }
  return ApiRes;
}

export const deleteBlog = async (blogId: string): Promise<APIResponseModel<null>> => {
  const response = await fetch(`${API_BASE_URL}blogs/${blogId}`, {
    method: "DELETE",
    credentials: "include",
  });
  let ApiRes: APIResponseModel<null>;
  if (!response.ok) {
    ApiRes = {
      status: response.status,

    }
    return ApiRes;
  }
  ApiRes = {
    status: response.status,
  }
  return ApiRes;
}
