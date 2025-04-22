import request from 'supertest';
import { app } from '../../index';
import * as blogServices from '../../services/blogServices';
import { BlogModel } from '../../models/blogModel';
import { generateToken } from '../../util/helper';
jest.mock("../../util/file");
jest.mock('../../services/blogServices');
const mockedCreateBlog = blogServices.createBlog as jest.Mock;
const mockedGetBlog = blogServices.getBlog as jest.Mock;
const mockedUpdateBlog = blogServices.updateBlog as jest.Mock;
const mockedDeleteBlog = blogServices.deleteBlog as jest.Mock;
const mockedGetBlogs = blogServices.getBlogs as jest.Mock;


describe('Blog Controller', () => {


    describe('GET /api/blog', () => {
        it("should return 401 if user doest not logged in", async () => {
            const response = await request(app).post("/api/auth/logout");
            expect(response.status).toBe(401);

        })
        it('should return all blogs', async () => {
            const token: string = generateToken({ id: 'user123', role: 'user' });

            const fakeBlogs: BlogModel[] = [
                { blogid: '1', userid: 'user123', title: 'Blog 1', content: 'Content 1', image: 'img.jpg', username: "test1", date: new Date() },
                { blogid: '2', userid: 'user123', title: 'Blog 2', content: 'Content 2', image: 'img2.jpg', username: "test2", date: new Date() }
            ];
            mockedGetBlogs.mockResolvedValueOnce(fakeBlogs);

            const res = await request(app).get('/api/blogs/').set('Cookie', [`token=${token}`]);

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(mockedGetBlogs).toHaveBeenCalled();
        });
    });


    describe('POST /api/blog', () => {
        it("should return 401 if user doest not logged in", async () => {
            const response = await request(app).post("/api/auth/logout");
            expect(response.status).toBe(401);

        })

        it('should response 422 with invalid details', async () => {
            const token: string = generateToken({ id: 'user123', role: 'user' });

            const res = await request(app).post("/api/blogs").set("Cookie", `token=${token}`).field('title', 'st').field('content', 'st');
            expect(res.status).toBe(422);
            expect(mockedCreateBlog).not.toHaveBeenCalled();
        })

        it('should create a new blog', async () => {
            const token: string = generateToken({ id: 'user123', role: 'user' });

            mockedCreateBlog.mockResolvedValueOnce(undefined);

            const res = await request(app).post("/api/blogs").set("Cookie", `token=${token}`).field('title', 'valid').field('content', 'valid').field("image", "dummy.jpeg");


            expect(res.status).toBe(201);
            expect(mockedCreateBlog).toHaveBeenCalled();
        });
    });



    describe('Patch /api/blog/:id', () => {
        it("should return 401 if user doest not logged in", async () => {
            const response = await request(app).post("/api/auth/logout");
            expect(response.status).toBe(401);

        })

        it('should response 422 with invalid details', async () => {
            const token: string = generateToken({ id: 'user123', role: 'user' });

            const res = await request(app).patch("/api/blogs/1").set("Cookie", `token=${token}`).field('title', 'st').field('content', 'st');
            expect(res.status).toBe(422);
            expect(mockedGetBlog).not.toHaveBeenCalled();
            expect(mockedUpdateBlog).not.toHaveBeenCalled();
        })
        it("should not update blog if does not exists", async () => {
            const token: string = generateToken({ id: 'user123', role: 'user' });

            mockedGetBlog.mockResolvedValueOnce(null);
            const res = await request(app).patch("/api/blogs/1").set("Cookie", `token=${token}`).field('title', 'valid').field('content', 'valid');
            expect(res.status).toBe(404);
            expect(mockedGetBlog).toHaveBeenCalled();
            expect(mockedUpdateBlog).not.toHaveBeenCalled();
        })
        it('should not update blog if user is not owner', async () => {
            const token: string = generateToken({ id: 'user124', role: 'user' });

            mockedGetBlog.mockResolvedValueOnce({
                blogid: '1',
                userid: 'user123',
                title: 'Old Title',
                content: 'Old Content',
                image: 'uploads/old.jpg'
            });
            mockedUpdateBlog.mockResolvedValueOnce(undefined);

            const res = await request(app)
                .patch('/api/blogs/1')
                .set('Cookie', [`token=${token}`])
                .field('title', 'Updated Title')
                .field('content', 'Updated content');

            expect(res.status).toBe(403);
            expect(mockedGetBlog).toHaveBeenCalled();
            expect(mockedUpdateBlog).not.toHaveBeenCalled();
        });
        it('should update blog if user is not owner but admin', async () => {
            const token: string = generateToken({ id: 'user124', role: 'admin' });

            mockedGetBlog.mockResolvedValueOnce({
                blogid: '1',
                userid: 'user123',
                title: 'Old Title',
                content: 'Old Content',
                image: 'uploads/old.jpg'
            });
            mockedUpdateBlog.mockResolvedValueOnce(undefined);

            const res = await request(app)
                .patch('/api/blogs/1')
                .set('Cookie', [`token=${token}`])
                .field('title', 'Updated Title')
                .field('content', 'Updated content');

            expect(res.status).toBe(200);
            expect(mockedGetBlog).toHaveBeenCalled();
            expect(mockedUpdateBlog).toHaveBeenCalled();

        });
    })


    describe('DELETE /api/blog/:id', () => {
        it("should return 401 if user doest not logged in", async () => {
            const response = await request(app).post("/api/auth/logout");
            expect(response.status).toBe(401);

        })
        it("should not delete blog if does not exists", async () => {
            const token: string = generateToken({ id: 'user123', role: 'user' });

            mockedGetBlog.mockResolvedValueOnce(null);
            const res = await request(app).delete("/api/blogs/1").set("Cookie", `token=${token}`);
            expect(res.status).toBe(404);
            expect(mockedGetBlog).toHaveBeenCalled();
            expect(mockedDeleteBlog).not.toHaveBeenCalled();
        })
        it('should delete blog if user is owner', async () => {
            const token: string = generateToken({ id: 'user123', role: 'user' });

            mockedGetBlog.mockResolvedValueOnce({
                blogid: '1',
                userid: 'user123',
                title: 'Title',
                content: 'Content',
                image: 'uploads/image.jpg'
            });
            mockedDeleteBlog.mockResolvedValueOnce(undefined);

            const res = await request(app)
                .delete('/api/blogs/1')
                .set('Cookie', [`token=${token}`]);

            expect(res.status).toBe(200);
            expect(mockedDeleteBlog).toHaveBeenCalled();
        });
        it('should delete blog if user is not owner but admin', async () => {
            const token: string = generateToken({ id: 'user124', role: 'admin' });

            mockedGetBlog.mockResolvedValueOnce({
                blogid: '1',
                userid: 'user123',
                title: 'Title',
                content: 'Content',
                image: 'uploads/image.jpg'
            });
            mockedDeleteBlog.mockResolvedValueOnce(undefined);

            const res = await request(app)
                .delete('/api/blogs/1')
                .set('Cookie', [`token=${token}`]);

            expect(res.status).toBe(200);
            expect(mockedDeleteBlog).toHaveBeenCalled();
        });

        it('should not delete if user is not owner', async () => {
            const token: string = generateToken({ id: 'user124', role: 'user' });

            mockedGetBlog.mockResolvedValueOnce({
                blogid: '1',
                userid: 'anotherUser',
                title: 'Title',
                content: 'Content',
                image: 'uploads/image.jpg'
            });

            const res = await request(app)
                .delete('/api/blogs/1')
                .set('Cookie', [`token=${token}`]);

            expect(res.status).toBe(403);
        });
    });

});
