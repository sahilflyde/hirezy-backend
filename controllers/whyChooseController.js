import WhyChooseSection from "../models/whyChooseModel.js";

export const getWhyChoose = async (req, res) => {
  try {
    const data = await WhyChooseSection.findOne();
    res.json({ success: true, data: data || {} });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const saveWhyChoose = async (req, res) => {
  try {
    let data = await WhyChooseSection.findOne();

    if (data) {
      data = await WhyChooseSection.findOneAndUpdate({}, req.body, {
        new: true, 
      });
      return res.json({
        success: true,
        message: "Why Choose updated",
        data,
      });
    }

    data = await WhyChooseSection.create(req.body);

    res.json({
      success: true,
      message: "Why Choose saved",
      data,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
