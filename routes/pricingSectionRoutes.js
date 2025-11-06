import express from "express";
import {
  getPricingSection,
  savePricingSection,
} from "../controllers/pricingSectionsController.js";

const router = express.Router();

router.get("/", getPricingSection);
router.post("/", savePricingSection);

export default router;
