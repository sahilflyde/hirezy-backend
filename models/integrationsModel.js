import mongoose from "mongoose";

const toolSchema = new mongoose.Schema(
  {
    src: { type: String, required: true },
    alt: { type: String, required: true },
  },
  { _id: false }
);

const integrationSectionSchema = new mongoose.Schema(
  {
    label: { type: String, default: "Integration" },
    title: { type: String, default: "Seamlessly Connected" },
    subtitle: {
      type: String,
      default:
        "Connect Hirezy to your favorite tools and keep your hiring workflow running smoothly.",
    },
    items: { type: [toolSchema], default: [] },
  },
  { timestamps: true }
);

const IntegrationSection =
  mongoose.models.IntegrationSection ||
  mongoose.model("IntegrationSection", integrationSectionSchema);

export default IntegrationSection;
