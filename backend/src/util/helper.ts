import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
export const comparePass = async (enteredPassword: string, dbPassword: string): Promise<boolean> | never => {
    const result: boolean = await bcrypt.compare(enteredPassword, dbPassword);
    return result;
}


export const hashPass = async (password: string, salt: number = 12): Promise<string> | never => {
    const hashedPassword: string = await bcrypt.hash(password, salt);
    return hashedPassword;
}

export const generateToken = (userData: { id: string, role: string }): string => {
    return jwt.sign(userData, process.env.JWT_KEY!, {
        expiresIn: "1h",
    })
}

export const verifyToken = (token: string): JwtPayload | null => {
    return jwt.verify(token, process.env.JWT_KEY!) as JwtPayload;
}
