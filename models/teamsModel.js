import mongoose from "mongoose";

const teamsCardSchema = new mongoose.Schema({
  heading: String,
  description: String,
  imageLink: String,
  textPosition: {
    type: String,
    enum: ["top", "bottom", "right"],
    default: "top",
  },
  colSpan: { type: Number, default: 1 },
  rowSpan: { type: Number, default: 1 },
});

const teamsSchema = new mongoose.Schema(
  {
    label: String,
    title: String,
    subtitle: String,

    // ✅ Grid Controls
    minColWidth: { type: String, default: "310px" },
    gap: { type: String, default: "32px" },

    // ✅ new field
    columnsMode: {
      type: String,
      enum: ["auto", "custom"],
      default: "auto",
    },

    // ✅ only used when columnsMode = custom
    columns: { type: Number, default: 3 },

    centerTitle: {
      type: String,
      enum: ["left", "center", "right"],
      default: "center",
    },

    items: [teamsCardSchema],
  },
  { timestamps: true }
);

export default mongoose.model("TeamsSection", teamsSchema);
