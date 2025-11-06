import express from "express";
import { getMetricsSection, saveMetricsSection } from "../controllers/metricsController.js";

const router = express.Router();

router.get("/", getMetricsSection);
router.post("/", saveMetricsSection);

export default router;
