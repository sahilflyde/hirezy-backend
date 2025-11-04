import mongoose from "mongoose";

const successStorySchema = new mongoose.Schema(
  {
    founderName: { type: String, required: true },
    founderPost: { type: String, required: true },
    description: { type: String, required: true },
    photo: { type: String, required: true },
    logo: { type: String, required: true }, 
  },
  { timestamps: true }
);

export default mongoose.model("SuccessStory", successStorySchema);
