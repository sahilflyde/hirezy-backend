import FAQSection from "../models/faqSectionModel.js";


export const getFAQSection = async (req, res) => {
  try {
    const section = await FAQSection.findOne();
    res.json({ success: true, section: section || {} });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const saveFAQSection = async (req, res) => {
  try {
    let section = await FAQSection.findOne();

    if (section) {
      section = await FAQSection.findOneAndUpdate({}, req.body, { new: true });
      return res.json({ success: true, message: "FAQ updated", section });
    }

    section = await FAQSection.create(req.body);
    return res.json({ success: true, message: "FAQ saved", section });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
