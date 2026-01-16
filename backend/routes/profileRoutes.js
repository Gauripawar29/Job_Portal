const express = require("express");
const router = express.Router();
const User = require("../models/User");
const multer = require("multer");
const path = require("path");

// ===== MULTER CONFIG =====
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// ===== GET PROFILE =====
router.get("/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== UPDATE PROFILE =====
router.put("/:userId", async (req, res) => {
  const { name, role, location, experience, skills, github } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { name, role, location, experience, skills, github },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== UPLOAD PHOTO =====
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

// ===== UPLOAD RESUME =====
router.post("/uploadResume/:userId", upload.single("resume"), async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.resume = {
      filename: req.file.originalname,
      filepath: req.file.path,
    };
    await user.save();
    res.json(user.resume);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== UPLOAD DOCUMENT =====
router.post("/uploadDocument/:userId", upload.single("document"), async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.document = {
      filename: req.file.originalname,
      filepath: req.file.path,
    };
    await user.save();
    res.json(user.document);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
