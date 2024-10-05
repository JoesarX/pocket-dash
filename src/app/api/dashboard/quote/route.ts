// pages/api/quotes.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const response = await fetch("https://api.quotable.io/random?tags=love"); // Free quotes API
    const data = await response.json();
    
    res.status(200).json({ quote: data.content });
  } catch {
    res.status(500).json({ error: "Failed to fetch quote" });
  }
}
