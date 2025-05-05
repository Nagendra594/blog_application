import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UserItem from './UserItem';
import { UserModel } from '../../models/UserModel';
import { APIResponseModel } from '../../types/APIResponseModel';
import { deleteAUser, getAllUsers } from '../../services/UserServices/userServices';
import { Role } from '../../types/Role.type';
import { adminReducer, AdminSliceType } from '../../store/AdminDataSlice/AdminDataSlice';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { BlogModel } from '../../models/BlogModel';
import { getBlogs } from '../../services/BlogServices/blogServices';


vi.mock('../../services/UserServices/userServices');
vi.mock("../../services/BlogServices/blogServices");
const mockDispatch = vi.fn();
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
        useDispatch: () => mockDispatch
    };
});

const mockUser: UserModel = {
    userid: '123',
    username: 'testuser',
    email: 'test@example.com',
    role: "user" as Role
};

const mockFetchData = vi.fn();

const mockGetAllUsers = getAllUsers as Mock;
const mockGetBlogs = getBlogs as Mock;
describe('UserItem Component', () => {
    const mockDeleteUser = vi.mocked(deleteAUser);
    const mockStore = (initialState: { AdminDataState: AdminSliceType }) => {
        return configureStore({
            reducer: {
                AdminDataState: adminReducer
            },
            preloadedState: initialState
        });
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders user information correctly', () => {

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
            AdminDataState: {
                loading: false,
                error: null,
                data: [mockUsers, mockBlogs]
            }
        });

        render(
            <Provider store={store}>
                <MemoryRouter>
                    <UserItem user={mockUsers[0]} />
                </MemoryRouter>
            </Provider>
        );

        expect(screen.getByText('user1')).toBeInTheDocument();
        expect(screen.getByText('user1@test.com')).toBeInTheDocument();
        expect(screen.getByTestId('delete')).toBeInTheDocument();
    });

    it('calls deleteAUser when delete button is clicked', async () => {
        const mockResponse: APIResponseModel<null> = {
            status: 200,
            data: null,
        };
        mockDeleteUser.mockResolvedValue(mockResponse);

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
            AdminDataState: {
                loading: false,
                error: null,
                data: [mockUsers, mockBlogs]
            }
        });

        render(
            <Provider store={store}>
                <MemoryRouter>
                    <UserItem user={mockUsers[0]} />
                </MemoryRouter>
            </Provider>
        );


        const deleteButton = screen.getByTestId('delete');
        fireEvent.click(deleteButton);

        expect(mockDeleteUser).toHaveBeenCalledWith('1');
        const mockedRes1: APIResponseModel<UserModel[]> = { status: 200 }
        const mockedRes2: APIResponseModel<BlogModel[]> = { status: 200 }
        mockGetAllUsers.mockResolvedValue(mockedRes1);
        mockGetBlogs.mockResolvedValue(mockedRes2)

        await waitFor(() => {
            expect(mockGetAllUsers).toHaveBeenCalled();
        });
    });

    it('shows loading state during delete operation', async () => {
        const mockResponse: APIResponseModel<null> = {
            status: 200,
            data: null,
        };
        mockDeleteUser.mockResolvedValue(mockResponse);

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
            AdminDataState: {
                loading: false,
                error: null,
                data: [mockUsers, mockBlogs]
            }
        });

        render(
            <Provider store={store}>
                <MemoryRouter>
                    <UserItem user={mockUsers[0]} />
                </MemoryRouter>
            </Provider>
        );

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
            AdminDataState: {
                loading: false,
                error: null,
                data: [mockUsers, mockBlogs]
            }
        });

        render(
            <Provider store={store}>
                <MemoryRouter>
                    <UserItem user={mockUsers[0]} />
                </MemoryRouter>
            </Provider>
        );
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
            AdminDataState: {
                loading: false,
                error: null,
                data: [mockUsers, mockBlogs]
            }
        });

        render(
            <Provider store={store}>
                <MemoryRouter>
                    <UserItem user={mockUsers[0]} />
                </MemoryRouter>
            </Provider>
        );

        const deleteButton = screen.getByTestId('delete')
        fireEvent.click(deleteButton);

        expect(deleteButton).toBeDisabled();

        await waitFor(() => {
            expect(deleteButton).not.toBeDisabled();
        });
    });
});