import mongoose from "mongoose";

const featureSchema = new mongoose.Schema(
  {
    icon: { type: String, required: true },
    title: { type: String, required: true },
    desc: { type: String, required: true },
  },
  { _id: true }
);

const whyChooseSchema = new mongoose.Schema(
  {
    title: { type: String, default: "Why Choose Hirezy" },
    label: { type: String, default: "Value" },
    description: {
      type: String,
      default:
        "Built with recruiters to provide the tools they need — helping them find the right talent faster.",
    },
    buttonText: { type: String, default: "Get to Know Us" },
    features: [featureSchema],
  },
  { timestamps: true }
);

export default mongoose.model("WhyChooseSection", whyChooseSchema);
