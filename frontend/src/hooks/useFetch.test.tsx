import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest';
import { render, screen, act, fireEvent } from '@testing-library/react';
import useFetch from './useFetch';

import { useNavigate } from 'react-router-dom';

vi.mock('react-router-dom', () => ({
    useNavigate: vi.fn(),
}));

function TestComponent({ fetchService }: { fetchService: () => Promise<any> }) {
    const { data, loading, error, fetchAgain } = useFetch(fetchService);
    return (
        <div>
            <div data-testid="data">{JSON.stringify(data)}</div>
            <div data-testid="loading">{loading ? 'Loading...' : 'Not loading'}</div>
            <div data-testid="error">{error}</div>
            <button onClick={() => fetchAgain(new AbortController().signal)}>
                Refetch
            </button>
        </div>
    );
}

describe('useFetch hook', () => {
    const mockNavigate = vi.fn();
    let mockFetchService: Mock;
    let mockAbortController: { abort: Mock; signal: AbortSignal };

    beforeEach(() => {
        (useNavigate as Mock).mockReturnValue(mockNavigate);
        vi.spyOn(Storage.prototype, 'clear').mockImplementation(() => { });

        mockAbortController = {
            abort: vi.fn(),
            signal: {} as AbortSignal,
        };
        vi.spyOn(window, 'AbortController').mockImplementation(() => mockAbortController);

        mockFetchService = vi.fn();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should initialize with loading state', async () => {
        mockFetchService.mockResolvedValue({
            status: 200,
            data: { test: 'data' },
        });

        render(<TestComponent fetchService={mockFetchService} />);

        expect(screen.getByTestId('loading')).toHaveTextContent('Loading...');
    });

    it('should handle successful fetch', async () => {
        const mockData = { test: 'data' };
        mockFetchService.mockResolvedValue({
            status: 200,
            data: mockData,
        });

        render(<TestComponent fetchService={mockFetchService} />);

        await vi.waitFor(() => {
            expect(screen.getByTestId('loading')).toHaveTextContent('Not loading');
            expect(screen.getByTestId('data')).toHaveTextContent(JSON.stringify(mockData));
            expect(screen.getByTestId('error')).toHaveTextContent('');
        });
    });

    it('should handle fetch error', async () => {
        mockFetchService.mockResolvedValue({
            status: 500,
            data: null,
        });

        render(<TestComponent fetchService={mockFetchService} />);

        await vi.waitFor(() => {
            expect(screen.getByTestId('loading')).toHaveTextContent('Not loading');
            expect(screen.getByTestId('error')).toHaveTextContent('Failed to fetch content');
        });
    });

    it('should handle unauthorized (401) response', async () => {
        mockFetchService.mockResolvedValue({
            status: 401,
            data: null,
        });

        render(<TestComponent fetchService={mockFetchService} />);

        await vi.waitFor(() => {
            expect(localStorage.clear).toHaveBeenCalled();
            expect(mockNavigate).toHaveBeenCalledWith('/login');
        });
    });

    it('should abort fetch on unmount', async () => {
        mockFetchService.mockImplementation(
            () => new Promise(() => { })
        );

        const { unmount } = render(<TestComponent fetchService={mockFetchService} />);
        unmount();

        expect(mockAbortController.abort).toHaveBeenCalled();
    });

    it('should allow refetching data', async () => {
        const mockData1 = { test: 'data1' };
        const mockData2 = { test: 'data2' };

        mockFetchService
            .mockResolvedValueOnce({
                status: 200,
                data: mockData1,
            })
            .mockResolvedValueOnce({
                status: 200,
                data: mockData2,
            });

        render(<TestComponent fetchService={mockFetchService} />);

        await vi.waitFor(() => {
            expect(screen.getByTestId('data')).toHaveTextContent(JSON.stringify(mockData1));
        });

        await act(async () => {
            fireEvent.click(screen.getByText('Refetch'));
        });

        await vi.waitFor(() => {
            expect(screen.getByTestId('data')).toHaveTextContent(JSON.stringify(mockData2));
            expect(mockFetchService).toHaveBeenCalledTimes(2);
        });
    });
});