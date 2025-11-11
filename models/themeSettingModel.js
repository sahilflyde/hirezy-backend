import mongoose from "mongoose";

const themeSettingSchema = new mongoose.Schema({
  theme: {
    type: String,
    enum: ["light", "dark"],
    default: "light",
  },
});

export default mongoose.model("ThemeSetting", themeSettingSchema);
