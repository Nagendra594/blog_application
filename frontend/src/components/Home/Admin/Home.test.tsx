import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import AdminDashboard from "./Home";
import { getAllUsers } from "../../../services//UserServices/userServices";
import { getBlogs } from "../../../services/BlogServices/blogServices";
import { AdminContext } from "../../../context/AdmindataCtx/adminDataContext";
import { UserModel } from "../../../models/UserModel";
import { BlogModel } from "../../../models/BlogModel";
import { Role } from "../../../types/Role.type";

vi.mock("../../../services/UserServices/userServices", () => ({
    getAllUsers: vi.fn(() => Promise.resolve({ status: 200, data: [] })),
}));

vi.mock("../../../services/BlogServices/blogServices", () => ({
    getBlogs: vi.fn(() => Promise.resolve({ status: 200, data: [] })),
}));

vi.mock("../../UserItem/UserItem", () => ({
    default: ({ user }: { user: UserModel }) => (
        <div data-testid="user-item">{user.username}</div>
    ),
}));

vi.mock("../../AdminBlog/AdminBlog", () => ({
    default: ({ blog }: { blog: BlogModel }) => (
        <div data-testid="blog-item">{blog.title}</div>
    ),
}));

const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
    useNavigate: () => mockNavigate,
}));

describe("AdminDashboard Component", () => {
    const mockGetAllUsers = getAllUsers as Mock;
    const mockGetBlogs = getBlogs as Mock;

    const mockUsers: UserModel[] = [
        {
            userid: "1",
            username: "admin",
            email: "admin@example.com",
            role: "admin" as Role,
        },
        {
            userid: "2",
            username: "user1",
            email: "user1@example.com",
            role: "user" as Role,
        },
    ];

    const mockBlogs: BlogModel[] = [
        {
            blogid: "1",
            title: "First Blog",
            content: "Content 1",
            userid: "1",
            date: new Date(),
            image: null,
            username: "test1",
            role: "user" as Role
        },
        {
            blogid: "2",
            title: "Second Blog",
            content: "Content 2",
            userid: "2",
            date: new Date(),
            image: null,
            username: "test2",
            role: "user" as Role
        },
    ];

    const mockAdminContext = {
        loading: false,
        error: null,
        data: [mockUsers, mockBlogs] as [UserModel[], BlogModel[]],
        setData: vi.fn(),
        reset: vi.fn(),
    };

    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
        mockGetAllUsers.mockResolvedValue({ status: 200, data: mockUsers });
        mockGetBlogs.mockResolvedValue({ status: 200, data: mockBlogs });
    });

    const setup = (contextOverrides = {}) => {
        const contextValue = {
            ...mockAdminContext,
            ...contextOverrides,
        };

        return render(
            <AdminContext.Provider value={contextValue}>
                <AdminDashboard />
            </AdminContext.Provider>
        );
    };

    it("renders the admin dashboard with users and blogs sections", () => {
        setup();

        expect(screen.getByText("Manage Users")).toBeInTheDocument();
        expect(screen.getByText("Manage Blogs")).toBeInTheDocument();
        expect(screen.getAllByTestId("user-item")).toHaveLength(2);
        expect(screen.getAllByTestId("blog-item")).toHaveLength(2);
    });



    it("shows error message when data fetching fails", () => {
        const errorMessage = "Failed to fetch data";
        setup({ error: errorMessage });
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    it("displays 'No users found' when users array is empty", () => {
        setup({ data: [[], mockBlogs] });
        expect(screen.getByText("No users found.")).toBeInTheDocument();
        expect(screen.getAllByTestId("blog-item")).toHaveLength(2);
    });

    it("displays 'No Blogs found' when blogs array is empty", () => {
        setup({ data: [mockUsers, []] });
        expect(screen.getByText("No Blogs found.")).toBeInTheDocument();
        expect(screen.getAllByTestId("user-item")).toHaveLength(2);
    });

    it("redirects to login when unauthorized (401)", async () => {
        mockGetAllUsers.mockResolvedValueOnce({ status: 401 });
        setup({ data: [[], []] });

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith("/login");
            expect(localStorage.getItem("isLogged")).toBeNull();
        });
    });

    it("redirects to login when forbidden (403)", async () => {
        mockGetBlogs.mockResolvedValueOnce({ status: 403 });
        setup({ data: [[], []] });

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith("/login");
            expect(localStorage.getItem("isLogged")).toBeNull();
        });
    });

    it("calls fetchData on component mount", async () => {
        const mockSetData = vi.fn();
        setup({ setData: mockSetData });

        await waitFor(() => {
            expect(mockSetData).toHaveBeenCalledWith({ loading: true, error: null });
            expect(mockGetAllUsers).toHaveBeenCalled();
            expect(mockGetBlogs).toHaveBeenCalled();
        });
    });

    it("handles API errors properly", async () => {
        mockGetAllUsers.mockResolvedValueOnce({ status: 500 });
        const mockSetData = vi.fn();
        setup({ setData: mockSetData });

        await waitFor(() => {
            expect(mockSetData).toHaveBeenCalledWith({
                loading: false,
                error: "Failed to fetch data"
            });
        });
    });
});