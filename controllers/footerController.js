import FooterSection from "../models/footerModel.js";


export const getFooterSection = async (req, res) => {
  try {
    const section = await FooterSection.findOne();
    res.json({ success: true, section: section || {} });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const saveFooterSection = async (req, res) => {
  try {
    let section = await FooterSection.findOne();

    if (section) {
      section = await FooterSection.findOneAndUpdate({}, req.body, {
        new: true,
      });
      return res.json({ success: true, message: "Footer updated", section });
    }

    section = await FooterSection.create(req.body);
    res.json({ success: true, message: "Footer saved", section });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
