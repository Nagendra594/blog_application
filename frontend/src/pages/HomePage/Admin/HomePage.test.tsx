import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { createMemoryRouter, MemoryRouter, RouterProvider } from "react-router-dom";
import AdminMainNavigation from "./HomePage";
import { logout } from "../../../services/AuthServices/AuthServices";
import { getAllUsers, getUser } from "../../../services/UserServices/userServices";

import { UserModel } from "../../../models/UserModel";
import { Role } from "../../../types/Role.type";
import { BlogModel } from "../../../models/BlogModel";
import { getBlogs } from "../../../services/BlogServices/blogServices";
import { adminReducer, AdminSliceType } from "../../../store/AdminDataSlice/AdminDataSlice";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { userReducer, UserSliceType } from "../../../store/UserSlice/UserSlice";
import { APIResponseModel } from "../../../types/APIResponseModel";


vi.mock("../../../services/AuthServices/AuthServices", () => ({
    logout: vi.fn(),

}));

vi.mock("../../../services/UserServices/userServices", () => ({
    getUser: vi.fn().mockResolvedValue({ status: 200, data: { name: "admin" } }),
}))
vi.mock("../../../services/UserServices/userServices");
vi.mock("../../../services/BlogServices/blogServices")
const mockNavigate = vi.fn();
const mockDispatch = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => {
    const actual = await importOriginal() as object;
    return {
        ...actual,
        useNavigate: () => mockNavigate,
        Outlet: () => <div>Outlet Content</div>,
        useDispatch: () => mockDispatch
    };
});
const mockGetAllUsers = getAllUsers as Mock;
const mockGetBlogs = getBlogs as Mock;

describe("AdminMainNavigation Component", () => {
    const mockLogout = logout as Mock;
    const mockGetUser = getUser as Mock;
    const mockStore = (initialState: { userState: UserSliceType, AdminDataState: AdminSliceType }) => {
        return configureStore({
            reducer: {
                userState: userReducer,
                AdminDataState: adminReducer
            },
            preloadedState: initialState
        });
    };

    const mockAdmin = {
        userid: "1",
        username: "adminuser",
        email: "admin@example.com",
        role: "admin" as Role,
        loading: false,
        error: null as string | null,

    };

    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    const setup = (


    ) => {
        const mockUsers: UserModel[] = [
            {
                userid: '1', username: 'user1', email: 'user1@test.com',
                role: Role.user
            }
        ];
        const mockBlogs: BlogModel[] = [
            {
                blogid: '1', title: 'Blog 1', username: 'user1',
                content: 'dummy',
                date: new Date(),
                image: null,
                userid: '1',
                role: Role.user
            }
        ];

        const store = mockStore({
            userState: mockAdmin,
            AdminDataState: {
                loading: false,
                error: null,
                data: [mockUsers, mockBlogs]
            }
        });

        render(
            <Provider store={store}>
                <MemoryRouter>
                    <AdminMainNavigation />
                </MemoryRouter>
            </Provider>
        );
    };

    it("renders without crashing", () => {
        const mockedRes1: APIResponseModel<UserModel[]> = { status: 200 }

        mockGetUser.mockResolvedValue(mockedRes1)
        setup();

        expect(screen.getByText("Admin Dashboard")).toBeInTheDocument();
        expect(screen.getByText("adminuser")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /logout/i })).toBeInTheDocument();

    });

    it("fetches user data on mount", async () => {
        const mockUserData: UserModel = {
            userid: "1",
            username: "adminuser",
            email: "admin@example.com",
            role: "admin" as Role
        };
        mockGetUser.mockResolvedValueOnce({ status: 200, data: mockUserData });


        setup();

        await waitFor(() => {
            expect(mockGetUser).toHaveBeenCalled();


        });
    });

    it("handles unauthorized user", async () => {
        localStorage.setItem("isLogged", "true");
        mockGetUser.mockResolvedValueOnce({ status: 401, data: null });



        setup(

        );

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith("/login");

            expect(localStorage.getItem("isLogged")).toBeNull();
        });
    });

    it("handles successful logout", async () => {
        localStorage.setItem("isLogged", "true");
        mockLogout.mockResolvedValueOnce({ status: 200 });

        setup(

        );

        fireEvent.click(screen.getByRole("button", { name: /logout/i }));

        await waitFor(() => {
            expect(mockLogout).toHaveBeenCalled();

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



    it("renders Outlet content", () => {
        setup();
        expect(screen.getByText("Outlet Content")).toBeInTheDocument();
    });
});