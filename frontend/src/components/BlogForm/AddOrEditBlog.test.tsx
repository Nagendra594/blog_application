import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AddOrEditBlogModal from "./AddOrEditBlog";
import { insertBlog, updateBlog } from "../../services/BlogServices/blogServices";
import { BlogModel } from "../../models/BlogModel";
import { Role } from "../../types/Role.type";

vi.mock("../../services/BlogServices/blogServices", () => ({
    insertBlog: vi.fn(),
    updateBlog: vi.fn()
}));

const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
    useNavigate: () => mockNavigate,
}));

describe("AddOrEditBlogModal Component", () => {
    const mockInsertBlog = insertBlog as Mock;
    const mockUpdateBlog = updateBlog as Mock;
    const mockHandleClose = vi.fn();
    const mockFetch = vi.fn();

    const mockBlog: BlogModel = {
        blogid: "1",
        title: "Existing Blog",
        content: "Existing content",
        userid: "123",
        username: "testuser",
        date: new Date(),
        image: "existing-image.jpg",
        role: "user" as Role
    };

    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
        mockInsertBlog.mockReset();
        mockUpdateBlog.mockReset();
    });

    const setup = (props = {}) => {
        const defaultProps = {
            open: true,
            handleClose: mockHandleClose,
            blog: null,
            fetch: mockFetch,
            ...props
        };

        return render(<AddOrEditBlogModal {...defaultProps} />);
    };

    it("renders in add mode correctly", () => {
        setup();

        expect(screen.getAllByText("Add Blog").length).not.toBe(0);
        expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Content/i)).toBeInTheDocument();
        expect(screen.getByText(/Upload Image/i)).toBeInTheDocument();
    });

    it("renders in edit mode correctly", () => {
        setup({ blog: mockBlog });

        expect(screen.getByText("Update Blog")).toBeInTheDocument();
        expect(screen.getByDisplayValue("Existing Blog")).toBeInTheDocument();
        expect(screen.getByDisplayValue("Existing content")).toBeInTheDocument();
        expect(screen.getByText("Update")).toBeInTheDocument();
    });

    it("validates form inputs", async () => {
        setup();

        const submitButton = screen.getByRole("button", { name: /Add Blog/i });
        expect(submitButton).toBeDisabled();

        fireEvent.change(screen.getByLabelText(/Title/i), {
            target: { value: "Test Title" }
        });
        fireEvent.change(screen.getByLabelText(/Content/i), {
            target: { value: "Test Content" }
        });

        expect(submitButton).toBeDisabled();

        const file = new File(["test"], "test.png", { type: "image/png" });
        fireEvent.change(screen.getByLabelText(/Upload Image/i), {
            target: { files: [file] }
        });

        await waitFor(() => {
            expect(submitButton).not.toBeDisabled();
        });
    });

    it("handles successful blog creation", async () => {
        mockInsertBlog.mockResolvedValue({ status: 201 });
        setup();


        fireEvent.change(screen.getByLabelText(/Title/i), {
            target: { value: "New Blog" }
        });
        fireEvent.change(screen.getByLabelText(/Content/i), {
            target: { value: "New Content" }
        });


        const file = new File(["test"], "test.png", { type: "image/png" });
        fireEvent.change(screen.getByLabelText(/Upload Image/i), {
            target: { files: [file] }
        });

        fireEvent.click(screen.getByRole("button", { name: /Add Blog/i }));

        await waitFor(() => {
            expect(mockInsertBlog).toHaveBeenCalled();
            expect(mockFetch).toHaveBeenCalled();
            expect(mockHandleClose).toHaveBeenCalled();
        });
    });

    it("handles successful blog update", async () => {
        mockUpdateBlog.mockResolvedValue({ status: 200 });
        setup({ blog: mockBlog });


        fireEvent.change(screen.getByLabelText(/Title/i), {
            target: { value: "Updated Title" }
        });

        fireEvent.click(screen.getByText("Update"));

        await waitFor(() => {
            expect(mockUpdateBlog).toHaveBeenCalledWith({
                blogid: "1",
                title: "Updated Title",
                content: "Existing content",
                image: "existing-image.jpg"
            });
            expect(mockFetch).toHaveBeenCalled();
            expect(mockHandleClose).toHaveBeenCalled();
        });
    });

    it("shows error message when creation fails", async () => {
        mockInsertBlog.mockResolvedValue({ status: 500 });
        setup();


        fireEvent.change(screen.getByLabelText(/Title/i), {
            target: { value: "New Blog" }
        });
        fireEvent.change(screen.getByLabelText(/Content/i), {
            target: { value: "New Content" }
        });


        const file = new File(["test"], "test.png", { type: "image/png" });
        fireEvent.change(screen.getByLabelText(/Upload Image/i), {
            target: { files: [file] }
        });

        fireEvent.click(screen.getByRole("button", { name: /Add Blog/i }));

        await waitFor(() => {
            expect(screen.getByText("Failed to add blog")).toBeInTheDocument();
        });
    });

    it("redirects to login when unauthorized", async () => {
        mockInsertBlog.mockResolvedValue({ status: 401 });
        setup();

        fireEvent.change(screen.getByLabelText(/Title/i), {
            target: { value: "New Blog" }
        });
        fireEvent.change(screen.getByLabelText(/Content/i), {
            target: { value: "New Content" }
        });


        const file = new File(["test"], "test.png", { type: "image/png" });
        fireEvent.change(screen.getByLabelText(/Upload Image/i), {
            target: { files: [file] }
        });

        fireEvent.click(screen.getByRole("button", { name: /Add Blog/i }));

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith("/login");

        });
    });

    it("shows loading state during submission", async () => {
        mockInsertBlog.mockImplementation(() => new Promise(resolve => {
            setTimeout(() => resolve({ status: 201 }), 500);
        }));
        setup();


        fireEvent.change(screen.getByLabelText(/Title/i), {
            target: { value: "New Blog" }
        });
        fireEvent.change(screen.getByLabelText(/Content/i), {
            target: { value: "New Content" }
        });


        const file = new File(["test"], "test.png", { type: "image/png" });
        fireEvent.change(screen.getByLabelText(/Upload Image/i), {
            target: { files: [file] }
        });

        fireEvent.click(screen.getByRole("button", { name: /Add Blog/i }));

        expect(screen.getByRole("progressbar")).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
        });
    });

    it("Button is disabled at initial rendering", async () => {
        setup();

        expect(screen.getByRole("button", { name: /Add Blog/i })).toBeDisabled();
    });
});