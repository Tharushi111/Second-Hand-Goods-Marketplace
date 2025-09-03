import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import { connectDB } from "../src/config/db.js";
import Admin from "../src/models/Admin.js";

const run = async () => {
  try {
    await connectDB();

    // You can change these or pass with process.env for CI
    const username = "admin";
    const email = "admin@rebuy.lk";
    const password = "Admin@123"; 
    const role = "super_admin";

    // If already exists, skip
    const exists = await Admin.findOne({ email });
    if (exists) {
      console.log("Admin already exists with this email. Skipping.");
      process.exit(0);
    }

    const admin = await Admin.create({ username, email, password, role });
    console.log("Admin created successfully:");
    console.log({ id: admin._id, email: admin.email, role: admin.role });

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
};

run();
