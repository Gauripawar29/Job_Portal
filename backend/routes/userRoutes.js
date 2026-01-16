const express = require("express");
const router = express.Router();
const User = require("../models/User");
const multer = require("multer");
const path = require("path");

// ===== Multer storage setup =====
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"), // upload folder
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)), // unique filename
});
const upload = multer({ storage });

// ===== Upload Resume =====
router.post("/uploadResume/:userId", upload.single("resume"), async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.resume = { filename: req.file.originalname, filepath: req.file.path };
    await user.save();
    res.json(user.resume);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== Upload Document =====
router.post("/uploadDocument/:userId", upload.single("document"), async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.document = { filename: req.file.originalname, filepath: req.file.path };
    await user.save();
    res.json(user.document);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== Upload Profile Photo =====
router.post("/uploadPhoto/:userId", upload.single("photo"), async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.photo = req.file.path;
    await user.save();
    res.json({ photo: user.photo });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== Get Profile =====
router.get("/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
