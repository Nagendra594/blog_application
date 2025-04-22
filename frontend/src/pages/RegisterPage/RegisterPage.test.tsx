import { describe, it, expect, vi, Mock } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import SignupPage from "./Registerpage"
import { register } from "../../services/AuthServices/AuthServices";

vi.mock("../../services/AuthServices/AuthServices", () => ({
    register: vi.fn(),
}));

vi.mock("react-router-dom", async (importOriginal) => {
    const actual = await importOriginal() as object;
    return {
        ...actual,
        useNavigate: () => vi.fn(),
    };
});

describe("SignupPage Component", () => {
    const mockRegister = register as Mock;



    const setup = () => {
        const router = createMemoryRouter([
            {
                path: "/register",
                element: <SignupPage />,
            },
        ], { initialEntries: ["/register"] });

        return render(<RouterProvider router={router} />);
    };

    it("renders without crashing", () => {
        setup();
        expect(screen.getByText("Sign Up")).toBeInTheDocument();
    });

    it("displays validation errors for invalid inputs", async () => {
        setup();

        const usernameInput = screen.getByLabelText(/username/i);
        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByLabelText(/password/i);

        fireEvent.change(usernameInput, { target: { value: "ab" } });
        fireEvent.blur(usernameInput);
        expect(usernameInput).toHaveAttribute("aria-invalid", "true");

        fireEvent.change(emailInput, { target: { value: "invalid-email" } });
        fireEvent.blur(emailInput);
        expect(emailInput).toHaveAttribute("aria-invalid", "true");

        fireEvent.change(passwordInput, { target: { value: "short" } });
        fireEvent.blur(passwordInput);
        expect(passwordInput).toHaveAttribute("aria-invalid", "true");
    });

    it("enables submit button only when all fields are valid", async () => {
        setup();

        const submitButton = screen.getByRole("button", { name: /sign up/i });
        expect(submitButton).toBeDisabled();

        fireEvent.change(screen.getByLabelText(/username/i), { target: { value: "validuser" } });
        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "test@example.com" } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "validpassword123" } });

        expect(submitButton).not.toBeDisabled();
    });

    it("handles successful registration", async () => {
        mockRegister.mockResolvedValueOnce({ status: 200 });
        setup();

        fireEvent.change(screen.getByLabelText(/username/i), { target: { value: "validuser" } });
        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "test@example.com" } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "validpassword123" } });

        fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

        await waitFor(() => {
            expect(mockRegister).toHaveBeenCalledWith({
                username: "validuser",
                email: "test@example.com",
                password: "validpassword123"
            });
        });
    });

    it("displays error message when registration fails", async () => {
        mockRegister.mockResolvedValueOnce({
            status: 409,
            message: "user already exists"
        });
        setup();

        fireEvent.change(screen.getByLabelText(/username/i), { target: { value: "existinguser" } });
        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "exists@example.com" } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "password123" } });

        fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

        await waitFor(() => {
            expect(screen.getByText(/user already exists/i)).toBeInTheDocument();
        });
    });



    it("shows loading indicator during submission", async () => {
        mockRegister.mockImplementationOnce(() => new Promise(resolve => {
            setTimeout(() => resolve({ status: 200 }), 500);
        }));

        setup();

        fireEvent.change(screen.getByLabelText(/username/i), { target: { value: "testuser" } });
        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "test@example.com" } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "testpassword" } });

        fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

        expect(screen.getByRole("progressbar")).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
        });
    });
});