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
  colSpan: Number,
  rowSpan: Number,
});

const teamsSchema = new mongoose.Schema(
  {
    label: String,
    title: String,
    subtitle: String,
    minColWidth: { type: String, default: "310px" },
    gap: { type: String, default: "32px" },
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
