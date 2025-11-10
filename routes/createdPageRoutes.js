import express from "express";
import { checkSlug, deletePage, getAllPages, getPageBySlug, savePage } from "../controllers/createdPageController.js";


const router = express.Router();

// ✅ Check if slug is unique
router.get("/check-slug/:slug", checkSlug);

// ✅ Save (create/update)
router.post("/save", savePage);

// ✅ Get single page for preview
router.get("/:slug", getPageBySlug);

// ✅ Get all pages (CMS page list)
router.get("/", getAllPages);

// ✅ Delete by slug
router.delete("/:slug", deletePage);

export default router;
