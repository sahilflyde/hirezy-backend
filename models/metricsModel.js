import mongoose from "mongoose";

const metricItemSchema = new mongoose.Schema(
  {
    number: { type: String, required: true },
    label: { type: String, required: true },
  },
  { _id: false }
);

const metricsSectionSchema = new mongoose.Schema(
  {
    items: { type: [metricItemSchema], default: [] },
  },
  { timestamps: true }
);

const MetricsSection =
  mongoose.models.MetricsSection ||
  mongoose.model("MetricsSection", metricsSectionSchema);

export default MetricsSection;
