import ThemeSetting from "../models/themeSettingModel.js";

export const getThemeSetting = async (req, res) => {
  let setting = await ThemeSetting.findOne();
  if (!setting) setting = await ThemeSetting.create({ theme: "light" });

  res.json({ success: true, theme: setting.theme });
};

export const updateThemeSetting = async (req, res) => {
  const { theme } = req.body;

  let setting = await ThemeSetting.findOne();
  if (!setting) setting = await ThemeSetting.create({ theme });
  else {
    setting.theme = theme;
    await setting.save();
  }

  
  if (global.io) {
    global.io.emit("theme-updated", theme);
    console.log("Socket called")
    console.log("Connected Clients:", global.io.engine.clientsCount);
  }

  res.json({ success: true, theme });
};
