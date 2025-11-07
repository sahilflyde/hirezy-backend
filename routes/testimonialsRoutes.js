import express from "express";
import {
  getTestimonialSection,
  saveTestimonialSection,
} from "../controllers/testimonialsController.js";

const router = express.Router();

router.get("/", getTestimonialSection);
router.post("/", saveTestimonialSection);

export default router;
