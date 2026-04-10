import express from "express";
import axios from "axios";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

// Language maps for each provider
const PISTON_LANGUAGE_MAP = {
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

// OnlineCompiler.io compiler IDs (from their docs)
const ONLINE_COMPILER_MAP = {
  javascript: "nodejs",
  typescript: "typescript-deno",
  python: "python-3.14",
  java: "openjdk-25",
  c: "gcc-15",
  cpp: "g++-15",
  go: "go-1.26",
  rust: "rust-1.93",
  php: "php-8.5",
  ruby: "ruby-4.0",
};

// --- Provider Functions ---

async function executeWithOnlineCompiler(code, language) {
  const compiler = ONLINE_COMPILER_MAP[language];
  if (!compiler) return null;

  const apiKey = process.env.ONLINE_COMPILER_API_KEY;
  if (!apiKey) return null;

  const response = await axios.post(
    "https://api.onlinecompiler.io/api/run-code-sync/",
    { compiler, code, input: "" },
    { headers: { Authorization: apiKey, "Content-Type": "application/json" }, timeout: 30000 }
  );

  const data = response.data;
  // Normalize to Piston-compatible response shape (frontend expects res.data.run.stdout/stderr)
  return {
    run: {
      stdout: data.output || "",
      stderr: data.error || "",
      code: data.exit_code ?? 0,
      signal: data.signal || null,
    },
  };
}

async function executeWithPiston(code, language) {
  const runtime = PISTON_LANGUAGE_MAP[language];
  if (!runtime) return null;

  const response = await axios.post(
    "https://emkc.org/api/v2/piston/execute",
    { language: runtime.language, version: runtime.version, files: [{ content: code }] },
    { timeout: 30000 }
  );

  return response.data;
}

//Piston API for code execution (with OnlineCompiler.io fallback)
router.post("/run", protect, async (req, res) => {
  const { code, language } = req.body;

  if (!code) return res.status(400).json({ message: "No code provided" });

  const isSupported = PISTON_LANGUAGE_MAP[language] || ONLINE_COMPILER_MAP[language];
  if (!isSupported) {
    return res.status(400).json({ message: `Language '${language}' is not supported yet.` });
  }

  try {
    // Strategy: Try OnlineCompiler.io first (if API key exists), then Piston as fallback
    let result = null;

    // Attempt 1: OnlineCompiler.io (preferred — Piston public API is whitelist-only since Feb 2026)
    try {
      result = await executeWithOnlineCompiler(code, language);
      if (result) return res.json(result);
    } catch (err) {
      console.warn("OnlineCompiler failed, trying Piston fallback:", err.message);
    }

    // Attempt 2: Piston API (fallback)
    try {
      result = await executeWithPiston(code, language);
      if (result) return res.json(result);
    } catch (err) {
      console.warn("Piston API failed:", err.response?.data?.message || err.message);
    }

    // Both failed
    res.status(503).json({
      message: "All execution engines are currently unavailable. Please try again later.",
    });
  } catch (error) {
    console.error("Compiler Error:", error.message);

    res.status(500).json({ 
      message: "Sandbox Execution Failed", 
      error: error.response?.data?.message || error.message 
    });
  }
});

export default router;