import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // basic validation
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // include password with select('+password')
    const admin = await Admin.findOne({ email, status: "active" }).select("+password");
    if (!admin) {
      return res.status(404).json({ message: "Admin not found or disabled" });
    }

    const isValid = await admin.comparePassword(password);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // don’t return password
    const adminSafe = {
      id: admin._id,
      username: admin.username,
      email: admin.email,
      role: admin.role,
    };

    return res.json({ message: "Login successful", token, admin: adminSafe });
  } catch (err) {
    console.error("adminLogin error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
