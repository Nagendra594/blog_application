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
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dbConfig_1 = __importDefault(require("../config/dbConfig"));
const runMigrations = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const dirPath = path_1.default.join(__dirname, "migrations");
        const files = fs_1.default.readdirSync(dirPath).sort();
        for (const file of files) {
            const filePath = path_1.default.join(dirPath, file);
            const sql = fs_1.default.readFileSync(filePath, "utf-8");
            yield dbConfig_1.default.query(sql);
        }
    }
    catch (err) {
        console.log(err);
    }
});
runMigrations();
