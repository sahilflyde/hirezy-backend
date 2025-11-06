import express from "express";
import {
  getIntegrationSection,
  saveIntegrationSection,
} from "../controllers/integrationsController.js";

const router = express.Router();

router.get("/", getIntegrationSection);
router.post("/", saveIntegrationSection);

export default router;
