import mongoose from "mongoose";

const testimonialItemSchema = new mongoose.Schema(
  {
    companyLogo: String,
    company: String,
    quote: String,
    details: String,
    name: String,
    role: String,
    imageSrc: String,
  },
  { _id: false }
);

const testimonialSectionSchema = new mongoose.Schema(
  {
    items: { type: [testimonialItemSchema], default: [] },
  },
  { timestamps: true }
);

const TestimonialSection =
  mongoose.models.TestimonialSection ||
  mongoose.model("TestimonialSection", testimonialSectionSchema);

export default TestimonialSection;
