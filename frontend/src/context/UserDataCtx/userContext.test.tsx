import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { useContext } from 'react';
import UserContext, { UserProvider } from './userContext';

function TestConsumer() {
    const context = useContext(UserContext);
    return (
        <div>
            <div data-testid="userid">{context.userid}</div>
            <div data-testid="username">{context.username}</div>
            <div data-testid="email">{context.email}</div>
            <div data-testid="role">{context.role}</div>
            <div data-testid="error">{context.error}</div>
            <div data-testid="loading">{context.loading.toString()}</div>
            <button onClick={() => context.setUser({ username: 'newuser' })}>
                Update User
            </button>
            <button onClick={() => context.reset()}>Reset</button>
        </div>
    );
}

describe('UserContext', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should provide default values', () => {
        render(
            <UserProvider>
                <TestConsumer />
            </UserProvider>
        );

        expect(screen.getByTestId('userid')).toHaveTextContent('');
        expect(screen.getByTestId('username')).toHaveTextContent('');
        expect(screen.getByTestId('email')).toHaveTextContent('');
        expect(screen.getByTestId('role')).toHaveTextContent('');
        expect(screen.getByTestId('error')).toHaveTextContent('');
        expect(screen.getByTestId('loading')).toHaveTextContent('false');
    });

    it('should update user details with setUser', async () => {
        render(
            <UserProvider>
                <TestConsumer />
            </UserProvider>
        );

        const updateButton = screen.getByText('Update User');
        act(() => {
            updateButton.click();
        });

        await vi.waitFor(() => {
            expect(screen.getByTestId('username')).toHaveTextContent('newuser');
        });
    });

    it('should reset user details', async () => {
        render(
            <UserProvider>
                <TestConsumer />
            </UserProvider>
        );


        const updateButton = screen.getByText('Update User');
        act(() => {
            updateButton.click();
        });


        const resetButton = screen.getByText('Reset');
        act(() => {
            resetButton.click();
        });

        await vi.waitFor(() => {
            expect(screen.getByTestId('username')).toHaveTextContent('');
            expect(screen.getByTestId('userid')).toHaveTextContent('');
            expect(screen.getByTestId('email')).toHaveTextContent('');
            expect(screen.getByTestId('error')).toHaveTextContent('');
            expect(screen.getByTestId('loading')).toHaveTextContent('false');
        });
    });

    it('should handle partial updates', async () => {
        render(
            <UserProvider>
                <TestConsumer />
            </UserProvider>
        );


        const updateButton = screen.getByText('Update User');
        act(() => {
            updateButton.click();
        });

        await vi.waitFor(() => {
            expect(screen.getByTestId('username')).toHaveTextContent('newuser');

            expect(screen.getByTestId('userid')).toHaveTextContent('');
            expect(screen.getByTestId('email')).toHaveTextContent('');
        });
    });

    it('should update multiple fields at once', async () => {
        function MultiUpdateTest() {
            const context = useContext(UserContext);
            return (
                <button
                    onClick={() =>
                        context.setUser({
                            username: 'multi',
                            email: 'multi@test.com',
                            loading: true,
                        })
                    }
                >
                    Multi Update
                </button>
            );
        }

        render(
            <UserProvider>
                <TestConsumer />
                <MultiUpdateTest />
            </UserProvider>
        );

        const multiUpdateButton = screen.getByText('Multi Update');
        act(() => {
            multiUpdateButton.click();
        });

        await vi.waitFor(() => {
            expect(screen.getByTestId('username')).toHaveTextContent('multi');
            expect(screen.getByTestId('email')).toHaveTextContent('multi@test.com');
            expect(screen.getByTestId('loading')).toHaveTextContent('true');
        });
    });

    it('should handle error and loading states', async () => {
        function StateTest() {
            const context = useContext(UserContext);
            return (
                <button
                    onClick={() =>
                        context.setUser({
                            error: 'Test error',
                            loading: true,
                        })
                    }
                >
                    Update States
                </button>
            );
        }

        render(
            <UserProvider>
                <TestConsumer />
                <StateTest />
            </UserProvider>
        );

        const stateButton = screen.getByText('Update States');
        act(() => {
            stateButton.click();
        });

        await vi.waitFor(() => {
            expect(screen.getByTestId('error')).toHaveTextContent('Test error');
            expect(screen.getByTestId('loading')).toHaveTextContent('true');
        });
    });
});