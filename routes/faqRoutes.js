import express from "express";
import {
  getFAQSection,
  saveFAQSection,
} from "../controllers/faqSectionController.js";

const router = express.Router();

router.get("/", getFAQSection);
router.post("/", saveFAQSection);

export default router;
