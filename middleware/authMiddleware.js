import jwt from "jsonwebtoken";
import { protect } from "../middleware/authMiddleware.js";

router.post("/", protect, upload.single("image"), createProduct);

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new error("JWT_SECRET not defined");
}

export const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Add user id to request
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};
