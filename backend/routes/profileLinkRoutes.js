import express from "express";
import ProfileLink from "../models/ProfileLink.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

// GET all profiles (Grouped by favorite first)
router.get("/", protect, async (req, res) => {
    try {
        const profiles = await ProfileLink.find({ user: req.user._id })
            .sort({ isFavorite: -1, platform: 1 });
        res.json(profiles);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// CREATE a new profile card
router.post("/", protect, async (req, res) => {
    try {
        const { platform, username, url, category, description, badgeUrl } = req.body;
        
        // Basic validation
        if (!platform || !url) {
            return res.status(400).json({ message: "Platform and URL are required" });
        }

        const profile = await ProfileLink.create({
            user: req.user._id,
            platform,
            username,
            url,
            category: category || "Other",
            description,
            badgeUrl
        });

        res.status(201).json(profile);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// UPDATE a profile
router.put("/:id", protect, async (req, res) => {
    try {
        const profile = await ProfileLink.findById(req.params.id);

        if (!profile || profile.user.toString() !== req.user._id.toString()) {
            return res.status(404).json({ message: "Profile not found" });
        }

        // Update all allowed fields
        Object.assign(profile, req.body);
        
        const updatedProfile = await profile.save();
        res.json(updatedProfile);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// DELETE a profile
router.delete("/:id", protect, async (req, res) => {
    try {
        const profile = await ProfileLink.findById(req.params.id);

        if (!profile || profile.user.toString() !== req.user._id.toString()) {
            return res.status(404).json({ message: "Profile not found" });
        }

        await profile.deleteOne();
        res.json({ message: "Profile removed" });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

export default router;