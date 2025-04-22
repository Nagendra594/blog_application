import { describe, it, expect, vi, beforeAll, Mock } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./Loginpage";
import { login } from "../../services/AuthServices/AuthServices";
vi.mock('../../services/AuthServices/AuthServices', () => ({
    login: vi.fn()
}));

vi.mock("react-router-dom", async (importOriginal) => {
    const actual = await importOriginal() as object;
    return {
        ...actual,
        useSearchParams: () => [new URLSearchParams("?m=success"), vi.fn()],
        useNavigate: () => vi.fn()

    };
});

const setupRouter = (initialEntries = ["/login"]) => {
    const router = createMemoryRouter(
        [
            {
                path: "/login",
                element: <LoginPage />,

            },
        ],
        { initialEntries }
    );
    return router;
}

describe("LoginPage Component", () => {
    beforeAll(() => {
        vi.clearAllMocks();
    });

    it("renders without crashing", () => {
        render(<RouterProvider router={setupRouter()} />);
        expect(screen.getByText("Login")).toBeInTheDocument();
    });

    it("button is initially disabled", () => {
        render(<RouterProvider router={setupRouter()} />);
        const submitButton = screen.getByRole("button", { name: /log in/i });
        expect(submitButton).toBeDisabled();
    });

    it("button remains disabled with invalid email", () => {
        render(<RouterProvider router={setupRouter()} />);
        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const submitButton = screen.getByRole("button", { name: /log in/i });

        fireEvent.change(emailInput, { target: { value: "invalid-email" } });
        fireEvent.change(passwordInput, { target: { value: "validPassword123" } });

        expect(submitButton).toBeDisabled();
    });

    it("button remains disabled with invalid password", () => {
        render(<RouterProvider router={setupRouter()} />);
        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const submitButton = screen.getByRole("button", { name: /log in/i });

        fireEvent.change(emailInput, { target: { value: "test@example.com" } });
        fireEvent.change(passwordInput, { target: { value: "short" } });

        expect(submitButton).toBeDisabled();
    });

    it("button becomes enabled with valid inputs and touched fields", () => {
        render(<RouterProvider router={setupRouter()} />);
        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const submitButton = screen.getByRole("button", { name: /log in/i });

        fireEvent.change(passwordInput, { target: { value: "validPassword123" } });
        fireEvent.change(emailInput, { target: { value: "test@example.com" } });

        expect(submitButton).not.toBeDisabled();
    });
    it("submits the form and handles login success", async () => {

        const mockLogin = vi.fn().mockResolvedValue({
            status: 200,
            data: "user",
        });
        vi.mocked(login).mockImplementation(mockLogin);


        render(<RouterProvider router={setupRouter()} />);



        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const form = screen.getByTestId("form");

        fireEvent.change(emailInput, { target: { value: "test@example.com" } });
        fireEvent.change(passwordInput, { target: { value: "validpassword" } });

        fireEvent.submit(form)


        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith({
                email: "test@example.com",
                password: "validpassword",
            });
        });
    });
    it("displays an error message when login fails", async () => {
        (login as Mock).mockResolvedValueOnce({
            status: 401,
            message: "wrong password",
        });

        render(<RouterProvider router={setupRouter()} />);

        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const form = screen.getByTestId("form");

        fireEvent.change(emailInput, { target: { value: "test@example.com" } });
        fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });

        fireEvent.submit(form);

        await waitFor(() => {
            const errorAlert = screen.getByText(/wrong password/i);
            expect(errorAlert).toBeInTheDocument();
        });
    });

    it("displays success message when redirected with query params", () => {
        render(<RouterProvider router={setupRouter(["/login?m=success"])} />);
        const successAlert = screen.getByText(/you can logIn now/i);
        expect(successAlert).toBeInTheDocument();
    });
});