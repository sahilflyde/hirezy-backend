import FeaturesSection from "../models/featuresModel.js";

export const getFeaturesSection = async (req, res) => {
  try {
    const section = await FeaturesSection.findOne();
    res.json({ success: true, section: section || {} });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const saveFeaturesSection = async (req, res) => {
  try {
    let section = await FeaturesSection.findOne();

    if (section) {
      section = await FeaturesSection.findOneAndUpdate({}, req.body, {
        new: true,
      });
      return res.json({ success: true, message: "Updated", section });
    }

    section = await FeaturesSection.create(req.body);
    return res.json({ success: true, message: "Saved", section });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
