import express from "express";
import axios from "axios";
import { protect } from "../middlewares/auth.js";

const router = express.Router();


const LANGUAGE_MAP = {
  javascript: { language: "javascript", version: "18.15.0" },
  typescript: { language: "typescript", version: "5.0.3" },
  python: { language: "python", version: "3.10.0" },
  java: { language: "java", version: "15.0.2" },
  c: { language: "c", version: "10.2.0" },
  cpp: { language: "c++", version: "10.2.0" },
  go: { language: "go", version: "1.16.2" },
  rust: { language: "rust", version: "1.68.2" },
  php: { language: "php", version: "8.2.3" },
  ruby: { language: "ruby", version: "3.0.1" },
  swift: { language: "swift", version: "5.3.3" },
};
//Piston API for code execution
router.post("/run", protect, async (req, res) => {
  const { code, language } = req.body;

  if (!code) return res.status(400).json({ message: "No code provided" });

  const runtime = LANGUAGE_MAP[language];
  if (!runtime) {
    return res.status(400).json({ message: `Language '${language}' is not supported yet.` });
  }

  try {
    const response = await axios.post("https://emkc.org/api/v2/piston/execute", {
      language: runtime.language,
      version: runtime.version,
      files: [{ content: code }]
    });

    // Piston success response structure
    res.json(response.data);

  } catch (error) {
    console.error("Compiler Error:", error.message);
  
    res.status(500).json({ 
      message: "Sandbox Execution Failed", 
      error: error.response?.data?.message || error.message 
    });
  }
});

export default router;