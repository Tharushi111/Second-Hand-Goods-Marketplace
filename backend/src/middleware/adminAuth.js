import jwt from "jsonwebtoken";

// Verify admin token
export const verifyAdminToken = (req, res, next) => {
  try {
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;

    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role }

    // Only allow super_admin or admin roles
    if (!["super_admin", "admin"].includes(decoded.role)) {
      return res.status(403).json({ message: "Forbidden: admin only" });
    }

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid/expired token" });
  }
};

// separate role check middleware
export const requireAdminRole = (...roles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Unauthenticated" });
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Forbidden: insufficient role" });
  }
  next();
};
