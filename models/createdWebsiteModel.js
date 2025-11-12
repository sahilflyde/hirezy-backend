import mongoose from "mongoose";

const ComponentSchema = new mongoose.Schema(
  {
    type: { type: String, required: true },
    props: { type: Object, default: {} },
    children: { type: Array, default: [] },
  },
  { _id: false }
);

const PageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    route: { type: String, required: true },
    components: { type: [ComponentSchema], default: [] },
    seo: { type: Object, default: {} },
  },
  { _id: false }
);

const WebsiteSchema = new mongoose.Schema(
  {
    siteId: { type: String, required: true, unique: true },
    websiteName: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    domain: { type: String, default: null },
    favicon: { type: String, default: null },
    deploy: { type: Object, default: {} },
    theme: { type: Object, default: {} },
    analytics: { type: Object, default: {} },
    pages: { type: [PageSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model("Website", WebsiteSchema);
