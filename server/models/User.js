import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      max: 80,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: Date,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    img: String,
    phoneNumber: String,
    active: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      enum: ["user", "editor"],
      default: "user",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
export default User;
