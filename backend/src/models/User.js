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
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"]
    },
    password: {
      type: String,
      required: function () {
        return !this.googleId; // required only if not Google login
      },
      minlength: [6, "Password must be at least 6 characters long"]
    },
    role: {
      type: String,
      enum: ["buyer", "supplier"],
      default: "buyer"
    },

    address: {
      type: String,
      required: function () {
        return !this.googleId;
      },
      trim: true,
      maxlength: [200, "Address cannot exceed 200 characters"]
    },
    city: {
      type: String,
      required: function () {
        return !this.googleId;
      },
      trim: true,
      maxlength: [50, "City cannot exceed 50 characters"]
    },
    country: {
      type: String,
      required: function () {
        return !this.googleId;
      },
      trim: true,
      maxlength: [50, "Country cannot exceed 50 characters"]
    },

    postalCode: {
      type: String,
      required: function () {
        return this.role === "buyer" && !this.googleId;
      },
      trim: true,
      maxlength: [10, "Postal code cannot exceed 10 characters"]
    },

    phone: {
      type: String,
      required: function () {
        return this.role === "supplier" && !this.googleId;
      },
      trim: true,
      match: [
        /^(?:\+94|0)?7\d{8}$/,
        "Please provide a valid Sri Lankan phone number"
      ]
    },
    company: {
      type: String,
      required: function () {
        return this.role === "supplier" && !this.googleId;
      },
      trim: true,
      maxlength: [100, "Company name cannot exceed 100 characters"]
    },

    googleId: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.password;
        return ret;
      }
    }
  }
);

//userSchema.index({ email: 1 });
userSchema.index({ role: 1 });

const User = mongoose.model("User", userSchema);
export default User;
