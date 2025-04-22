import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { useContext } from 'react';
import { AdminContext, AdminContextProvider } from './adminDataContext';
import { BlogModel } from '../../models/BlogModel';
import { UserModel } from '../../models/UserModel';
import { Role } from '../../types/Role.type';


function TestConsumer() {
    const context = useContext(AdminContext);
    return (
        <div>
            <div data-testid="loading">{context.loading.toString()}</div>
            <div data-testid="error">{context.error}</div>
            <div data-testid="data">{JSON.stringify(context.data)}</div>
            <button
                onClick={() => context.setData({
                    loading: true,
                    data: [[{ userid: '1', username: 'testuser', role: "user" as Role }], []]
                })}
            >
                Update Data
            </button>
            <button onClick={() => context.reset()}>Reset</button>
        </div>
    );
}


function ContextUpdater({ updateFn }: { updateFn: (context: any) => void }) {
    const context = useContext(AdminContext);
    return <button onClick={() => updateFn(context)}>Trigger Update</button>;
}

describe('AdminContext', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should provide default values', () => {
        render(
            <AdminContextProvider>
                <TestConsumer />
            </AdminContextProvider>
        );

        expect(screen.getByTestId('loading')).toHaveTextContent('false');
        expect(screen.getByTestId('error')).toHaveTextContent('');
        expect(screen.getByTestId('data')).toHaveTextContent('[]');
    });

    it('should update context data with setData', async () => {
        render(
            <AdminContextProvider>
                <TestConsumer />
            </AdminContextProvider>
        );

        const updateButton = screen.getByText('Update Data');
        act(() => {
            updateButton.click();
        });

        await vi.waitFor(() => {
            expect(screen.getByTestId('loading')).toHaveTextContent('true');
            expect(screen.getByTestId('data')).toHaveTextContent(
                JSON.stringify([[{ userid: '1', username: 'testuser', role: "user" as Role }], []])
            );
        });
    });

    it('should reset context data', async () => {
        render(
            <AdminContextProvider>
                <TestConsumer />
            </AdminContextProvider>
        );


        const updateButton = screen.getByText('Update Data');
        act(() => {
            updateButton.click();
        });


        const resetButton = screen.getByText('Reset');
        act(() => {
            resetButton.click();
        });

        await vi.waitFor(() => {
            expect(screen.getByTestId('loading')).toHaveTextContent('false');
            expect(screen.getByTestId('error')).toHaveTextContent('');
            expect(screen.getByTestId('data')).toHaveTextContent('[]');
        });
    });

    it('should handle partial updates', async () => {
        let testContext: any;
        const updateFn = (context: any) => {
            testContext = context;
            context.setData({ loading: true });
        };

        render(
            <AdminContextProvider>
                <TestConsumer />
                <ContextUpdater updateFn={updateFn} />
            </AdminContextProvider>
        );

        const triggerButton = screen.getByText('Trigger Update');
        act(() => {
            triggerButton.click();
        });

        await vi.waitFor(() => {
            expect(screen.getByTestId('loading')).toHaveTextContent('true');

            expect(screen.getByTestId('error')).toHaveTextContent('');
            expect(screen.getByTestId('data')).toHaveTextContent('[]');
        });
    });

    it('should handle error state updates', async () => {
        let testContext: any;
        const updateFn = (context: any) => {
            testContext = context;
            context.setData({ error: 'Test error' });
        };

        render(
            <AdminContextProvider>
                <TestConsumer />
                <ContextUpdater updateFn={updateFn} />
            </AdminContextProvider>
        );

        const triggerButton = screen.getByText('Trigger Update');
        act(() => {
            triggerButton.click();
        });

        await vi.waitFor(() => {
            expect(screen.getByTestId('error')).toHaveTextContent('Test error');
        });
    });

    it('should maintain type safety for data structure', async () => {
        const testUsers: UserModel[] = [
            { userid: '1', username: 'user1', email: 'user1@test.com', role: "user" as Role }
        ];
        const testBlogs: BlogModel[] = [
            {
                blogid: '1', title: 'Test Blog', content: 'Test content', userid: '1',
                date: new Date(),
                image: null,
                username: 'test',
                role: "user" as Role
            }
        ];

        let testContext: any;
        const updateFn = (context: any) => {
            testContext = context;
            context.setData({ data: [testUsers, testBlogs] });
        };

        render(
            <AdminContextProvider>
                <TestConsumer />
                <ContextUpdater updateFn={updateFn} />
            </AdminContextProvider>
        );

        const triggerButton = screen.getByText('Trigger Update');
        act(() => {
            triggerButton.click();
        });

        await vi.waitFor(() => {
            const dataText = screen.getByTestId('data').textContent;
            const parsedData = JSON.parse(dataText!);
            expect(Array.isArray(parsedData)).toBe(true);
            expect(parsedData).toHaveLength(2);
            expect(Array.isArray(parsedData[0])).toBe(true);
            expect(Array.isArray(parsedData[1])).toBe(true);
            expect(parsedData[0][0]).toHaveProperty('username');
            expect(parsedData[1][0]).toHaveProperty('title');
        });
    });
});