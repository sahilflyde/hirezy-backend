import express from "express";
import { getHero, saveHero } from "../controllers/heroController.js";

const router = express.Router();

router.get("/", getHero);
router.post("/", saveHero);

export default router;
