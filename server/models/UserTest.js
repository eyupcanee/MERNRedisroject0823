import mongoose from "mongoose";

const UserTestSchema = new mongoose.Schema(
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

const UserTest = mongoose.model("UserTest", UserTestSchema);
export default UserTest;
