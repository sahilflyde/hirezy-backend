import TeamsSection from "../models/teamsModel.js";

export const getTeamsSection = async (req, res) => {
  try {
    let section = await TeamsSection.findOne();

    // ✅ If no document exists, create default one
    if (!section) {
      section = await TeamsSection.create({
        label: "",
        title: "",
        subtitle: "",
        minColWidth: "310px",
        gap: "32px",
        columnsMode: "auto",
        columns: 3,
        centerTitle: "center",
        items: [],
      });
    }

    res.json({ success: true, section });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const saveTeamsSection = async (req, res) => {
  try {
    const body = req.body;

    // ✅ If columnsMode = auto → ignore columns value
    if (body.columnsMode === "auto") {
      body.columns = undefined; // clean ensure frontend auto layout
    }

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
