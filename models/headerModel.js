import mongoose from "mongoose";

const navLinkSchema = new mongoose.Schema(
  {
    name: String,
    href: String,
  },
  { _id: false }
);

const headerSchema = new mongoose.Schema(
  {
    logo: { type: String, default: "" },
    navLinks: { type: [navLinkSchema], default: [] },
    ctaText: { type: String, default: "Sign In" },
    ctaLink: { type: String, default: "/sign-in" },
    favicon: { type: String, default: "" },
  },
  { timestamps: true }
);

const HeaderSection =
  mongoose.models.HeaderSection ||
  mongoose.model("HeaderSection", headerSchema);

export default HeaderSection;
