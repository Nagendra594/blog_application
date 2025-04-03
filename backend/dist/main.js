"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const dbConfig_1 = __importDefault(require("./config/dbConfig"));
const blogRoutes_1 = __importDefault(require("./routes/blogRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const dbInit_1 = require("./config/dbInit");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: process.env.ORIGIN,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
}));
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path_1.default.join(__dirname, "uploads"));
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error("File format not supported"));
    }
};
app.use((0, multer_1.default)({ storage: storage, fileFilter: fileFilter }).single("image"));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use("/api/uploads", express_1.default.static(path_1.default.join(__dirname, "uploads")));
app.use("/api/blogs", blogRoutes_1.default);
app.use("/api/user", userRoutes_1.default);
app.use("/api/auth", authRoutes_1.default);
app.use((err, req, res, next) => {
    console.log(err);
    res.status(err.status || 500).json(err.message || "server error");
    return;
});
const server = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connection = yield dbConfig_1.default.getConnection();
        connection.release();
        yield (0, dbInit_1.createTables)();
        console.log("connected to db");
        app.listen(8080);
    }
    catch (err) {
        console.log(err);
    }
});
server();
