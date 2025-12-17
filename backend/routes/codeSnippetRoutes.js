import express from "express";
import CodeSnippet from "../models/CodeSnippet.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

// GET all snippets
router.get("/", protect, async (req, res) => {
    try {
        const snippets = await CodeSnippet.find({ user: req.user._id })
            .sort({ isFavorite: -1, createdAt: -1 });
        res.json(snippets);
    } catch (error) {
        console.error("GET SNIPPETS ERROR:", error); // <--- Added Log
        res.status(500).json({ message: "Server Error" });
    }
});

// CREATE a snippet
router.post("/", protect, async (req, res) => {
    try {
        // Log what we received to ensure data is coming through
        console.log("Received Snippet Data:", req.body); 

        const { title, code, language, tags, timeComplexity, spaceComplexity, problemLink } = req.body;
        
        const snippet = await CodeSnippet.create({
            user: req.user._id,
            title,
            code,
            language,
            tags, // Mongoose expects an Array here (e.g., ["DP", "Hard"])
            timeComplexity,
            spaceComplexity,
            problemLink
        });
        res.status(201).json(snippet);
    } catch (error) {
        console.error("CREATE SNIPPET ERROR:", error); // <--- Added Log
        // Send the specific error message to the frontend for easier debugging
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// UPDATE a snippet
router.put("/:id", protect, async (req, res) => {
    try {
        const snippet = await CodeSnippet.findById(req.params.id);

        if (!snippet || snippet.user.toString() !== req.user._id.toString()) {
            return res.status(404).json({ message: "Snippet not found" });
        }

        Object.assign(snippet, req.body);
        
        const updatedSnippet = await snippet.save();
        res.json(updatedSnippet);
    } catch (error) {
        console.error("UPDATE SNIPPET ERROR:", error); // <--- Added Log
        res.status(500).json({ message: "Server Error" });
    }
});

// DELETE a snippet
router.delete("/:id", protect, async (req, res) => {
    try {
        const snippet = await CodeSnippet.findById(req.params.id);
        if (!snippet || snippet.user.toString() !== req.user._id.toString()) {
            return res.status(404).json({ message: "Snippet not found" });
        }
        await snippet.deleteOne();
        res.json({ message: "Snippet removed" });
    } catch (error) {
        console.error("DELETE SNIPPET ERROR:", error); // <--- Added Log
        res.status(500).json({ message: "Server Error" });
    }
});

export default router;