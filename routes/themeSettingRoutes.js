import express from "express";
import { getThemeSetting, updateThemeSetting } from "../controllers/themeSettingController.js";


const router = express.Router();

router.get("/theme-setting", getThemeSetting);
router.put("/theme-setting", updateThemeSetting);

export default router;
