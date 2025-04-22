import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserItem from './UserItem';
import { UserModel } from '../../models/UserModel';
import { APIResponseModel } from '../../types/APIResponseModel';
import { deleteAUser } from '../../services/UserServices/userServices';
import { Role } from '../../types/Role.type';


vi.mock('../../services/UserServices/userServices');

const mockUser: UserModel = {
    userid: '123',
    username: 'testuser',
    email: 'test@example.com',
    role: "user" as Role
};

const mockFetchData = vi.fn();

describe('UserItem Component', () => {
    const mockDeleteUser = vi.mocked(deleteAUser);

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders user information correctly', () => {
        render(<UserItem user={mockUser} fetchData={mockFetchData} />);

        expect(screen.getByText('testuser')).toBeInTheDocument();
        expect(screen.getByText('test@example.com')).toBeInTheDocument();
        expect(screen.getByTestId('delete')).toBeInTheDocument();
    });

    it('calls deleteAUser when delete button is clicked', async () => {
        const mockResponse: APIResponseModel<null> = {
            status: 200,
            data: null,
        };
        mockDeleteUser.mockResolvedValue(mockResponse);

        render(<UserItem user={mockUser} fetchData={mockFetchData} />);

        const deleteButton = screen.getByTestId('delete');
        fireEvent.click(deleteButton);

        expect(mockDeleteUser).toHaveBeenCalledWith('123');

        await waitFor(() => {
            expect(mockFetchData).toHaveBeenCalled();
        });
    });

    it('shows loading state during delete operation', async () => {
        const mockResponse: APIResponseModel<null> = {
            status: 200,
            data: null,
        };
        mockDeleteUser.mockResolvedValue(mockResponse);

        render(<UserItem user={mockUser} fetchData={mockFetchData} />);

        const deleteButton = screen.getByTestId('delete')
        fireEvent.click(deleteButton);

        expect(screen.getByRole('progressbar')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
        });
    });

    it('displays error message when delete fails', async () => {
        const mockResponse: APIResponseModel<null> = {
            status: 500,
            data: null,
        };
        mockDeleteUser.mockResolvedValue(mockResponse);

        render(<UserItem user={mockUser} fetchData={mockFetchData} />);

        const deleteButton = screen.getByTestId('delete')
        fireEvent.click(deleteButton);

        await waitFor(() => {
            expect(screen.getByText('Error deleting user')).toBeInTheDocument();
        });
    });

    it('disables delete button during loading', async () => {
        const mockResponse: APIResponseModel<null> = {
            status: 200,
            data: null,
        };
        mockDeleteUser.mockResolvedValue(mockResponse);

        render(<UserItem user={mockUser} fetchData={mockFetchData} />);

        const deleteButton = screen.getByTestId('delete')
        fireEvent.click(deleteButton);

        expect(deleteButton).toBeDisabled();

        await waitFor(() => {
            expect(deleteButton).not.toBeDisabled();
        });
    });
});