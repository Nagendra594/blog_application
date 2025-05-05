import { describe, it, expect, vi, beforeEach, Mock, beforeAll } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import AdminDashboard from './Home';
import { AdminSliceType, adminReducer } from '../../../store/AdminDataSlice/AdminDataSlice';
import { UserModel } from '../../../models/UserModel';
import { Role } from '../../../types/Role.type';
import { BlogModel } from '../../../models/BlogModel';
import { getAllUsers } from '../../../services/UserServices/userServices';
import { getBlogs } from '../../../services/BlogServices/blogServices';
import store from '../../../store/store';
import { APIResponseModel } from '../../../types/APIResponseModel';

vi.mock('../../../services/UserServices/userServices');

vi.mock('../../../services/BlogServices/blogServices');
vi.mock('../../UserItem/UserItem', () => ({
    default: ({ user }: { user: any }) => (
        <tr data-testid="user-item">
            <td>{user.username}</td>
            <td>{user.email}</td>
        </tr>
    )
}));

vi.mock('../../AdminBlog/AdminBlog', () => ({
    default: ({ blog }: { blog: any }) => (
        <tr data-testid="blog-item">
            <td>{blog.title}</td>
            <td>{blog.username}</td>
        </tr>
    )
}));
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


const mockGetAllUsers = getAllUsers as Mock;
const mockGetBlogs = getBlogs as Mock;
describe('AdminDashboard Component', () => {
    const mockStore = (initialState: { AdminDataState: AdminSliceType }) => {
        return configureStore({
            reducer: {
                AdminDataState: adminReducer
            },
            preloadedState: initialState
        });
    };

    beforeAll(() => {

        vi.clearAllMocks();
        vi.spyOn(Storage.prototype, 'clear');

    });


    it('should render users and blogs tables when data is available', async () => {
        const mockedRes1: APIResponseModel<UserModel[]> = { status: 200 }
        const mockedRes2: APIResponseModel<BlogModel[]> = { status: 200 }
        mockGetAllUsers.mockResolvedValue(mockedRes1);
        mockGetBlogs.mockResolvedValue(mockedRes2)
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
                    <AdminDashboard />
                </MemoryRouter>
            </Provider>
        );

        await waitFor(() => {
            expect(screen.getByText('Manage Users')).toBeInTheDocument();
            expect(screen.getByText('Manage Blogs')).toBeInTheDocument();
            expect(screen.getAllByTestId('user-item').length).toBe(1);
            expect(screen.getAllByTestId('blog-item').length).toBe(1);
        });
    });

    it('should show empty state messages when no data', () => {
        const mockedRes1: APIResponseModel<UserModel[]> = { status: 200 }
        const mockedRes2: APIResponseModel<BlogModel[]> = { status: 200 }
        mockGetAllUsers.mockResolvedValue(mockedRes1);
        mockGetBlogs.mockResolvedValue(mockedRes2)
        const store = mockStore({
            AdminDataState: {
                loading: false,
                error: null,
                data: [[], []]
            }
        });

        render(
            <Provider store={store}>
                <MemoryRouter>
                    <AdminDashboard />
                </MemoryRouter>
            </Provider>
        );

        expect(screen.getByText('No users found.')).toBeInTheDocument();
        expect(screen.getByText('No Blogs found.')).toBeInTheDocument();
    });

    it('should handle unauthorized error', async () => {

        const mockedRes1: APIResponseModel<UserModel[]> = { status: 401 }
        const mockedRes2: APIResponseModel<BlogModel[]> = { status: 401 }
        mockGetAllUsers.mockResolvedValue(mockedRes1);
        mockGetBlogs.mockResolvedValue(mockedRes2)
        const store = mockStore({
            AdminDataState: {
                loading: false,
                error: 'UnAuthenticated',
                data: [[], []]
            }
        });

        render(
            <Provider store={store}>
                <MemoryRouter>
                    <AdminDashboard />
                </MemoryRouter>
            </Provider>
        );

        await waitFor(() => {
            expect(localStorage.clear).toHaveBeenCalled();
            expect(mockNavigate).toHaveBeenCalledWith('/login');
        });
    });

    it('should display error message when there is an error', async () => {
        const mockedRes1: APIResponseModel<UserModel[]> = { status: 500 }
        const mockedRes2: APIResponseModel<BlogModel[]> = { status: 500 }
        mockGetAllUsers.mockResolvedValue(mockedRes1);
        mockGetBlogs.mockResolvedValue(mockedRes2)
        render(
            <Provider store={store}>
                <MemoryRouter>
                    <AdminDashboard />
                </MemoryRouter>
            </Provider>
        );
        await waitFor(() => {

            expect(screen.getByText(/Failed to fetch data/i)).toBeInTheDocument();
        })
    });

    it('should dispatch fetchAdminDataThunk on mount', async () => {


        const store = mockStore({
            AdminDataState: {
                loading: false,
                error: null,
                data: [[], []]
            }
        });

        render(
            <Provider store={store}>
                <MemoryRouter>
                    <AdminDashboard />
                </MemoryRouter>
            </Provider>
        );

        await waitFor(() => {
            expect(mockGetAllUsers).toHaveBeenCalled();
        });
    });
});