import express from "express";
import {
  getTeamsSection,
  saveTeamsSection,
} from "../controllers/teamsSectionController.js";

const router = express.Router();

router.get("/", getTeamsSection);
router.post("/", saveTeamsSection);

export default router;
