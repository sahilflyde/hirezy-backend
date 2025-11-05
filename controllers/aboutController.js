import AboutSection from "../models/aboutModel.js";

export const getAboutSection = async (req, res) => {
  try {
    const data = await AboutSection.findOne();
    res.json(data || {});
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const saveAboutSection = async (req, res) => {
  try {
    const { title, subtitle, description, media, centerTitle } = req.body;

    let section = await AboutSection.findOne();

    if (!section) {
      section = new AboutSection({
        title,
        subtitle,
        description,
        media,
        centerTitle,
      });
    } else {
      section.title = title;
      section.subtitle = subtitle;
      section.description = description;
      section.media = media;
      section.centerTitle = centerTitle;
    }

    await section.save();

    res.status(200).json({
      success: true,
      message: "About section saved successfully",
      data: section,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
