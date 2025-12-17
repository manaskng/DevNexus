import Note from "../models/Note.js";
import express from "express";
const router = express.Router();
import { protect } from './../middlewares/auth.js';
import DOMPurify from 'dompurify'; 
import { JSDOM } from 'jsdom';    

// Create a sanitizing function instance
const window = new JSDOM('').window;
const purify = DOMPurify(window);

// Get all notes
router.get("/", protect, async (req, res) => {
    try {
        const notes = await Note.find({ createdBy: req.user._id }) 
            .sort({ isPinned: -1, updatedAt: -1 }); 
        return res.json(notes);
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
});

// Create a note
router.post("/", protect, async (req, res) => {
    const { title, description } = req.body;
    try {
        if (!title || !description) {
            return res.status(401).json({ message: "Please fill all the fields" });
        }
        // CHANGED: Sanitize the incoming HTML from the editor
        const cleanDescription = purify.sanitize(description);
        const note = await Note.create({ title, description: cleanDescription, createdBy: req.user._id });
        return res.json(note);
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
});

// Update a note
router.put("/:id", protect, async (req, res) => {
    const { title, description } = req.body;
    try {
        const note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }
        if (note.createdBy.toString() != req.user._id.toString()) {
            return res.status(401).json({ message: "Not authorized" });
        }
        note.title = title || note.title;
        // CHANGED: Sanitize the description if it's being updated
        if (description) {
            note.description = purify.sanitize(description);
        }
        const updatedNote = await note.save();
        res.json(updatedNote);
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
});

// Delete a note
router.delete("/:id", protect, async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }
        if (note.createdBy.toString() != req.user._id.toString()) {
            return res.status(401).json({ message: "Not authorized" });
        }
        await note.deleteOne();
        res.json({ message: "Note deleted" });
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
});

// Pin/unpin a note
router.put("/:id/pin", protect, async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }
        if (note.createdBy.toString() !== req.user.id.toString()) {
            return res.status(401).json({ message: "Not authorized" });
        }
        note.isPinned = !note.isPinned;
        await note.save();
        res.json(note);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

export default router;