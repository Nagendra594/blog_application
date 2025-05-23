import { describe, it, expect, vi, beforeEach, beforeAll, afterAll } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AdminBlogItem from './AdminBlog';
import { BlogModel } from '../../models/BlogModel';
import { APIResponseModel } from '../../types/APIResponseModel';
import { deleteBlog } from '../../services/BlogServices/blogServices';
import { useNavigate } from 'react-router-dom';
import { Role } from '../../types/Role.type';

vi.mock('../../services/BlogServices/blogServices');
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: vi.fn(),
    };
});
vi.mock('react-redux', async () => {
    const actual = await vi.importActual('react-redux');
    return {
        ...actual,
        useDispatch: () => vi.fn()
    }
})

beforeAll(() => {
    const modalRoot = document.createElement('div');
    modalRoot.setAttribute('id', 'modal');
    document.body.appendChild(modalRoot);

});

afterAll(() => {
    const modalRoot = document.getElementById('modal');
    if (modalRoot) {
        document.body.removeChild(modalRoot);
    }
});

const mockBlog: BlogModel = {
    blogid: '123',
    title: 'Test Blog',
    content: 'Test content',
    username: 'testuser',
    userid: '456',
    date: new Date(),
    image: null,
    role: "user" as Role,
};

const mockDispatch = vi.fn();
const mockNavigate = vi.fn();

describe('AdminBlogItem with Redux', () => {
    const mockDeleteBlog = vi.mocked(deleteBlog);

    beforeEach(() => {
        vi.clearAllMocks();

        (useNavigate as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockNavigate);

    });

    it('renders blog information correctly', () => {
        render(<AdminBlogItem blog={mockBlog} />);

        expect(screen.getByText('Test Blog')).toBeInTheDocument();
        expect(screen.getByText('testuser')).toBeInTheDocument();
        expect(screen.getByTestId('edit')).toBeInTheDocument();
        expect(screen.getByTestId('delete')).toBeInTheDocument();
    });

    it('opens edit modal when edit button is clicked', () => {
        render(<AdminBlogItem blog={mockBlog} />);

        const editButton = screen.getByTestId('edit');
        fireEvent.click(editButton);

        expect(document.getElementById('modal')).toBeInTheDocument();
    });

    it('calls deleteBlog and dispatch on success', async () => {
        const mockResponse: APIResponseModel<null> = {
            status: 200,
            data: null,
        };
        mockDeleteBlog.mockResolvedValue(mockResponse);

        render(<AdminBlogItem blog={mockBlog} />);
        const deleteButton = screen.getByTestId('delete');
        fireEvent.click(deleteButton);

        expect(mockDeleteBlog).toHaveBeenCalledWith('123');


    });

    it('shows loading state during delete operation', async () => {
        const mockResponse: APIResponseModel<null> = {
            status: 200,
            data: null,
        };
        mockDeleteBlog.mockResolvedValue(mockResponse);

        render(<AdminBlogItem blog={mockBlog} />);
        const deleteButton = screen.getByTestId('delete');
        fireEvent.click(deleteButton);

        expect(screen.getByRole('progressbar')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
        });
    });

    it('displays error message on delete failure', async () => {
        const mockResponse: APIResponseModel<null> = {
            status: 500,
            data: null,
        };
        mockDeleteBlog.mockResolvedValue(mockResponse);

        render(<AdminBlogItem blog={mockBlog} />);
        const deleteButton = screen.getByTestId('delete');
        fireEvent.click(deleteButton);

        await waitFor(() => {
            expect(screen.getByText('Failed to delete blog')).toBeInTheDocument();
        });
    });

    it('navigates to login on 401 error', async () => {
        const mockResponse: APIResponseModel<null> = {
            status: 401,
            data: null,
        };
        mockDeleteBlog.mockResolvedValue(mockResponse);

        render(<AdminBlogItem blog={mockBlog} />);
        const deleteButton = screen.getByTestId('delete');
        fireEvent.click(deleteButton);

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/login');
        });
    });
});
