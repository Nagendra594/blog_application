import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import BlogItem from "./BlogItem";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import { vi, describe, expect, beforeEach, it, Mock } from "vitest";
import { deleteBlog } from "../../services/BlogServices/blogServices";

import { Role } from "../../types/Role.type";
import { APIResponseModel } from "../../types/APIResponseModel";

const mockStore = configureMockStore();
vi.mock("../../services/BlogServices/blogServices");

const sampleBlog = {
    blogid: "1",
    title: "Test Blog",
    content: "This is test content",
    date: new Date(),
    username: "testuser",
    userid: "user123",
    image: "/images/test.jpg",
    role: Role.user
};

const fetchPosts = vi.fn();
const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
    useNavigate: () => mockNavigate,
}));

describe("AdminBlogItem with Redux", () => {
    let store: any;
    const mockDeleteBlog = vi.mocked(deleteBlog);

    beforeEach(() => {



        store = mockStore({
            userState: {
                userid: "user123", // same as blog.userid
                token: "mockToken"
            },
        });


        const modalRoot = document.createElement("div");
        modalRoot.setAttribute("id", "modal");
        document.body.appendChild(modalRoot);
    });

    it("renders blog information correctly", () => {
        render(
            <Provider store={store}>

                <BlogItem blog={sampleBlog} fetchPosts={fetchPosts} />

            </Provider>
        );

        expect(screen.getByText("Test Blog")).toBeInTheDocument();
        expect(screen.getByText("Author: testuser")).toBeInTheDocument();
    });

    it("opens edit modal when edit button is clicked", () => {
        render(
            <Provider store={store}>

                <BlogItem blog={sampleBlog} fetchPosts={fetchPosts} />

            </Provider>
        );

        const editButton = screen.getByTestId("edit");
        fireEvent.click(editButton);

        expect(screen.getByText(/update Blog/i)).toBeInTheDocument();;
    });

    it("calls deleteBlog and dispatch on success", async () => {


        render(
            <Provider store={store}>

                <BlogItem blog={sampleBlog} fetchPosts={fetchPosts} />

            </Provider>
        );
        mockDeleteBlog.mockResolvedValue({ status: 200 });

        const deleteButton = screen.getByTestId("delete");
        fireEvent.click(deleteButton);

        await waitFor(() => {
            expect(mockDeleteBlog).toHaveBeenCalledWith("1");
            expect(fetchPosts).toHaveBeenCalled();
        });
    });

    it("shows loading state during delete operation", async () => {


        render(
            <Provider store={store}>

                <BlogItem blog={sampleBlog} fetchPosts={fetchPosts} />

            </Provider>
        );

        const deleteButton = screen.getByTestId("delete");
        fireEvent.click(deleteButton);

        expect(screen.getByTestId("progress")).toBeInTheDocument();

        await waitFor(() => expect(fetchPosts).toHaveBeenCalled());
    });

    it("displays error message on delete failure", async () => {
        mockDeleteBlog.mockResolvedValue({ status: 500 });

        render(
            <Provider store={store}>

                <BlogItem blog={sampleBlog} fetchPosts={fetchPosts} />

            </Provider>
        );

        const deleteButton = screen.getByTestId("delete");
        fireEvent.click(deleteButton);

        await waitFor(() => {
            expect(screen.getByText("Failed to delete blog")).toBeInTheDocument();
        });
    });

    it("navigates to login on 401 error", async () => {

        const mockResponse: APIResponseModel<null> = {
            status: 401,
            data: null,
        };

        render(
            <Provider store={store}>

                <BlogItem blog={sampleBlog} fetchPosts={fetchPosts} />
            </Provider>
        );

        mockDeleteBlog.mockResolvedValue(mockResponse);
        const deleteButton = screen.getByTestId("delete");
        fireEvent.click(deleteButton);

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalled();
        });
    });
});
