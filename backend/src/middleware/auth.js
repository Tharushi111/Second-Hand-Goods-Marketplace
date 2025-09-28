import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role }
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid/expired token" });
  }
};

export const requireRole = (...roles) => (req, res, next) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthenticated" });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: insufficient role" });
    }
    return next();
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};
