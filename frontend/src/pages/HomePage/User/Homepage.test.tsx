import { describe, it, expect, vi, Mock } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import UserMainNavigation from "./Homepage";
import { logout } from "../../../services/AuthServices/AuthServices";
import { getUser } from "../../../services/UserServices/userServices"
import UserContext from "../../../context/UserDataCtx/userContext";
import { Role } from "../../../types/Role.type";
import dotenv from "dotenv"
dotenv.config();

vi.mock("../../../services/AuthServices/AuthServices", () => ({
    logout: vi.fn(),
}));

vi.mock("../../../services/UserServices/userServices", () => ({
    getUser: vi.fn().mockResolvedValue({ status: 200, data: { name: 'John Doe' } }),
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

describe("UserMainNavigation Component", () => {
    const mockLogout = logout as Mock;
    const mockGetUser = getUser as Mock;
    const mockContextValue = {
        username: "testuser",
        userid: "1",
        role: "user" as Role,
        loading: false,
        error: null as string | null,
        setUser: vi.fn(),
        reset: vi.fn(),
    };



    const setup = (contextValue = mockContextValue) => {
        const router = createMemoryRouter([
            {
                path: "/",
                element: (
                    <UserContext.Provider value={contextValue}>
                        <UserMainNavigation />
                    </UserContext.Provider>
                ),
            },
        ], { initialEntries: ["/"] });

        return render(<RouterProvider router={router} />);
    };

    it("renders without crashing", () => {
        setup();
        expect(screen.getByText("User Dashboard")).toBeInTheDocument();
        expect(screen.getByText("testuser")).toBeInTheDocument();
        expect(screen.getByText("Logout")).toBeInTheDocument();
    });

    it("fetches user data on mount", async () => {
        const mockUserData = {
            id: "1",
            username: "testuser",
            email: "test@example.com",
            role: "user"
        };
        mockGetUser.mockResolvedValueOnce({
            status: 200,
            data: mockUserData
        });

        const mockSetUser = vi.fn();
        const testContext = {
            ...mockContextValue,
            setUser: mockSetUser
        };

        setup(testContext);

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
        localStorage.setItem("role", "user");

        mockGetUser.mockResolvedValueOnce({
            status: 401,
            data: null,
            message: "Unauthorized"
        });

        const mockReset = vi.fn();
        const testContext = {
            ...mockContextValue,
            reset: mockReset
        };

        setup(testContext);

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith("/login");

            expect(localStorage.getItem("isLogged")).toBeNull();
            expect(localStorage.getItem("role")).toBeNull();


            expect(mockGetUser).toHaveBeenCalled();
        });
    });
    it("handles logout successfully", async () => {
        mockLogout.mockResolvedValueOnce({ status: 200 });
        localStorage.setItem("isLogged", "true");
        localStorage.setItem("role", "user");

        setup();

        fireEvent.click(screen.getByText("Logout"));

        await waitFor(() => {
            expect(mockLogout).toHaveBeenCalled();
            expect(mockContextValue.reset).toHaveBeenCalled();
            expect(mockNavigate).toHaveBeenCalledWith("/login");
            expect(localStorage.getItem("isLogged")).toBeNull();
        });
    });

    it("handles logout failure", async () => {
        mockLogout.mockResolvedValueOnce({ status: 500 });
        const mockAlert = vi.spyOn(window, "alert").mockImplementation(() => { });

        setup();

        fireEvent.click(screen.getByText("Logout"));

        await waitFor(() => {
            expect(mockAlert).toHaveBeenCalledWith("Logout failed");
        });

        mockAlert.mockRestore();
    });
    it("renders Outlet content", () => {
        setup();
        expect(screen.getByText("Outlet Content")).toBeInTheDocument();
    });
});