import DomainMap from "../models/domainMapModel.js";
import fetch from "node-fetch";

const VERCEL_TOKEN = "oL7Ooath3u0gsv8DLE48XZa4";
const PROJECT_ID = "prj_C31ra7RLyFeF7cVk1qI2GpndDBdy";

const getVerificationToken = (obj) =>
  obj?.verification?.[0]?.value ||
  obj?.verification?.[0]?.token ||
  obj?.txtVerification?.token ||
  obj?.verificationToken ||
  null;

export const addDomain = async (req, res) => {
  try {
    let { domain, pageSlug } = req.body;

    if (!domain || !pageSlug) {
      return res.status(400).json({ error: "Domain & pageSlug required" });
    }

    // ✅ Clean domain
    domain = domain
      .toLowerCase()
      .trim()
      .replace("https://", "")
      .replace("http://", "")
      .replace("www.", "");

    console.log("📌 Adding domain:", domain, "for page:", pageSlug);

    // ✅ Save or update DB entry
    const map = await DomainMap.findOneAndUpdate(
      { domain },
      { domain, pageSlug, status: "pending" },
      { upsert: true, new: true }
    );

    // ✅ STEP 1 — Check if already exists in Vercel
    const checkResp = await fetch(
      `https://api.vercel.com/v6/domains/${domain}`,
      {
        headers: { Authorization: `Bearer ${VERCEL_TOKEN}` },
      }
    );
    const checkJson = await checkResp.json();
    console.log("🔍 Vercel Check Response:", checkJson);

    // ✅ Already verified?
    if (checkJson?.verified === true) {
      map.status = "verified";
      await map.save();

      return res.json({
        success: true,
        status: "verified",
        msg: "✅ Domain already verified",
      });
    }

    // ✅ Try to get existing token
    let token = getVerificationToken(checkJson);

    if (!token) {
      // ✅ STEP 2 — Add domain to project (force Vercel to generate token)
      console.log("⚠️ No token from check; adding to project...");

      const addResp = await fetch(
        `https://api.vercel.com/v9/projects/${PROJECT_ID}/domains`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${VERCEL_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: domain }),
        }
      );

      const addJson = await addResp.json();
      console.log("🛠 Vercel Add Response:", addJson);

      token = getVerificationToken(addJson);
    }

    // ✅ Save token if we got one
    if (token) {
      map.verificationToken = token;
      await map.save();
    }

    return res.json({
      success: true,
      status: "pending",
      msg: "Add following DNS records to verify:",
      dns: [
        {
          type: "TXT",
          host: "_vercel",
          value: token || "Token not returned (might already be verified)",
        },
        {
          type: "CNAME",
          host: "@",
          value: "cname.vercel-dns.com",
        },
      ],
    });
  } catch (err) {
    console.error("❌ addDomain ERROR:", err);

    return res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
};

// ✅ Check live DNS status (NO DB update)
export const getDomainStatus = async (req, res) => {
  try {
    const { domain } = req.params;

    const vercelRes = await fetch(
      `https://api.vercel.com/v6/domains/${domain}/config`,
      {
        headers: { Authorization: `Bearer ${VERCEL_TOKEN}` },
      }
    );

    const data = await vercelRes.json();

    // ✅ Send only true verified if Vercel verified
    return res.json({
      verified: data?.verified === true ? true : false,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const verifyDomain = async (req, res) => {
  try {
    const { domain } = req.params;

    const vercelRes = await fetch(
      `https://api.vercel.com/v9/projects/${PROJECT_ID}/domains/${domain}/verify`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${VERCEL_TOKEN}` },
      }
    );

    const data = await vercelRes.json();

    if (data?.verified === true) {
      // ✅ Update DB
      await DomainMap.findOneAndUpdate({ domain }, { status: "verified" });

      // ✅ IMPORTANT: ATTACH DOMAIN TO PROJECT
      await fetch(`https://api.vercel.com/v9/projects/${PROJECT_ID}/domains`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${VERCEL_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: domain }),
      });

      return res.json({
        verified: true,
        msg: "✅ Domain verified & connected to project",
      });
    }

    return res.json({
      verified: false,
      msg: "⚠️ TXT not detected yet",
    });
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
};
