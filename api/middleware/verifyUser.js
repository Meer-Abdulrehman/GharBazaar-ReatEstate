import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js"; // Adjust path as needed

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token; // ✅ Make sure cookie name matches login

  if (!token) {
    return next(errorHandler(401, "Unauthorized - No token found"));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return next(errorHandler(403, "Invalid or expired token"));
    req.user = user; // ✅ attach user data to req
    next();
  });
};
