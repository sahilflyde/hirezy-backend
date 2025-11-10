import DomainMap from "../models/domainMapModel.js";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

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

    const vercelRes = await fetch(
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

    const data = await vercelRes.json();
    res.json({ success: true, map, vercel: data });

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

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
    res.json(data);

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

    if (data?.verified) {
      await DomainMap.findOneAndUpdate(
        { domain },
        { status: "verified" }
      );
    }

    res.json(data);

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
