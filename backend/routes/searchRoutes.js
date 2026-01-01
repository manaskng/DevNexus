import express from "express";
import Note from "../models/Note.js";
import CodeSnippet from "../models/CodeSnippet.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", protect, async (req, res) => {
    const query = req.query.q;
    if (!query || query.length < 1) return res.json({ notes: [], snippets: [] });

    try {
        
        const snippetsPromise = CodeSnippet.aggregate([
            {
                $search: {
                    index: "default",
                    compound: {
                        must: [{
                            text: {
                                query: query,
                                path: { wildcard: "*" }
                            }
                        }],
                        filter: [{
                            equals: {
                                path: "user", 
                                value: req.user._id
                            }
                        }]
                    }
                }
            },
            { $limit: 5 },
            { $project: { title: 1, language: 1, _id: 1 } }
        ]);

        
        let notes = await Note.aggregate([
            {
                $search: {
                    index: "default",
                    compound: {
                        should: [
                            { text: { query: query, path: "title", score: { boost: { value: 3 } } } },
                            { text: { query: query, path: "description" } }
                        ],
                        minimumShouldMatch: 1,
                        filter: [{
                            equals: {
                                path: "createdBy", 
                                value: req.user._id
                            }
                        }]
                    }
                }
            },
            { $limit: 5 },
            { $project: { title: 1, description: 1, _id: 1 } }
        ]);

       
        if (notes.length === 0) {
            console.log("Switching to Regex fallback for Notes...");
            notes = await Note.find({
                createdBy: req.user._id,
                $or: [
                    { title: { $regex: query, $options: "i" } }, 
                    { description: { $regex: query, $options: "i" } }
                ]
            })
            .sort({ updatedAt: -1 })
            .limit(5)
            .select("title description _id");
        }

        const snippets = await snippetsPromise;

        res.json({ notes, snippets });

    } catch (error) {
        console.error("Search Error:", error);
        res.status(500).json({ message: "Search failed" });
    }
});

export default router;