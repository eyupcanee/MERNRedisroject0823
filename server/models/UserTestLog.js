import mongoose from "mongoose";

const UserTestLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    logMessage: {
      type: String,
      min: 2,
    },
    logType: {
      type: String,
      required: true,
      enum: ["get", "insert", "update", "delete", "login", "logout"],
    },
    success: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

const UserTestLog = mongoose.model("UserTestLog", UserTestLogSchema);
export default UserTestLog;
