import mongoose from "mongoose";

const HeroSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    primaryButtonText: String,
    secondaryButtonText: String,
    mainImage: String,
    leftImage: String,
    rightImage: String,
  },
  { timestamps: true }
);

export default mongoose.model("Hero", HeroSchema);
