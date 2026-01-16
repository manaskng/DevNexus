import Note from "../models/Note.js";
import express from "express";
const router = express.Router();
import { protect } from './../middlewares/auth.js';
import DOMPurify from 'dompurify'; 
import { JSDOM } from 'jsdom';    

const window = new JSDOM('').window;
const purify = DOMPurify(window);

const sanitizeOptions = {
    USE_PROFILES: { html: true }, 
    ADD_TAGS: [
        'img', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 
        'ul', 'ol', 'li', 'strong', 'em', 'u', 's', 
        'code', 'pre', 'a', 'br', 'div', 'span', 'blockquote'
    ],            
    ADD_ATTR: ['src', 'alt', 'title', 'class', 'href', 'target', 'rel', 'style'] 
};

router.get("/", protect, async (req, res) => {
    try {
        const notes = await Note.find({ createdBy: req.user._id }) 
            .sort({ isPinned: -1, updatedAt: -1 }); 
        return res.json(notes);
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
});

router.post("/", protect, async (req, res) => {
    const { title, description } = req.body;
    try {
        if (!title || !description) {
            return res.status(401).json({ message: "Please fill all the fields" });
        }
        
        const cleanDescription = purify.sanitize(description, sanitizeOptions);
        
        const note = await Note.create({ 
            title, 
            description: cleanDescription, 
            createdBy: req.user._id 
        });
        return res.json(note);
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
});

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
        
        if (description) {
            note.description = purify.sanitize(description, sanitizeOptions);
        }
        
        const updatedNote = await note.save();
        res.json(updatedNote);
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
});

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

router.put("/:id/pin", protect, async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) return res.status(404).json({ message: "Note not found" });
        
        if (note.createdBy.toString() !== req.user._id.toString()) {
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