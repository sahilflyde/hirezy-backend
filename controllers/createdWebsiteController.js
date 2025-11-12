import Website from "../models/createdWebsiteModel.js";

export const checkSlug = async (req, res) => {
  try {
    const exists = await Website.findOne({ slug: req.params.slug });
    res.json({ exists: !!exists });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const saveWebsite = async (req, res) => {
  try {
    const {
      siteId,
      websiteName,
      slug,
      domain,
      favicon,
      deploy,
      theme,
      analytics,
      pages,
    } = req.body;

    const site = await Website.findOneAndUpdate(
      { siteId },
      {
        siteId,
        websiteName,
        slug,
        domain,
        favicon,
        deploy,
        theme,
        analytics,
        pages,
      },
      { new: true, upsert: true }
    );

    res.json({ success: true, site });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getWebsiteBySlug = async (req, res) => {
  try {
    const site = await Website.findOne({ slug: req.params.slug });
    if (!site) return res.status(404).json({ error: "Website not found" });
    res.json(site);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const getAllWebsites = async (req, res) => {
  try {
    const sites = await Website.find().sort({ createdAt: -1 });
    res.json(sites);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteWebsite = async (req, res) => {
  try {
    await Website.deleteOne({ slug: req.params.slug });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
