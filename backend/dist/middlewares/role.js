"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkRole = void 0;
const checkRole = (roles) => {
    return (req, res, next) => {
        try {
            const currRole = req.role;
            if (!currRole || !roles.includes(currRole)) {
                const error = {
                    message: "Not Authorized",
                    status: 403,
                    name: "Forbidden"
                };
                throw error;
            }
            next();
        }
        catch (err) {
            next(err);
        }
    };
};
exports.checkRole = checkRole;
