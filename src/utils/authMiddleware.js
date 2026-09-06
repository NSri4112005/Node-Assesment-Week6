const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;

function authenticateToken(req) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return {
            success: false,
            message: "Authorization token is required"
        };
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        return {
            success: false,
            message: "Invalid authorization format"
        };
    }

    try {
        const decoded = jwt.verify(
            token,
            JWT_SECRET
        );

        return {
            success: true,
            user: decoded
        };
    } catch (error) {
        return {
            success: false,
            message: "Invalid or expired token"
        };
    }
}

module.exports = authenticateToken;