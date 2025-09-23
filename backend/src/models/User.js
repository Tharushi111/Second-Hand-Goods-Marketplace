import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      maxlength: [50, "Username cannot exceed 50 characters"]
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\S+@\S+\.\S+$/,
        "Please provide a valid email address"
      ]
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"]
    },
    role: {
      type: String,
      enum: ["buyer", "supplier"], 
      default: "buyer",
    },

    // Supplier specific fields
    company: {
      type: String,
      required: function () {
        return this.role === "supplier";
      },
      trim: true,
      maxlength: [100, "Company name cannot exceed 100 characters"]
    },
    phone: {
      type: String,
      required: function () {
        return this.role === "supplier";
      },
      trim: true,
      match: [
        /^(?:\+94|0)?7\d{8}$/,
        "Please provide a valid Sri Lankan phone number"
      ]
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.password; // never return password in API response
        return ret;
      }
    }
  }
);

// Index for faster queries
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });

const User = mongoose.model("User", userSchema);
export default User;
