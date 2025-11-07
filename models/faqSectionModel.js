import mongoose from "mongoose";

const faqItemSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
  },
  { _id: false }
);

const faqSectionSchema = new mongoose.Schema(
  {
    label: { type: String, default: "FAQ" },
    title: { type: String, default: "Have a Question?" },
    subtitle: {
      type: String,
      default:
        "Save time with straightforward answers to common questions recruiters and HR teams often ask.",
    },
    items: { type: [faqItemSchema], default: [] },
  },
  { timestamps: true }
);

const FAQSection =
  mongoose.models.FAQSection || mongoose.model("FAQSection", faqSectionSchema);

export default FAQSection;
