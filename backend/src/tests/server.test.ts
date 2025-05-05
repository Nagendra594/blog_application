import db from "../config/dbConfig";
import { app } from "../index";
import dotenv from "dotenv"
dotenv.config();
jest.mock("../config/dbConfig", () => ({

    connect: jest.fn(),

}));

jest.mock("../index", () => ({
    app: {
        listen: jest.fn(),
    },
}));


describe("Server bootstrap", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should connect to the database and start the server", async () => {
        const mockConnection = { release: jest.fn() };
        (db.connect as jest.Mock).mockResolvedValue(mockConnection);

        await import("../server");

        expect(db.connect).toHaveBeenCalledTimes(1);
        expect(mockConnection.release).toHaveBeenCalledTimes(1);
        expect(app.listen).toHaveBeenCalledWith(process.env.PORT,);
    });
});
