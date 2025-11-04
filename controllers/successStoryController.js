import SuccessStory from "../models/successStory.js";

import fs from "fs";
import imagekit from "../utils/imagekit.js";

// ---------------------------
// 📤 Add new Success Story
// ---------------------------
export const addSuccessStory = async (req, res) => {
  try {
    const { founderName, founderPost, description } = req.body;

    if (!req.files?.photo || !req.files?.logo) {
      return res.status(400).json({ message: "Photo and logo are required" });
    }

    const photoFile = req.files.photo[0];
    const logoFile = req.files.logo[0];

    // Upload to ImageKit
    const [photoUpload, logoUpload] = await Promise.all([
      imagekit.upload({
        file: fs.readFileSync(photoFile.path),
        fileName: `photo-${Date.now()}-${photoFile.originalname}`,
        folder: "/success-stories",
      }),
      imagekit.upload({
        file: fs.readFileSync(logoFile.path),
        fileName: `logo-${Date.now()}-${logoFile.originalname}`,
        folder: "/success-stories",
      }),
    ]);

    // Delete temp files
    fs.unlinkSync(photoFile.path);
    fs.unlinkSync(logoFile.path);

    // Save in MongoDB
    const successStory = new SuccessStory({
      founderName,
      founderPost,
      description,
      photo: photoUpload.url,
      logo: logoUpload.url,
    });

    await successStory.save();

    res.status(201).json({
      message: "✅ Success Story added successfully",
      successStory,
    });


  } catch (err) {
    console.error("Error adding success story:", err);

    
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


export const getAllSuccessStories = async (req, res) => {
  try {
    const stories = await SuccessStory.find();
    res.status(200).json(stories);
  } catch (err) {
    console.error("Error fetching stories:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ---------------------------
// ❌ Delete Success Story
// ---------------------------
export const deleteSuccessStory = async (req, res) => {
  try {
    const { id } = req.params;
    const story = await SuccessStory.findByIdAndDelete(id);
    if (!story) return res.status(404).json({ message: "Not found" });

    res.json({ message: "🗑️ Deleted successfully", story });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ---------------------------
// ✏️ Update Success Story
// ---------------------------
export const updateSuccessStory = async (req, res) => {
  try {
    const { id } = req.params;
    const { founderName, founderPost, description } = req.body;

    const existingStory = await SuccessStory.findById(id);
    if (!existingStory)
      return res.status(404).json({ message: "Story not found" });

    let photoUrl = existingStory.photo;
    let logoUrl = existingStory.logo;

    // If new files uploaded → update ImageKit
    if (req.files?.photo) {
      const photoFile = req.files.photo[0];
      const uploaded = await imagekit.upload({
        file: fs.readFileSync(photoFile.path),
        fileName: `photo-${Date.now()}-${photoFile.originalname}`,
        folder: "/success-stories",
      });
      fs.unlinkSync(photoFile.path);
      photoUrl = uploaded.url;
    }

    if (req.files?.logo) {
      const logoFile = req.files.logo[0];
      const uploaded = await imagekit.upload({
        file: fs.readFileSync(logoFile.path),
        fileName: `logo-${Date.now()}-${logoFile.originalname}`,
        folder: "/success-stories",
      });
      fs.unlinkSync(logoFile.path);
      logoUrl = uploaded.url;
    }

    existingStory.founderName = founderName || existingStory.founderName;
    existingStory.founderPost = founderPost || existingStory.founderPost;
    existingStory.description = description || existingStory.description;
    existingStory.photo = photoUrl;
    existingStory.logo = logoUrl;

    await existingStory.save();

    res.json({ message: "✅ Story updated successfully", existingStory });
  } catch (err) {
    console.error("Error updating story:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
