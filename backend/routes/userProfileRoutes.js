import express from "express";
import UserProfile from "../models/UserProfile.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

// GET Profile
router.get("/", protect, async (req, res) => {
    try {
        let profile = await UserProfile.findOne({ user: req.user._id });
        if (!profile) {
            profile = await UserProfile.create({ user: req.user._id });
        }
        res.json(profile);
    } catch (error) {
        console.error("GET PROFILE ERROR:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

// UPDATE Profile (The Fix)
router.put("/", protect, async (req, res) => {
    try {
        const { 
            fullName, headline, about, location, email, 
            linkedinProfile, portfolioUrl, githubUsername, leetcodeUsername,
            skills, achievements, projects, resumes 
        } = req.body;

        console.log("SERVER RECEIVED UPDATE:", req.body); // DEBUG LOG

        const profile = await UserProfile.findOneAndUpdate(
            { user: req.user._id },
            { 
                $set: { // $set forces replacement of these fields
                    fullName, headline, about, location, email,
                    linkedinProfile, portfolioUrl, githubUsername, leetcodeUsername,
                    skills, achievements, projects, resumes
                }
            },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );
        
        res.json(profile);
    } catch (error) {
        console.error("UPDATE PROFILE ERROR:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

export default router;