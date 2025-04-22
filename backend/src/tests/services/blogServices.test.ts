
import * as blogService from "../../services/blogServices";
import db from "../../config/dbConfig";
import { BlogModel } from "../../models/blogModel";

jest.mock("../../config/dbConfig", () => ({
    query: jest.fn(),

}));

const mockedQuery = db.query as jest.Mock;

describe("blogService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("createBlog", () => {
        it("should call db.query with correct values", async () => {
            const data = {
                userid: "u1",
                title: "Test Title",
                content: "Some content",
                image: "img.png"
            };

            await blogService.createBlog(data);

            expect(mockedQuery).toHaveBeenCalledWith(
                "INSERT INTO blogs(userid,title,content,image) VALUES($1,$2,$3,$4)",
                [data.userid, data.title, data.content, data.image]
            );
        });
    });

    describe("getBlog", () => {
        it("should call db.query with correct values", async () => {
            const mockRow = { userid: "u1", image: "img.png" };
            mockedQuery.mockResolvedValueOnce({ rows: [mockRow] });


            const result = await blogService.getBlog("1");
            expect(mockedQuery).toHaveBeenCalledWith(
                "SELECT b.userid as userid,b.image as image FROM blogs b WHERE b.blogid=($1)",
                ["1"]
            );
        });
        it("should return null if no blog is found", async () => {
            mockedQuery.mockResolvedValueOnce({ rows: [] });

            const result = await blogService.getBlog("nonexistent");
            expect(result).toBeNull();
        });

        it("should return blog data if found", async () => {
            const mockRow = { userid: "u1", image: "img.png" };
            mockedQuery.mockResolvedValueOnce({ rows: [mockRow] });

            const result = await blogService.getBlog("1");
            expect(mockedQuery).toHaveBeenCalledWith(
                "SELECT b.userid as userid,b.image as image FROM blogs b WHERE b.blogid=($1)",
                ["1"]
            );
            expect(result).toEqual(mockRow);
        });
    });


    describe("updateBlog", () => {
        it("should call db.query with correct values", async () => {
            const mockedData: Partial<BlogModel> = { title: "hello", content: "someContent", blogid: "1" }
            await blogService.updateBlog(mockedData);
            expect(mockedQuery).toHaveBeenCalledWith(
                "UPDATE blogs SET title=($1),content=($2) WHERE blogid=($3)",
                [mockedData.title, mockedData.content, mockedData.blogid]
            );
        });
    })


    describe("deleteBlog", () => {
        it("should call db.query with correct values", async () => {

            await blogService.deleteBlog("1");
            expect(mockedQuery).toHaveBeenCalledWith(
                "DELETE FROM blogs WHERE blogid=($1)",
                ["1"]
            );
        });
    })

    describe("getBlogs", () => {
        it("should call db.query with correct values", async () => {
            const mockRow = [{
                blogid: "1",
                title: "test",
                content: "testing",
                date: new Date(),
                image: "img.png",
                username: "testuser",
                userid: "123",
            }];

            mockedQuery.mockResolvedValueOnce({ rows: mockRow });
            const value = await blogService.getBlogs();
            expect(mockedQuery).toHaveBeenCalledWith(
                "SELECT b.blogid,b.title as title,b.content as content,b.image as image,u.username as username,u.userid as userid,b.created_at as date FROM blogs b JOIN users u on b.userid=u.userid ORDER BY b.created_at DESC",
            );


            expect(value).toEqual(mockRow)
        });
    })




});
