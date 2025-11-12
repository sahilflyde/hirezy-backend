import express from "express";
import {
  checkSlug,
  deleteWebsite,
  getAllWebsites,
  getWebsiteBySlug,
  saveWebsite,
} from "../controllers/createdWebsiteController.js";

const router = express.Router();

router.get("/check-slug/:slug", checkSlug);

router.post("/save", saveWebsite);

router.get("/:slug", getWebsiteBySlug);

router.get("/", getAllWebsites);

router.delete("/:slug", deleteWebsite);

export default router;
