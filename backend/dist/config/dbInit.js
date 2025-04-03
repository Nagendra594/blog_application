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
exports.createTables = void 0;
const dbConfig_1 = __importDefault(require("./dbConfig"));
const createTables = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userTable = "CREATE TABLE IF NOT EXISTS users(id int AUTO_INCREMENT PRIMARY KEY,username VARCHAR(255) NOT NULL,email VARCHAR(255) NOT NULL UNIQUE,password VARCHAR(255) NOT NULL)";
        yield dbConfig_1.default.query(userTable);
        const blogsTable = "CREATE TABLE IF NOT EXISTS blogs(id int AUTO_INCREMENT PRIMARY KEY, userId int NOT NULL, title VARCHAR(255) NOT NULL, content TEXT NOT NULL,image VARCHAR(255), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,FOREIGN KEY (userId) REFERENCES users(id))";
        yield dbConfig_1.default.query(blogsTable);
    }
    catch (err) {
        throw new Error("Error creating tables");
    }
});
exports.createTables = createTables;
