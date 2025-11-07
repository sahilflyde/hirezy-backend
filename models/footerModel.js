import mongoose from "mongoose";

const linkSchema = new mongoose.Schema(
  {
    name: String,
    href: String,
  },
  { _id: false }
);

const contactSchema = new mongoose.Schema(
  {
    icon: String,
    text: String,
  },
  { _id: false }
);

const socialSchema = new mongoose.Schema(
  {
    name: String,
    href: String,
  },
  { _id: false }
);

const footerSchema = new mongoose.Schema(
  {
    logo: { type: String, default: "" },
    description: { type: String, default: "" },

    quickLinks: { type: [linkSchema], default: [] },
    contacts: { type: [contactSchema], default: [] },
    socials: { type: [socialSchema], default: [] },

    subscribeTitle: { type: String, default: "" },
    subscribeSubtitle: { type: String, default: "" },

    copyright: { type: String, default: "" },
  },
  { timestamps: true }
);

const FooterSection =
  mongoose.models.FooterSection ||
  mongoose.model("FooterSection", footerSchema);

export default FooterSection;
