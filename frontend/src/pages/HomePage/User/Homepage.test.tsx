import { describe, it, expect, vi, Mock } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { createMemoryRouter, MemoryRouter, RouterProvider } from "react-router-dom";
import UserMainNavigation from "./Homepage";
import { logout } from "../../../services/AuthServices/AuthServices";
import { getUser } from "../../../services/UserServices/userServices"
import { Role } from "../../../types/Role.type";
import dotenv from "dotenv"
import { userReducer, UserSliceType } from "../../../store/UserSlice/UserSlice";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
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
    const mockStore = (initialState: { userState: UserSliceType }) => {
        return configureStore({
            reducer: {
                userState: userReducer
            },
            preloadedState: initialState
        });
    };




    const setup = (userData: UserSliceType) => {
        const store = mockStore({
            userState: userData
        });
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <UserMainNavigation />
                </MemoryRouter>
            </Provider>
        );

    };

    it("renders without crashing", () => {
        setup({
            loading: false,
            error: null,
            userid: "123",
            username: "dummy",
            role: Role.user
        });
        expect(screen.getByText("User Dashboard")).toBeInTheDocument();
        expect(screen.getByText("dummy")).toBeInTheDocument();
        expect(screen.getByText("Logout")).toBeInTheDocument();
    });

    it("fetches user data on mount", async () => {
        const mockUserData: UserSliceType = {
            userid: "1",
            username: "testuser",
            email: "test@example.com",
            role: Role.user,
            error: null,
            loading: false
        };
        mockGetUser.mockResolvedValueOnce({
            status: 200,
            data: mockUserData
        });



        setup(mockUserData);

        await waitFor(() => {
            expect(mockGetUser).toHaveBeenCalled();


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



        setup({
            loading: false,
            error: "UnAuthenticated",
            userid: "123",
            username: "dummy",
            role: Role.user
        });

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

        setup({
            loading: false,
            error: null,
            userid: "123",
            username: "dummy",
            role: Role.user
        });

        fireEvent.click(screen.getByText("Logout"));

        await waitFor(() => {
            expect(mockLogout).toHaveBeenCalled();

            expect(mockNavigate).toHaveBeenCalledWith("/login");
            expect(localStorage.getItem("isLogged")).toBeNull();
        });
    });

    it("handles logout failure", async () => {
        mockLogout.mockResolvedValueOnce({ status: 500 });
        const mockAlert = vi.spyOn(window, "alert").mockImplementation(() => { });

        setup({
            loading: false,
            error: null,
            userid: "123",
            username: "dummy",
            role: Role.user
        });

        fireEvent.click(screen.getByText("Logout"));

        await waitFor(() => {
            expect(mockAlert).toHaveBeenCalledWith("Logout failed");
        });

        mockAlert.mockRestore();
    });
    it("renders Outlet content", () => {
        setup({
            loading: false,
            error: null,
            userid: "123",
            username: "dummy",
            role: Role.user
        });
        expect(screen.getByText("Outlet Content")).toBeInTheDocument();
    });
});