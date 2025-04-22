import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import AdminMainNavigation from "./HomePage";
import { logout } from "../../../services/AuthServices/AuthServices";
import { getUser } from "../../../services/UserServices/userServices";
import UserContext from "../../../context/UserDataCtx/userContext";
import { AdminContext } from "../../../context/AdmindataCtx/adminDataContext";
import { UserModel } from "../../../models/UserModel";
import { Role } from "../../../types/Role.type";
import { BlogModel } from "../../../models/BlogModel";


vi.mock("../../../services/AuthServices/AuthServices", () => ({
    logout: vi.fn(),

}));

vi.mock("../../../services/UserServices/userServices", () => ({
    getUser: vi.fn().mockResolvedValue({ status: 200, data: { name: "admin" } }),
}))

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => {
    const actual = await importOriginal() as object;
    return {
        ...actual,
        useNavigate: () => mockNavigate,
        Outlet: () => <div>Outlet Content</div>,
    };
});

describe("AdminMainNavigation Component", () => {
    const mockLogout = logout as Mock;
    const mockGetUser = getUser as Mock;


    const mockUserContext = {
        userid: "1",
        username: "adminuser",
        email: "admin@example.com",
        role: "admin" as Role,
        loading: false,
        error: null as string | null,
        setUser: vi.fn(),
        reset: vi.fn(),
    };

    const mockAdminContext = {
        loading: false,
        error: null,
        data: [] as [] | [UserModel[], BlogModel[]],
        setData: vi.fn(),
        reset: vi.fn(),
    };

    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    const setup = (
        userContext = mockUserContext,
        adminContext = mockAdminContext
    ) => {
        const router = createMemoryRouter([
            {
                path: "/",
                element: (
                    <UserContext.Provider value={userContext}>
                        <AdminContext.Provider value={adminContext}>
                            <AdminMainNavigation />
                        </AdminContext.Provider>
                    </UserContext.Provider>
                ),
            },
        ], { initialEntries: ["/"] });

        return render(<RouterProvider router={router} />);
    };

    it("renders without crashing", () => {
        setup();
        expect(screen.getByText("Admin Dashboard")).toBeInTheDocument();
        expect(screen.getByText("adminuser")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /logout/i })).toBeInTheDocument();
        expect(screen.getByAltText("Admin")).toBeInTheDocument();
    });

    it("fetches user data on mount", async () => {
        const mockUserData: UserModel = {
            userid: "1",
            username: "adminuser",
            email: "admin@example.com",
            role: "admin" as Role
        };
        mockGetUser.mockResolvedValueOnce({ status: 200, data: mockUserData });

        const mockSetUser = vi.fn();
        setup({
            ...mockUserContext,
            setUser: mockSetUser
        });

        await waitFor(() => {
            expect(mockGetUser).toHaveBeenCalled();
            expect(mockSetUser).toHaveBeenNthCalledWith(1, {
                loading: true,
                error: null
            });
            expect(mockSetUser).toHaveBeenNthCalledWith(2, {
                ...mockUserData,
                loading: false,
                error: null
            });
        });
    });

    it("handles unauthorized user", async () => {
        localStorage.setItem("isLogged", "true");
        mockGetUser.mockResolvedValueOnce({ status: 401, data: null });

        const mockUserReset = vi.fn();
        const mockAdminReset = vi.fn();

        setup(
            { ...mockUserContext, reset: mockUserReset },
            { ...mockAdminContext, reset: mockAdminReset }
        );

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith("/login");
            expect(mockUserReset).toHaveBeenCalled();
            expect(mockAdminReset).toHaveBeenCalled();
            expect(localStorage.getItem("isLogged")).toBeNull();
        });
    });

    it("handles successful logout", async () => {
        localStorage.setItem("isLogged", "true");
        mockLogout.mockResolvedValueOnce({ status: 200 });

        const mockUserReset = vi.fn();
        const mockAdminReset = vi.fn();

        setup(
            { ...mockUserContext, reset: mockUserReset },
            { ...mockAdminContext, reset: mockAdminReset }
        );

        fireEvent.click(screen.getByRole("button", { name: /logout/i }));

        await waitFor(() => {
            expect(mockLogout).toHaveBeenCalled();
            expect(mockUserReset).toHaveBeenCalled();
            expect(mockAdminReset).toHaveBeenCalled();
            expect(mockNavigate).toHaveBeenCalledWith("/login");
            expect(localStorage.getItem("isLogged")).toBeNull();
        });
    });

    it("handles logout failure", async () => {
        mockLogout.mockResolvedValueOnce({ status: 500 });
        const mockAlert = vi.spyOn(window, "alert").mockImplementation(() => { });

        setup();

        fireEvent.click(screen.getByRole("button", { name: /logout/i }));

        await waitFor(() => {
            expect(mockAlert).toHaveBeenCalledWith("Logout failed");
            expect(mockNavigate).not.toHaveBeenCalled();
        });

        mockAlert.mockRestore();
    });


    it("shows error state", () => {
        const errorMessage = "Failed to load user";
        setup({
            ...mockUserContext,
            error: errorMessage
        });

        expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    it("renders Outlet content", () => {
        setup();
        expect(screen.getByText("Outlet Content")).toBeInTheDocument();
    });
});