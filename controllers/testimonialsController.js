import TestimonialSection from "../models/testimonialsModel.js";

export const getTestimonialSection = async (req, res) => {
  try {
    const section = await TestimonialSection.findOne();
    res.json({ success: true, section: section || {} });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const saveTestimonialSection = async (req, res) => {
  try {
    let section = await TestimonialSection.findOne();

    if (section) {
      section = await TestimonialSection.findOneAndUpdate({}, req.body, {
        new: true,
      });
      return res.json({
        success: true,
        message: "Testimonials updated",
        section,
      });
    }

    section = await TestimonialSection.create(req.body);
    res.json({ success: true, message: "Testimonials saved", section });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
