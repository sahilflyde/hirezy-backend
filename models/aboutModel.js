import mongoose from "mongoose";

const aboutSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      default: "About",
    },
    title: {
      type: String,
      required: true,
      default: "Discover Hirezy",
    },
    subtitle: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    media: {
      type: String, // Image or video URL
      default: "",
    },
    centerTitle: {
      type: String,
      enum: ["left", "center", "right"],
      default: "center",
    },
  },
  { timestamps: true }
);

export default mongoose.model("AboutSection", aboutSchema);
