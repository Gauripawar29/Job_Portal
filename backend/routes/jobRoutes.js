const express = require("express");
const router = express.Router();
const Job = require("../models/Job");
const Application = require("../models/Application");

/* ===============================
   STUDENT / EMPLOYER – GET ALL JOBS + COUNT
================================ */
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find({ status: "active" }).sort({ createdAt: -1 });

    const jobsWithCount = await Promise.all(
      jobs.map(async (job) => {
        const count = await Application.countDocuments({ jobId: job._id });
        return { ...job.toObject(), applicantsCount: count };
      })
    );

    res.json(jobsWithCount);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ===============================
   GET SINGLE JOB BY ID
================================ */
router.get("/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: "Job not found" });
    res.json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ===============================
   EMPLOYER – POST JOB
================================ */
router.post("/", async (req, res) => {
  try {
    const job = await Job.create(req.body);
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ===============================
   EMPLOYER – UPDATE JOB
================================ */
router.put("/:id", async (req, res) => {
  try {
    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedJob) {
      return res.status(404).json({ error: "Job not found" });
    }

    res.json(updatedJob);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ===============================
   EMPLOYER – DELETE JOB
================================ */
router.delete("/:id", async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: "Job deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
