import express from "express";
import Task from "../models/Task.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", protect, async (req, res) => {
    try {
        // Sort by unfinished first, then by date
        const tasks = await Task.find({ user: req.user._id })
            .sort({ isCompleted: 1, createdAt: -1 });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// CREATE a new task
router.post("/", protect, async (req, res) => {
    try {
        if (!req.body.content) {
            return res.status(400).json({ message: "Content is required" });
        }
        const task = await Task.create({
            user: req.user._id,
            content: req.body.content,
            priority: req.body.priority || 'Medium'
        });
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// UPDATE a task (e.g., mark as completed)
router.put("/:id", protect, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task || task.user.toString() !== req.user._id.toString()) {
            return res.status(404).json({ message: "Task not found" });
        }

        task.content = req.body.content || task.content;
        if (req.body.isCompleted !== undefined) {
            task.isCompleted = req.body.isCompleted;
        }
        if (req.body.priority) {
            task.priority = req.body.priority;
        }

        const updatedTask = await task.save();
        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

// DELETE a task
router.delete("/:id", protect, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task || task.user.toString() !== req.user._id.toString()) {
            return res.status(404).json({ message: "Task not found" });
        }

        await task.deleteOne();
        res.json({ message: "Task removed" });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

export default router;