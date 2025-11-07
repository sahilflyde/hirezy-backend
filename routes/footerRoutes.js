import express from "express";
import { getFooterSection, saveFooterSection } from "../controllers/footerController.js";


const router = express.Router();

router.get("/", getFooterSection);
router.post("/", saveFooterSection);

export default router;
