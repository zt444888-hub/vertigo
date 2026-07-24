import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Endpoint: Gemini AI Vertigo & Balance Health Insight Generator
  app.post("/api/health-insight", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        return res.json({
          insight: "Hydration levels and reduced sodium seem to correlate with lower vertigo frequency. Remember to drink 8+ glasses of water today and avoid sudden head movements.",
          isFallback: true,
        });
      }

      const { episodes } = req.body;
      const ai = new GoogleGenAI({ apiKey });

      const prompt = `You are an empathetic, clinical vertigo and vestibular health assistant. 
Analyze these recent attack episodes logged by a user:
${JSON.stringify(episodes, null, 2)}

Provide 2-3 concise, practical, soothing sentences summarizing key triggers, patterns, or actionable lifestyle tips (e.g. hydration, sodium control, head position changes, stress reduction). Keep a calm, supportive, reassuring tone suitable for someone with Meniere's or vertigo distress. Do not give direct medical diagnosis, but give general wellness tips based on the logs.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      const text = response.text || "Hydration levels seem to correlate with your vertigo frequency. Try increasing your water intake today.";
      return res.json({ insight: text.trim(), isFallback: false });
    } catch (err: any) {
      console.error("Error generating AI insight:", err);
      return res.json({
        insight: "Hydration levels seem to correlate with your vertigo frequency. Try increasing your water intake today and limiting salt consumption.",
        isFallback: true,
      });
    }
  });

  // Serve static files / Vite middleware
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`BalanceLog server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
