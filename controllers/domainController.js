import DomainMap from "../models/domainMapModel.js";
import fetch from "node-fetch";

const VERCEL_TOKEN = "oL7Ooath3u0gsv8DLE48XZa4";
const PROJECT_ID = "prj_C31ra7RLyFeF7cVk1qI2GpndDBdy";

export const addDomain = async (req, res) => {
  try {
    const { domain, pageSlug } = req.body;

    const map = await DomainMap.findOneAndUpdate(
      { domain },
      { domain, pageSlug, status: "pending" },
      { upsert: true, new: true }
    );

    // ✅ First: check domain info from Vercel
    const check = await fetch(`https://api.vercel.com/v6/domains/${domain}`, {
      headers: { Authorization: `Bearer ${VERCEL_TOKEN}` },
    });
    const checkJson = await check.json();

    // ✅ If domain exists + verified already
    if (checkJson?.verified) {
      map.status = "verified";
      await map.save();
      return res.json({
        success: true,
        status: "verified",
        msg: "✅ Domain already verified",
      });
    }

    // ✅ If domain exists but NOT verified, get TXT token
    const token =
      checkJson?.verification?.[0]?.value ||
      checkJson?.txtVerification?.token ||
      null;

    if (token) {
      map.verificationToken = token;
      await map.save();
      return res.json({
        success: true,
        status: "pending",
        msg: "Add TXT to verify",
        dns: {
          type: "TXT",
          host: "_vercel",
          value: token,
        },
      });
    }

    // ✅ If no token → add domain to project explicitly
    const addResp = await fetch(`https://api.vercel.com/v10/domains`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${VERCEL_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: domain, projectId: PROJECT_ID }),
    });

    const addJson = await addResp.json();

    const newToken =
      addJson?.verification?.[0]?.value ||
      addJson?.txtVerification?.token ||
      null;

    map.verificationToken = newToken;
    await map.save();

    return res.json({
      success: true,
      status: "pending",
      msg: "Add TXT to verify",
      dns: {
        type: "TXT",
        host: "_vercel",
        value: newToken,
      },
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

// ✅ Verify: ONLY update DB if Vercel confirms real verification
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
      await DomainMap.findOneAndUpdate({ domain }, { status: "verified" });

      return res.json({
        verified: true,
        msg: "✅ Domain verified from Vercel",
      });
    }

    return res.json({
      verified: false,
      msg: "⚠️ Not verified yet. Add DNS TXT and wait.",
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
