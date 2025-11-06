import PricingSection from "../models/pricingPlansModel.js";

export const getPricingSection = async (req, res) => {
  try {
    const section = await PricingSection.findOne();
    res.json({ success: true, section: section || {} });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const savePricingSection = async (req, res) => {
  try {
    let section = await PricingSection.findOne();

    if (section) {
      section = await PricingSection.findOneAndUpdate({}, req.body, {
        new: true,
      });
      return res.json({ success: true, message: "Pricing updated", section });
    }

    section = await PricingSection.create(req.body);
    return res.json({ success: true, message: "Pricing saved", section });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
