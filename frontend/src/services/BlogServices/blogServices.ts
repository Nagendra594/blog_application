import { APIResponseModel } from "../../types/APIResponseModel";
import { BlogModel } from "../../models/BlogModel";

const API_BASE_URL = process.env.API_URL

export const getBlogs = async (signal: any): Promise<APIResponseModel<BlogModel[]>> => {
  let ApiRes: APIResponseModel<BlogModel[]>;
  try {


    const response = await fetch(`${API_BASE_URL}blogs`, {
      method: "GET",
      credentials: "include",
      signal: signal
    });
    const data = await response.json();
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
  } catch (err) {
    ApiRes = {
      status: 500,
    }
    return ApiRes;

  }

}

export const insertBlog = async (blogData: Partial<BlogModel>): Promise<APIResponseModel<null>> => {

  const formData = new FormData();
  formData.append("title", blogData.title!);
  formData.append("content", blogData.content!);
  formData.append("image", blogData.image!);
  let ApiRes: APIResponseModel<null>;
  try {


    const response = await fetch(`${API_BASE_URL}blogs`, {
      method: "POST",
      credentials: "include",
      body: formData
    });
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
  } catch (err) {
    ApiRes = {
      status: 500,
    }
    return ApiRes;

  }
}

export const updateBlog = async (blogData: Partial<BlogModel>): Promise<APIResponseModel<null>> => {
  const formData = new FormData();
  formData.append("title", blogData.title!);
  formData.append("content", blogData.content!);
  if (blogData.image) {
    formData.append("image", blogData.image);
  }
  let ApiRes: APIResponseModel<null>;
  try {


    const response = await fetch(`${API_BASE_URL}blogs/${blogData.blogid}`, {
      method: "PATCH",
      credentials: "include",

      body: formData
    });
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
  } catch (err) {
    ApiRes = {
      status: 500,
    }
    return ApiRes;

  }
}

export const deleteBlog = async (blogId: string): Promise<APIResponseModel<null>> => {
  let ApiRes: APIResponseModel<null>;
  try {


    const response = await fetch(`${API_BASE_URL}blogs/${blogId}`, {
      method: "DELETE",
      credentials: "include",
    });
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
  } catch (err) {
    ApiRes = {
      status: 500,
    }
    return ApiRes;

  }
}
