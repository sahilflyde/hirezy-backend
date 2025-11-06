import express from "express";
import {
  getWhyChoose,
  saveWhyChoose,
} from "../controllers/whyChooseController.js";
const router = express.Router();

router.get("/", getWhyChoose);
router.post("/", saveWhyChoose);

export default router;
