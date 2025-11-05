import express from "express";
import {
  getAboutSection,
  saveAboutSection,
} from "../controllers/aboutController.js";

const router = express.Router();

router.get("/", getAboutSection);
router.post("/", saveAboutSection);

export default router;
