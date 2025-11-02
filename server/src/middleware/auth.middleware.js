import prisma from "../utils/prisma.js";
import { ApiError } from "../utils/api-error.js";
import { verifyToken } from "../utils/jwt.js";

export const requireAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return next(new ApiError(401, [], "Not authenticated"));
    }

    // Verify JWT token
    const decoded = verifyToken(token);

    // Fetch user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return next(new ApiError(401, [], "User not found"));
    }

    // Attach user to request
    req.user = user;

    next();
  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      return next(new ApiError(401, [], "Invalid token"));
    }
    if (err.name === "TokenExpiredError") {
      return next(new ApiError(401, [], "Token expired"));
    }
    console.log(err);
    next(new ApiError(500, [], err.message));
  }
};
