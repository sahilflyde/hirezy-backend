import TransformSection from "../models/transformSectionModel.js";

export const getTransformSection = async (req, res) => {
  try {
    const section = await TransformSection.findOne();
    return res.json({ success: true, section: section || {} });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const saveTransformSection = async (req, res) => {
  try {
    let section = await TransformSection.findOne();

    if (section) {
      section = await TransformSection.findOneAndUpdate({}, req.body, {
        new: true,
      });
      return res.json({
        success: true,
        message: "Transform section updated",
        section,
      });
    }

    section = await TransformSection.create(req.body);
    return res.json({
      success: true,
      message: "Transform section saved",
      section,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
