import { APIResponseModel } from "../models/APIResponseModel";
import { BlogModel } from "../models/BlogModel";

const API_BASE_URL = "http://localhost:8080/api/"

export const getBlogs = async (): Promise<APIResponseModel<BlogModel[]>> => {
  const response = await fetch(`${API_BASE_URL}blogs`, {
    method: "GET",
    credentials: "include",
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
  const response = await fetch(`${API_BASE_URL}blogs`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: blogData.title,
      content: blogData.content,
    }),
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
  const response = await fetch(`${API_BASE_URL}blogs/${blogData.blogId}`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: blogData.title,
      content: blogData.content,
    }),
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
