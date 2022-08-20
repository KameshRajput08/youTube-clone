import mongoose from "mongoose";

const VideoSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    title: { type: String, required: true },
    desc: { type: String, default: "" },
    img: { type: String, default: "" },
    video: { type: String, default: "" },
    views: { type: Number, default: 0 },
    tags: { type: Array, default: [] },
    likes: { type: Array, default: [] },
    dislikes: { type: Array, default: [] },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Video", VideoSchema);
