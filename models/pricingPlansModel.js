import mongoose from "mongoose";

const featureSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
  },
  { _id: false }
);

const planSchema = new mongoose.Schema(
  {
    planName: { type: String, required: true },
    description: { type: String, default: "" },
    price: { type: String, required: true },
    tag: { type: String, default: "" },
    iconSrc: { type: String, default: "" },
    variant: { type: String, default: "blue" }, // blue / lime etc
    features: { type: [featureSchema], default: [] },
  },
  { _id: false }
);

const pricingSectionSchema = new mongoose.Schema(
  {
    label: { type: String, default: "Pricing Plan" },
    title: { type: String, default: "Simple Plans, Clear Value" },
    subtitle: {
      type: String,
      default: "Choose a plan that fits your team’s needs.",
    },
    items: { type: [planSchema], default: [] },
  },
  { timestamps: true }
);

const PricingSection =
  mongoose.models.PricingSection ||
  mongoose.model("PricingSection", pricingSectionSchema);

export default PricingSection;
