import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: false },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    suscribers: { type: Number, default: 0 },
    suscribedChannels: { type: Array },
    img: { type: String, default: "" },
    coverImg: { type: String, default: "" },
    google: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", UserSchema);
