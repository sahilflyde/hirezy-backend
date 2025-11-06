import mongoose from "mongoose";

const transformSectionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      default: "Ready to Transform Your Hiring Process for the Better?",
    },
    desc: {
      type: String,
      default: "Try Hirezy today and discover how easy recruitment can be.",
    },
    btnText: { type: String, default: "Download Now" },
    btnIcon: { type: String, default: "/Arrow Right.png" },
    bgImage: { type: String, default: "/cta-bg-image.jpg" },
    // optional: add link if needed later
    buttonLink: { type: String, default: "" },
  },
  { timestamps: true }
);

const TransformSection =
  mongoose.models.TransformSection ||
  mongoose.model("TransformSection", transformSectionSchema);

export default TransformSection;
