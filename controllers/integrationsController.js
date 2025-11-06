import IntegrationSection from "../models/integrationsModel.js";

export const getIntegrationSection = async (req, res) => {
  try {
    const section = await IntegrationSection.findOne();
    res.json({ success: true, section: section || {} });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const saveIntegrationSection = async (req, res) => {
  try {
    let section = await IntegrationSection.findOne();

    if (section) {
      section = await IntegrationSection.findOneAndUpdate({}, req.body, {
        new: true,
      });
      return res.json({
        success: true,
        message: "Integration updated",
        section,
      });
    }

    section = await IntegrationSection.create(req.body);
    return res.json({ success: true, message: "Integration saved", section });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
