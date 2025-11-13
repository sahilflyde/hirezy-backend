import express from "express";
import { deployToGitHub } from "../controllers/deployControllersNew.js";

const router = express.Router();

router.post("/github", deployToGitHub);

export default router;
