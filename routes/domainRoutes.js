import {
  addDomain,
  getDomainStatus,
  verifyDomain,
} from "../controllers/domainController.js";

import express from "express";
const router = express.Router();

router.post("/add", addDomain);
router.get("/status/:domain", getDomainStatus);
router.post("/verify/:domain", verifyDomain);

export default router;
