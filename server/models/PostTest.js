import mongoose, { mongo } from "mongoose";

const PostTestSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    img: String,
  },
  { timestamps: true }
);

const PostTest = mongoose.Model("PostTest", PostTestSchema);

export default PostTest;
