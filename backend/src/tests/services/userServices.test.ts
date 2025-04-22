import * as userService from "../../services/userServices";
import db from "../../config/dbConfig";
import { UserModel } from "../../models/userModel";

jest.mock("../../config/dbConfig", () => ({

    query: jest.fn()

}));

const mockedQuery = db.query as jest.Mock;

describe("userService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("createUser", () => {
        it("should call db.query with correct SQL and values", async () => {
            const credentials: Partial<UserModel> = {
                username: "testUser",
                email: "test@example.com",
                password: "hashedPassword"
            };

            await userService.createUser(credentials);

            expect(mockedQuery).toHaveBeenCalledWith(
                "INSERT INTO users (username,email,password) VALUES ($1,$2,$3)",
                [credentials.username, credentials.email, credentials.password]
            );
        });
    });

    describe("getUserByIdOrEmail", () => {
        it("should query by email if email is provided", async () => {
            const email = "test@example.com";
            const fakeUser = {
                userid: "1",
                username: "testUser",
                email,
                password: "hashedPassword",
                role: "user"
            };

            mockedQuery.mockResolvedValueOnce({ rows: [fakeUser] });

            const result = await userService.getUserByIdOrEmail(undefined, email);

            expect(mockedQuery).toHaveBeenCalledWith(
                "SELECT userid,username,email,password,role FROM users WHERE email=$1",
                [email]
            );

            expect(result).toEqual(fakeUser);
        });

        it("should query by id if email is not provided", async () => {
            const id = "123";
            const fakeUser = {
                userid: id,
                username: "testUser",
                email: "test@example.com",
                role: "user"
            };

            mockedQuery.mockResolvedValueOnce({ rows: [fakeUser] });

            const result = await userService.getUserByIdOrEmail(id);

            expect(mockedQuery).toHaveBeenCalledWith(
                "SELECT userid,username,email,role FROM users WHERE userid=$1",
                [id]
            );

            expect(result).toEqual(fakeUser);
        });

        it("should return null if no user found", async () => {
            mockedQuery.mockResolvedValueOnce({ rows: [] });

            const result = await userService.getUserByIdOrEmail("123");

            expect(result).toBeNull();
        });
    });

    describe("deleteUser", () => {
        it("should call db.query with correct SQL and values", async () => {
            const id = "123";

            await userService.deleteUser(id);

            expect(mockedQuery).toHaveBeenCalledWith(
                "DELETE FROM users WHERE userid=$1",
                [id]
            );
        });
    });

    describe("getAllUsers", () => {
        it("should return all users with role 'user'", async () => {
            const users = [
                { userid: "1", username: "A", email: "a@mail.com" },
                { userid: "2", username: "B", email: "b@mail.com" }
            ];

            mockedQuery.mockResolvedValueOnce({ rows: users });

            const result = await userService.getAllUsers();

            expect(mockedQuery).toHaveBeenCalledWith(
                "SELECT userid,username,email FROM users WHERE role=$1",
                ["user"]
            );

            expect(result).toEqual(users);
        });
    });
});
