import express from "express";
import {
  getTransformSection,
  saveTransformSection,
} from "../controllers/transformSectionController.js";

const router = express.Router();

router.get("/", getTransformSection);
router.post("/", saveTransformSection);

export default router;
