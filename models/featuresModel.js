import mongoose from "mongoose";

const featureItemSchema = new mongoose.Schema(
  {
    heading: { type: String, required: true },
    description: { type: String, default: "" },
    imageLink: { type: String, default: "" },
    textPosition: {
      type: String,
      enum: ["top", "bottom", "left", "right"],
      default: "bottom",
    },
    rowSpan: { type: Number, default: 1 },
    colSpan: { type: Number, default: 1 },
  },
  { _id: false }
);

const featuresSectionSchema = new mongoose.Schema(
  {
    label: { type: String, default: "Features" },
    title: { type: String, default: "Smart Recruitments, Better Results" },
    subtitle: {
      type: String,
      default:
        "From job posting to candidate placement, Hirezy covers every step with ease.",
    },
    minColWidth: { type: String, default: "310px" },
    gap: { type: String, default: "32px" },
    columns: { type: Number, default: 3 },
    centerTitle: {
      type: String,
      enum: ["left", "center", "right"],
      default: "center",
    },
    items: { type: [featureItemSchema], default: [] },
  },
  { timestamps: true }
);

const FeaturesSection =
  mongoose.models.FeaturesSection ||
  mongoose.model("FeaturesSection", featuresSectionSchema);

export default FeaturesSection;
