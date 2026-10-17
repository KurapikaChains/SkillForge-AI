const express = require("express");
const OpenAI = require("openai");
require("dotenv").config();

const app = express();
const port = Number(process.env.PORT || 3000);
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

app.disable("x-powered-by");
app.use(express.json({limit: "8mb"}));
app.use(express.static(__dirname));

app.post("/api/generate-from-image", async (req, res) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(503).json({error:"AI is not configured. Add OPENAI_API_KEY to your local .env file and restart the server."});
    }

    const {imageDataUrl, productName = "", productDetails = "", audience = "practical shoppers", language = "taglish", tone = "friendly"} = req.body || {};
    if (typeof imageDataUrl !== "string") {
      return res.status(400).json({error:"Please upload a product image."});
    }

    const match = imageDataUrl.match(/^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/);
    if (!match || !ALLOWED_MIME_TYPES.has(match[1])) {
      return res.status(400).json({error:"Use a JPG, PNG, or WEBP image."});
    }
    const imageBytes = Buffer.from(match[2], "base64");
    if (imageBytes.length === 0 || imageBytes.length > MAX_IMAGE_BYTES) {
      return res.status(400).json({error:"Image must be valid and 5 MB or smaller."});
    }

    const client = new OpenAI({apiKey:process.env.OPENAI_API_KEY});
    const prompt = `You are a careful TikTok affiliate content assistant. Inspect the supplied product photo and draft content for a short video.

Return ONLY valid JSON with this exact shape:
{
  "hooks": ["three distinct short video hooks"],
  "caption": "one social caption with a few relevant hashtags",
  "voiceover": "a concise voiceover script suitable for a short product video",
  "scenes": [
    {"time":"0–1 s","title":"short scene title","camera":"camera angle or movement","purpose":"what to show","voice":"voiceover line"}
  ]
}

Rules:
- Return exactly 3 hooks and exactly 8 scenes, with times covering 0–10 seconds.
- Output language: ${language}. Tone: ${tone}. Target audience: ${audience}.
- Product name supplied by user (may be blank): ${String(productName).slice(0,120) || "Identify cautiously from image"}.
- Extra user notes (may be blank): ${String(productDetails).slice(0,1000) || "None supplied"}.
- Use visible image details to describe the product, but do not claim hidden specifications, exact price, durability, safety, savings, certification, performance, or included accessories unless confirmed in the user notes.
- If a detail cannot be confirmed from the photo, describe it as something to verify rather than fact.
- Avoid misleading promises, fake scarcity, or pressure tactics.
- Make the hooks engaging and natural for TikTok affiliate content.
- The storyboard should include useful camera angles/motions and a realistic product demonstration.
- Do not claim that the image proves product quality or performance.`;

    const completion = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      input: [{
        role: "user",
        content: [
          {type:"input_text", text:prompt},
          {type:"input_image", image_url:imageDataUrl, detail:"high"}
        ]
      }],
      text: {format:{type:"json_object"}}
    });

    const raw = completion.output_text;
    if (!raw) throw new Error("The AI returned an empty response.");
    let draft;
    try {
      draft = JSON.parse(raw);
    } catch {
      throw new Error("The AI response could not be parsed. Please try again.");
    }

    if (!Array.isArray(draft.hooks) || draft.hooks.length < 3 ||
        typeof draft.caption !== "string" || typeof draft.voiceover !== "string" ||
        !Array.isArray(draft.scenes) || draft.scenes.length !== 8) {
      throw new Error("The AI returned an incomplete draft. Please try again.");
    }

    return res.json({draft});
  } catch (error) {
    console.error("Image generation error:", error.message);
    const status = error.status === 401 ? 502 : 500;
    const message = error.status === 401
      ? "The API key was rejected. Check OPENAI_API_KEY in .env."
      : error.status === 429
        ? "AI rate limit or billing limit reached. Check your API account."
        : error.message || "Unable to generate content from this image.";
    return res.status(status).json({error:message});
  }
});

app.listen(port, () => {
  console.log(`SkillForge AI is running at http://localhost:${port}`);
});
