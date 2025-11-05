import Hero from "../models/heroModel.js";

// ✅ Get hero data
export const getHero = async (req, res) => {
  try {
    const hero = await Hero.findOne();
    res.json(hero || {});
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Create or update hero
export const saveHero = async (req, res) => {
  try {
    const data = req.body;

    let hero = await Hero.findOne();
    if (hero) {
      Object.assign(hero, data);
      await hero.save();
    } else {
      hero = await Hero.create(data);
    }

    res.json({ success: true, message: "Hero updated", hero });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
