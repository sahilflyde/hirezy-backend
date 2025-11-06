import MetricsSection from "../models/metricsModel.js";

export const getMetricsSection = async (req, res) => {
  try {
    const section = await MetricsSection.findOne();
    res.json({ success: true, section: section || {} });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const saveMetricsSection = async (req, res) => {
  try {
    let section = await MetricsSection.findOne();

    if (section) {
      section = await MetricsSection.findOneAndUpdate({}, req.body, {
        new: true,
      });
      return res.json({ success: true, message: "Metrics updated", section });
    }

    section = await MetricsSection.create(req.body);
    return res.json({ success: true, message: "Metrics saved", section });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
