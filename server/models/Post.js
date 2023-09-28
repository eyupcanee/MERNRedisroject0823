import mongoose, { mongo } from "mongoose";

const PostSchema = new mongoose.Schema(
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

const Post = mongoose.Model("Post", PostSchema);

export default Post;
