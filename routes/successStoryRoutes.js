import express from "express";
import multer from "multer";
import {
  addSuccessStory,
  getAllSuccessStories,
  deleteSuccessStory,
  updateSuccessStory,
} from "../controllers/successStoryController.js";

const router = express.Router();

// Multer temp storage
const upload = multer({ dest: "temp/" });

// Routes
router.post(
  "/",
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "logo", maxCount: 1 },
  ]),
  addSuccessStory
);

router.get("/", getAllSuccessStories);
router.delete("/:id", deleteSuccessStory);
router.put(
  "/:id",
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "logo", maxCount: 1 },
  ]),
  updateSuccessStory
);

export default router;
