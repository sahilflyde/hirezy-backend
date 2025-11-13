import path from "path";
import fs from "fs-extra";
import { exec } from "child_process";
import Website from "../models/createdWebsiteModel.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// AUTO-DETECT hirezy-admin/scripts/generateWebsite.js
function findFrontendScript() {
  let current = path.resolve(__dirname);

  while (true) {
    const parent = path.dirname(current);

    const possible = path.join(
      parent,
      "hirezy-admin",
      "scripts",
      "generateWebsite.js"
    );

    if (fs.existsSync(possible)) {
      console.log("✅ Found frontend script at:", possible);
      return possible;
    }

    if (parent === current) break;

    current = parent;
  }

  throw new Error("❌ Could not find hirezy-admin/src/scripts/generateWebsite.js");
}

export const deployToGitHub = async (req, res) => {
  try {
    const { slug } = req.body;

    if (!slug) {
      return res.status(400).json({ error: "Slug is required" });
    }

    const website = await Website.findOne({ slug });
    if (!website) {
      return res.status(404).json({ error: "Website not found" });
    }

    const tmpDir = path.resolve("tmp");
    await fs.ensureDir(tmpDir);

    const jsonPath = path.join(tmpDir, `${slug}.json`);
    await fs.writeJSON(jsonPath, website, { spaces: 2 });

    // use auto-detected path
    const scriptPath = findFrontendScript();

    console.log("🚀 Running script:", scriptPath);

    const command = `node "${scriptPath}" --run "${jsonPath}"`;

    exec(command, (err, stdout, stderr) => {
      if (err) {
        console.error("❌ Script Error:", stderr);
        return res.status(500).json({
          success: false,
          error: "Script failed",
          details: stderr,
        });
      }

      console.log("🚀 Script Output:", stdout);

      const match = stdout.match(/https:\/\/github\.com\/[^\s]+/);
      const repoURL = match ? match[0] : null;

      return res.json({
        success: true,
        message: "Deployment completed",
        repo: repoURL,
        logs: stdout,
      });
    });
  } catch (err) {
    console.error("Deploy Error:", err);
    res.status(500).json({ error: err.message });
  }
};
