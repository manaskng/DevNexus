import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";   

import { connect } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import notesRoutes from "./routes/notes.js";
import taskRoutes from "./routes/taskRoutes.js";
import userProfileRoutes from "./routes/userProfileRoutes.js"; 
import codeSnippetRoutes from "./routes/codeSnippetRoutes.js";
import profileLinkRoutes from "./routes/profileLinkRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";

// ES Module equivalent of __filename and __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Enable CORS
app.use(cors({
  origin: [
    "http://localhost:5173",               
    "https://my-nano-notesf.vercel.app"     
  ],
  credentials: true
}));

// DB Connection
connect();

// Routes
app.use("/api/users", authRoutes);
app.use("/api/notes", notesRoutes);
app.use("/api/tasks", taskRoutes); 
app.use("/api/snippets", codeSnippetRoutes); 
app.use("/api/profiles", profileLinkRoutes);
app.use("/api/user-profile", userProfileRoutes); 
app.use("/api/search", searchRoutes);
app.get("/ping", (req, res) => {
  res.status(200).send("Server Ok");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server connected at port: ${PORT}`);
});
