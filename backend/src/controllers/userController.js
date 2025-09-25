import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// -------------------- REGISTER --------------------
export const registerUser = async (req, res) => {
  try {
    const { username, email, password, role, company, phone, address, city, country, postalCode } = req.body;

    if (!["buyer", "supplier"].includes(role)) {
      return res.status(400).json({ message: "Invalid role specified" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists with this email" });

    if (role === "supplier" && (!company || !phone)) {
      return res.status(400).json({ message: "Company name and phone are required for suppliers" });
    }

    if (role === "buyer" && !postalCode) {
      return res.status(400).json({ message: "Postal code is required for buyers" });
    }

    if (!address || !city || !country) {
      return res.status(400).json({ message: "Address, city, and country are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role,
      address,
      city,
      country,
      ...(role === "buyer" && { postalCode }),
      ...(role === "supplier" && { company, phone }),
    });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({
      message: `${role.charAt(0).toUpperCase() + role.slice(1)} registered successfully`,
      token,
      role: user.role,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        address: user.address,
        city: user.city,
        country: user.country,
        ...(role === "buyer" && { postalCode: user.postalCode }),
        ...(role === "supplier" && { company: user.company, phone: user.phone }),
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// -------------------- LOGIN --------------------
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Incorrect password" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({
      message: "Login successful",
      token,
      role: user.role,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        address: user.address,
        city: user.city,
        country: user.country,
        ...(user.role === "buyer" && { postalCode: user.postalCode }),
        ...(user.role === "supplier" && { company: user.company, phone: user.phone }),
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// -------------------- GOOGLE LOGIN --------------------
export const googleLoginUser = async (req, res) => {
  try {
    const { tokenId } = req.body;
    if (!tokenId) return res.status(400).json({ message: "Token ID is required" });

    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, sub: googleId } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      // Create a new buyer by default with minimal required info
      user = await User.create({
        username: name,
        email,
        role: "buyer",
        googleId,
      });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({
      message: "Login successful",
      token,
      role: user.role,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        address: user.address,
        city: user.city,
        country: user.country,
        ...(user.role === "buyer" && { postalCode: user.postalCode }),
        ...(user.role === "supplier" && { company: user.company, phone: user.phone }),
      },
    });
  } catch (error) {
    console.error("Google login error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc Get current user's profile
 * @route GET /api/user/profile
 */
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc Update current user's profile
 * @route PUT /api/user/profile
 */
export const updateProfile = async (req, res) => {
  try {
    const { username, email, company, phone, address, city, country, postalCode } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.username = username || user.username;
    user.email = email || user.email;
    user.address = address || user.address;
    user.city = city || user.city;
    user.country = country || user.country;

    if (user.role === "buyer") user.postalCode = postalCode || user.postalCode;
    if (user.role === "supplier") {
      user.company = company || user.company;
      user.phone = phone || user.phone;
    }

    const updatedUser = await user.save();
    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc Get all users (optional filter by role)
 * @route GET /api/user
 */
export const getUsers = async (req, res) => {
  try {
    const { role, page = 1, limit = 10 } = req.query;
    const query = role ? { role } : {};

    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await User.countDocuments(query);

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc Get a single user by ID
 * @route GET /api/user/:id
 */
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc Update a user by ID
 * @route PUT /api/user/:id
 */
export const updateUser = async (req, res) => {
  try {
    const { username, email, role, company, phone, address, city, country, postalCode } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (req.user.role !== "admin" && req.user.role !== "super_admin" && req.user.id !== user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    user.username = username || user.username;
    user.email = email || user.email;
    user.role = role || user.role;
    user.address = address || user.address;
    user.city = city || user.city;
    user.country = country || user.country;

    if (user.role === "buyer") user.postalCode = postalCode || user.postalCode;
    if (user.role === "supplier") {
      user.company = company || user.company;
      user.phone = phone || user.phone;
    }

    const updatedUser = await user.save();
    res.json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc Delete a user by ID (Admin)
 * @route DELETE /api/user/:id
 */
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (req.user.id !== user._id.toString() && req.user.role !== "admin" && req.user.role !== "super_admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    await user.deleteOne();
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc Delete own account (Buyer or Supplier)
 * @route DELETE /api/user/profile
 */
export const deleteOwnAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.deleteOne();
    res.json({ message: "Account deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc Get all suppliers (for stock dropdown)
 * @route GET /api/user/suppliers
 */
export const getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await User.find({ role: "supplier" }).select("_id username");
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch suppliers", error: error.message });
  }
};
