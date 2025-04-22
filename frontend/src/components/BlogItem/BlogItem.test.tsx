import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import BlogItem from "./BlogItem";
import { deleteBlog } from "../../services/BlogServices/blogServices";
import { BlogModel } from "../../models/BlogModel";
import UserContext from "../../context/UserDataCtx/userContext";
import { useNavigate } from "react-router-dom";
import { Role } from "../../types/Role.type";
import { afterEach } from "node:test";

vi.mock("../../services/BlogServices/blogServices", () => ({
    deleteBlog: vi.fn(),
}));

vi.mock("react-router-dom", () => ({
    useNavigate: vi.fn(),
}));

vi.mock("../BlogForm/AddOrEditBlog", () => ({
    default: () => <div>AddOrEditBlog Modal</div>,
}));

describe("BlogItem Component", () => {
    const mockDeleteBlog = deleteBlog as Mock;
    const mockNavigate = vi.fn();
    const mockFetchPosts = vi.fn();

    const mockBlog: BlogModel = {
        blogid: "1",
        title: "Test Blog",
        content: "Test content",
        userid: "123",
        username: "testuser",
        date: new Date(),
        image: "test-image.jpg",
        role: "user" as Role
    };

    const mockUserContext = {
        userid: "123",
        username: "testuser",
        email: "test@example.com",
        role: "user" as Role,
        loading: false,
        error: null,
        setUser: vi.fn(),
        reset: vi.fn(),
    };

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(useNavigate).mockReturnValue(mockNavigate);
        mockDeleteBlog.mockReset();
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

    const setup = (blog = mockBlog, context = mockUserContext) => {
        return render(
            <UserContext.Provider value={context}>
                <BlogItem blog={blog} fetchPosts={mockFetchPosts} />
            </UserContext.Provider>
        );
    };

    it("renders blog item correctly", () => {
        setup();

        expect(screen.getByText("Test Blog")).toBeInTheDocument();
        expect(screen.getByText("Test content")).toBeInTheDocument();
        expect(screen.getByText(/Author:/)).toBeInTheDocument();
        expect(screen.getByRole("img")).toHaveAttribute("alt", "Test Blog");
    });

    it("shows edit and delete buttons for blog owner", () => {
        setup();

        expect(screen.getByTestId("edit")).toBeInTheDocument();
        expect(screen.getByTestId("delete")).toBeInTheDocument();
    });



    it("opens edit modal when edit button is clicked", () => {
        setup();

        fireEvent.click(screen.getByTestId("edit"));
        expect(screen.getByText("AddOrEditBlog Modal")).toBeInTheDocument();
    });

    it("handles successful blog deletion", async () => {
        mockDeleteBlog.mockResolvedValue({ status: 200 });
        setup();

        fireEvent.click(screen.getByTestId("delete"));

        await waitFor(() => {
            expect(mockDeleteBlog).toHaveBeenCalledWith("1");
            expect(mockFetchPosts).toHaveBeenCalled();
        });
    });

    it("shows loading state during deletion", async () => {
        mockDeleteBlog.mockImplementation(() => new Promise(resolve => {
            setTimeout(() => resolve({ status: 200 }), 500);
        }));
        setup();

        fireEvent.click(screen.getByTestId("delete"));
        expect(screen.getByTestId("progress")).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.queryByTestId("progress")).not.toBeInTheDocument();
        });
    });

    it("handles deletion error", async () => {
        mockDeleteBlog.mockResolvedValue({ status: 500 });
        setup();

        fireEvent.click(screen.getByTestId("delete"));

        await waitFor(() => {
            expect(screen.getByText("Failed to delete blog")).toBeInTheDocument();
        });
    });

    it("redirects to login when unauthorized (401)", async () => {
        mockDeleteBlog.mockResolvedValue({ status: 401 });
        setup();

        fireEvent.click(screen.getByTestId("delete"));

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith("/login");
        });
    });

    it("properly formats the image URL", () => {
        const blogWithSpaces = {
            ...mockBlog,
            image: "test image.jpg"
        };
        setup(blogWithSpaces);

        expect(screen.getByRole("img")).toHaveAttribute(
            "src",
            expect.stringContaining("test%20image.jpg")
        );
    });

});