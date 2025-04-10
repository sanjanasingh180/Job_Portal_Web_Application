import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        // Check if token is present
        if (!token) {
            return res.status(401).json({
                message: "User not authenticated. Please log in.",
                success: false,
            });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        // Attach user ID from token to the request object for downstream use
        req.id = decoded.userId;

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        console.error("Authentication error:", error);

        // Handle specific JWT errors
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                message: "Session expired. Please log in again.",
                success: false,
            });
        } else if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                message: "Invalid token. Please log in again.",
                success: false,
            });
        }

        // Generic error response
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};

export default isAuthenticated;
