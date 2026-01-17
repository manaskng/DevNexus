import dotenv from "dotenv";
dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

async function getModels() {
  if (!API_KEY) {
    console.error("❌ Error: GEMINI_API_KEY is missing in .env");
    return;
  }

  console.log("🔍 Querying Google for available models...");
  
  try {
    // We use the direct REST API to bypass any SDK version issues
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
    const data = await response.json();

    if (data.error) {
      console.error("❌ API Error:", data.error.message);
      return;
    }

    if (!data.models) {
      console.log("⚠️ No models found. Your API Key might be invalid or has no API enabled.");
      return;
    }

    console.log("\n✅ AVAILABLE MODELS FOR YOUR KEY:");
    console.log("-----------------------------------");
    
    // Filter for models that support 'generateContent'
    const chatModels = data.models.filter(m => m.supportedGenerationMethods.includes("generateContent"));
    
    chatModels.forEach(model => {
      console.log(`Model Name: ${model.name.replace("models/", "")}`);
    });
    
    console.log("-----------------------------------");
    console.log("👉 Please pick one of the names above for your aiRoutes.js file.");

  } catch (error) {
    console.error("❌ Network Error:", error.message);
  }
}

getModels();