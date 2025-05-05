import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import UserDashboard from "./Home";
import { BlogModel } from "../../../models/BlogModel";
import useFetch from "../../../hooks/useFetch";
import { Role } from "../../../types/Role.type";
import { afterEach } from "node:test";
import userEvent from '@testing-library/user-event';
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { AdminSliceType } from "../../../store/AdminDataSlice/AdminDataSlice";
import { configureStore } from "@reduxjs/toolkit";
import { userReducer, UserSliceType } from "../../../store/UserSlice/UserSlice";


vi.mock("../../../services/BlogServices/blogServices", () => ({
    getBlogs: vi.fn(),
}));

vi.mock("../../../hooks/useFetch", () => ({
    default: vi.fn(),
}));


vi.mock("../../BlogForm/AddOrEditBlog", () => ({
    default: ({ open }: { open: boolean }) => (
        open ? <div>AddOrEditBlog Modal</div> : null
    ),
}));

vi.mock("../../BlogItem/BlogItem", () => ({
    default: ({ blog }: { blog: BlogModel }) => (
        <div>BlogItem: {blog.title}</div>
    ),
}));

describe("UserDashboard Component", () => {
    const mockUseFetch = useFetch as Mock;
    const mockStore = (initialState: { userState: UserSliceType }) => {
        return configureStore({
            reducer: {
                userState: userReducer
            },
            preloadedState: initialState
        });
    };




    const mockBlogs: BlogModel[] = [
        {
            blogid: "1",
            title: "Test Blog 1",
            content: "Content 1",
            userid: "123",
            date: new Date(),
            image: null,
            username: "test1",
            role: "user" as Role
        },
        {
            blogid: "2",
            title: "Test Blog 2",
            content: "Content 2",
            userid: "456",
            date: new Date(),
            image: null,
            username: "test2",
            role: "user" as Role
        },
    ];

    beforeEach(() => {
        vi.clearAllMocks();
        mockUseFetch.mockReturnValue({
            data: mockBlogs,
            loading: false,
            error: null,
            fetchAgain: vi.fn(),
        });
    });
    beforeEach(() => {
        const modalRoot = document.createElement('div');
        modalRoot.setAttribute('id', 'modal');
        document.body.appendChild(modalRoot);
    });

    afterEach(() => {
        const modalRoot = document.getElementById('modal');
        if (modalRoot) {
            document.body.removeChild(modalRoot);
        }
    });



    it("renders without crashing", () => {
        const store = mockStore({
            userState: {
                loading: false,
                error: null,
                userid: "123",
                username: "dummy",
                role: Role.user
            }
        });
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <UserDashboard />
                </MemoryRouter>
            </Provider>
        );
        expect(screen.getByText("Profile Info")).toBeInTheDocument();
        expect(screen.getByText("Blogs")).toBeInTheDocument();
        expect(screen.getByText("Add New Blog")).toBeInTheDocument();
    });

    it("displays user profile information", () => {
        const store = mockStore({
            userState: {
                loading: false,
                error: null,
                userid: "123",
                username: "dummy",
                email: "test@example.com",
                role: Role.user
            }
        });
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <UserDashboard />
                </MemoryRouter>
            </Provider>
        );
        expect(screen.getByText("dummy")).toBeInTheDocument();
        expect(screen.getByText("test@example.com")).toBeInTheDocument();
    });

    it("shows loading state when blogs are loading", () => {
        mockUseFetch.mockReturnValue({
            data: [],
            loading: true,
            error: null,
            fetchAgain: vi.fn(),
        });

        const store = mockStore({
            userState: {
                loading: true,
                error: null,
                userid: "",
                username: "",
                email: "",
                role: null
            }
        });
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <UserDashboard />
                </MemoryRouter>
            </Provider>
        );
        expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });

    it("displays all blogs by default", () => {
        const store = mockStore({
            userState: {
                loading: false,
                error: null,
                userid: "123",
                username: "dummy",
                email: "test@example.com",
                role: Role.user
            }
        });
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <UserDashboard />
                </MemoryRouter>
            </Provider>
        );
        expect(screen.getByText("BlogItem: Test Blog 1")).toBeInTheDocument();
        expect(screen.getByText("BlogItem: Test Blog 2")).toBeInTheDocument();
    });


    it("filters to show only user's blogs", async () => {
        const user = userEvent.setup();
        const store = mockStore({
            userState: {
                loading: false,
                error: null,
                userid: "123",
                username: "dummy",
                email: "test@example.com",
                role: Role.user
            }
        });
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <UserDashboard />
                </MemoryRouter>
            </Provider>
        );
        const selectButton = screen.getByText(/all blogs/i)
        await user.click(selectButton);

        const myBlogsOption = await screen.findByText("My Blogs");
        await user.click(myBlogsOption);

        expect(screen.getByText("BlogItem: Test Blog 1")).toBeInTheDocument();
        expect(screen.queryByText("BlogItem: Test Blog 2")).not.toBeInTheDocument();
    });


    it("shows 'No blogs found' when there are no blogs", () => {
        mockUseFetch.mockReturnValue({
            data: [],
            loading: false,
            error: null,
            fetchAgain: vi.fn(),
        });

        const store = mockStore({
            userState: {
                loading: false,
                error: null,
                userid: "123",
                username: "dummy",
                email: "test@example.com",
                role: Role.user
            }
        });
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <UserDashboard />
                </MemoryRouter>
            </Provider>
        );
        expect(screen.getByText("No blogs found.")).toBeInTheDocument();
    });

    it("opens the add blog modal when button is clicked", async () => {

        const store = mockStore({
            userState: {
                loading: false,
                error: null,
                userid: "123",
                username: "dummy",
                email: "test@example.com",
                role: Role.user
            }
        });
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <UserDashboard />
                </MemoryRouter>
            </Provider>
        );

        fireEvent.click(screen.getByText("Add New Blog"));
        expect(screen.getByText(/AddOrEditBlog Modal/i)).toBeInTheDocument();
    });

    it("displays error message when there's an error", () => {
        mockUseFetch.mockReturnValue({
            data: [],
            loading: false,
            error: "Failed to fetch blogs",
            fetchAgain: vi.fn(),
        });

        const store = mockStore({
            userState: {
                loading: false,
                error: null,
                userid: "123",
                username: "dummy",
                email: "test@example.com",
                role: Role.user
            }
        });
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <UserDashboard />
                </MemoryRouter>
            </Provider>
        );
        expect(screen.getByText("Failed to fetch blogs")).toBeInTheDocument();
    });
});