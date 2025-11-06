import express from "express";
import { getFeaturesSection, saveFeaturesSection } from "../controllers/featuresSectionController.js";


const router = express.Router();

router.get("/", getFeaturesSection);
router.post("/", saveFeaturesSection);

export default router;
