import express from "express";
import {
  getHeaderSection,
  saveHeaderSection,
} from "../controllers/headerController.js";

const router = express.Router();

router.get("/", getHeaderSection);
router.post("/", saveHeaderSection);

export default router;
