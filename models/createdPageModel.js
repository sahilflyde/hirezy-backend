import mongoose from "mongoose";

const ChildSchema = new mongoose.Schema(
  {
    type: String,
    props: {},
  },
  { _id: false }
);

const ComponentSchema = new mongoose.Schema(
  { 
    type: String,
    props: {},
    children: [ChildSchema],
  },
  { _id: false }
);

const CreatedPageSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    components: [ComponentSchema],
  },
  { timestamps: true }
);

export default mongoose.model("CreatedPage", CreatedPageSchema);
