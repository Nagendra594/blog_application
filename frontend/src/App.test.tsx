import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "./App";

vi.mock("react-router", async () => {
    const actual = await vi.importActual("react-router");
    return {
        ...actual,
        RouterProvider: ({ router }: any) => <div data-testid="mock-router">Router Loaded</div>,
    };
});

vi.mock("./context/UserDataCtx/userContext", () => {
    return {
        UserProvider: ({ children }: any) => <div data-testid="user-provider">{children}</div>
    };
});

vi.mock("./routes/AppRoutes.js", () => {
    return {
        default: {}
    };
});

describe("App Component", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders RouterProvider inside UserProvider", () => {
        render(<App />);

        const userProvider = screen.getByTestId("user-provider");
        const routerProvider = screen.getByTestId("mock-router");

        expect(userProvider).toBeInTheDocument();
        expect(routerProvider).toBeInTheDocument();
    });
});
