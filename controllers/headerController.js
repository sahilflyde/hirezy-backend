import HeaderSection from "../models/headerModel.js";

export const getHeaderSection = async (req, res) => {
  try {
    const section = await HeaderSection.findOne();
    res.json({ success: true, section: section || {} });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const saveHeaderSection = async (req, res) => {
  try {
    let section = await HeaderSection.findOne();

    if (section) {
      section = await HeaderSection.findOneAndUpdate({}, req.body, {
        new: true,
      });
      return res.json({ success: true, message: "Header updated", section });
    }

    section = await HeaderSection.create(req.body);
    res.json({ success: true, message: "Header saved", section });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
