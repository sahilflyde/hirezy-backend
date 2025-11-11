import mongoose from "mongoose";

const DomainMapSchema = new mongoose.Schema(
  {
    domain: { type: String, required: true, unique: true },
    pageSlug: { type: String, required: true },
    status: { type: String, default: "pending" }, 
    verificationToken: { type: String }, 
  },
  { timestamps: true }
); 

export default mongoose.model("DomainMap", DomainMapSchema);
