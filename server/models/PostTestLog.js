import mongoose from "mongoose";

const PostTestLogSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    processor: {
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
      enum: ["get", "insert", "update", "delete"],
    },
    success: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

const PostTestLog = mongoose.model("PostTestLog", PostTestLogSchema);
export default PostTestLog;
