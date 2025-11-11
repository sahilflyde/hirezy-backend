import ThemeSetting from "../models/themeSettingModel.js";

export const getThemeSetting = async (req, res) => {
  let setting = await ThemeSetting.findOne();
  if (!setting) setting = await ThemeSetting.create({ theme: "light" });

  res.json({ success: true, theme: setting.theme });
};

export const updateThemeSetting = async (req, res) => {
  const { theme } = req.body;

  if (!["light", "dark"].includes(theme))
    return res.status(400).json({ success: false, message: "Invalid theme" });

  let setting = await ThemeSetting.findOne();
  if (!setting) {
    setting = await ThemeSetting.create({ theme });
  } else {
    setting.theme = theme;
    await setting.save();
  }

  res.json({ success: true, theme });
};
