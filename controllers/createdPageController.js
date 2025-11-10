import CreatedPage from "../models/createdPageModel.js";

// ✅ Check if slug exists
export const checkSlug = async (req, res) => {
  try {
    const exists = await CreatedPage.findOne({ slug: req.params.slug });
    res.json({ exists: !!exists });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Save or update created page
export const savePage = async (req, res) => {
  try {
    const { slug, components } = req.body;

    const createdPage = await CreatedPage.findOneAndUpdate(
      { slug },
      { slug, components },
      { new: true, upsert: true }
    );

    return res.json({ success: true, createdPage });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Get single page by slug
export const getPageBySlug = async (req, res) => {
  try {
    const page = await CreatedPage.findOne({ slug: req.params.slug });
    if (!page) return res.status(404).json({ error: "Not found" });
    res.json(page);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Get all pages
export const getAllPages = async (req, res) => {
  try {
    const pages = await CreatedPage.find().sort({ createdAt: -1 });
    res.json(pages);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Delete page
export const deletePage = async (req, res) => {
  try {
    await CreatedPage.deleteOne({ slug: req.params.slug });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
