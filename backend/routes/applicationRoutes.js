const express = require("express");
const router = express.Router();
const Application = require("../models/Application");
const Job = require("../models/Job");
const User = require("../models/User"); // <-- Use User model

// GET all applications for a student
router.get("/:studentId", async (req, res) => {
    try {
        const apps = await Application.find({ studentId: req.params.studentId }).sort({ createdAt: -1 });
        res.json(apps);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET all applications for a job
router.get("/job/:jobId", async (req, res) => {
    try {
        const apps = await Application.find({ jobId: req.params.jobId }).sort({ createdAt: -1 });
        res.json(apps);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST application (student applies to a job)
router.post("/", async (req, res) => {
    try {
        const { studentId, jobId } = req.body;

        if (!studentId || !jobId)
            return res.status(400).json({ error: "Missing studentId or jobId" });

        // Get job details
        const job = await Job.findById(jobId);
        if (!job) return res.status(404).json({ error: "Job not found" });

        // Get student info from User model
        const student = await User.findById(studentId);
        if (!student) return res.status(404).json({ error: "Student not found" });

        // Create application
        const application = await Application.create({
            studentId,
            jobId,
            jobTitle: job.title,
            company: job.company,
            location: job.location,
            studentName: student.name,     // ✅ FIXED
            resume: student.resume,        // ✅ FIXED
        });

        res.json(application);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
