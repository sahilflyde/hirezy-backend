import DomainMap from "../models/domainMapModel.js";
import fetch from "node-fetch";

const VERCEL_TOKEN = "oL7Ooath3u0gsv8DLE48XZa4";
const PROJECT_ID = "prj_C31ra7RLyFeF7cVk1qI2GpndDBdy";

export const addDomain = async (req, res) => {
  try {
    let { domain, pageSlug } = req.body;

    // ✅ sanitize domain
    domain = domain
      .trim()
      .replace("https://", "")
      .replace("http://", "")
      .replace("www.", "");

    const map = await DomainMap.findOneAndUpdate(
      { domain },
      { domain, pageSlug, status: "pending" },
      { upsert: true, new: true }
    );

    // ✅ add domain to project
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
    console.log("Vercel Add Response:", addJson);

    // ✅ get token
    const token =
      addJson?.verification?.[0]?.value ||
      addJson?.verification?.[0]?.token ||
      addJson?.txtVerification?.token ||
      null;

    map.verificationToken = token;
    await map.save();

    // ✅ if token missing
    if (!token) {
      return res.json({
        success: true,
        status: "waiting",
        msg: "Domain added but Vercel did not return token. Possibly already verified or conflict.",
      });
    }

    return res.json({
      success: true,
      status: "pending",
      msg: "Add following DNS:",
      dns: [
        {
          type: "TXT",
          host: "_vercel",
          value: token,
        },
        {
          type: "CNAME",
          host: "@",
          value: "cname.vercel-dns.com",
        },
      ],
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
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
