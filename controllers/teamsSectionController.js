import TeamsSection from "../models/teamsModel.js";

export const getTeamsSection = async (req, res) => {
  try {
    const data = await TeamsSection.findOne();
    res.json(data || {});
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const saveTeamsSection = async (req, res) => {
  try {
    const body = req.body;

    let section = await TeamsSection.findOne();
    if (section) {
      Object.assign(section, body);
      await section.save();
    } else {
      section = await TeamsSection.create(body);
    }

    res.json({ success: true, section });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
