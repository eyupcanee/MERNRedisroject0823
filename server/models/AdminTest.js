import mongoose from "mongoose";

const AdminTestSchema = new mongoose.Schema(
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
    occupation: String,
    phoneNumber: String,
    role: {
      type: String,
      enum: ["admin"],
      default: "admin",
    },
  },
  { timestamps: true }
);

const AdminTest = mongoose.model("AdminTest", AdminTestSchema);
export default AdminTest;
