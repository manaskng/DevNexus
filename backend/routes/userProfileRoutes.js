import express from "express";
import UserProfile from "../models/UserProfile.js";
import User from "../models/User.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

// 1. GET Profile (Private - For Dashboard)
router.get("/", protect, async (req, res) => {
    try {
        // Keeps your field name 'user'
        let profile = await UserProfile.findOne({ user: req.user._id });
        
        if (!profile) {
            // If no profile exists, create an empty one so UI doesn't crash
            profile = await UserProfile.create({ user: req.user._id });
        }
        
        // 👇 The FIX for the Share Button:
        // We append the username (from the logged-in user) to the profile data
        const responseData = { 
            ...profile._doc, 
            username: req.user.username,
            email: req.user.email 
        };
        
        res.json(responseData);
    } catch (error) {
        console.error("GET PROFILE ERROR:", error);
        res.status(500).json({ message: "Server Error" });
    }
});

// 2. UPDATE Profile (Private - Your Working Code)
router.put("/", protect, async (req, res) => {
    try {
        const { 
            fullName, headline, about, location, email, 
            linkedinProfile, portfolioUrl, githubUsername, leetcodeUsername,
            skills, achievements, projects, resumes 
        } = req.body;

        // Uses your robust update logic
        const profile = await UserProfile.findOneAndUpdate(
            { user: req.user._id }, // Keeps field 'user'
            { 
                $set: { 
                    fullName, headline, about, location, email,
                    linkedinProfile, portfolioUrl, githubUsername, leetcodeUsername,
                    skills, achievements, projects, resumes
                }
            },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );
        
        // Append username so frontend updates immediately
        res.json({ ...profile._doc, username: req.user.username });
    } catch (error) {
        console.error("UPDATE PROFILE ERROR:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
});

// 3. 👇 NEW: GET PUBLIC PROFILE BY USERNAME (Public - For Shared Links)
router.get("/public/:username", async (req, res) => {
    try {
        // A. Find the User ID from the username
        const user = await User.findOne({ username: req.params.username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // B. Find the Profile using that ID (using your field 'user')
        const profile = await UserProfile.findOne({ user: user._id });
        
        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        // Return profile data combined with user info
        res.json({ 
            ...profile._doc, 
            username: user.username, 
            email: user.email 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

export default router;