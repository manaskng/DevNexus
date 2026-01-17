import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { protect } from "../middlewares/auth.js"; 

const router = express.Router();


const PRIMARY_MODEL = "gemini-2.5-flash"; 
const BACKUP_MODEL = "gemini-2.0-flash";

router.post("/process", protect, async (req, res) => {
  const { code, action, targetLanguage } = req.body;

  if (!process.env.GEMINI_API_KEY) {
    return res.status(503).json({ message: "AI Service initialization failed." });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    let prompt = "";
    switch (action) {
      case "explain":
        prompt = `You are a Senior Principal Engineer. Explain this code technically:\n\n${code}`;
        break;
      case "refactor":
        prompt = `You are a Clean Code Architect. Refactor this code for enterprise scalability:\n\n${code}`;
        break;
      case "convert":
        prompt = `Convert this code to ${targetLanguage || "Python"}:\n\n${code}`;
        break;
      default:
        return res.status(400).json({ message: "Unknown directive." });
    }

    let text = "";
    
    try {
      console.log(` Attempting AI with ${PRIMARY_MODEL}...`);
      const model = genAI.getGenerativeModel({ model: PRIMARY_MODEL });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      text = response.text();
      
    } catch (primaryError) {
      console.warn(`⚠️ ${PRIMARY_MODEL} failed. Switching to ${BACKUP_MODEL}...`);
      console.warn(`Error: ${primaryError.message}`);

      try {
        const fallbackModel = genAI.getGenerativeModel({ model: BACKUP_MODEL });
        const result = await fallbackModel.generateContent(prompt);
        const response = await result.response;
        text = response.text();
      } catch (backupError) {
        throw new Error(`All models failed. Primary: ${primaryError.message}`);
      }
    }

    res.json({ result: text });

  } catch (error) {
    console.error("--- GEMINI AI CRITICAL FAILURE ---");
    console.error(error); 
    res.status(500).json({ message: "Neural Engine failed to process request." });
  }
});

export default router;