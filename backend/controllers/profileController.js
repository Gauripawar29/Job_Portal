const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const User = require("../models/User");

// ================= MULTER =================
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// ================= GET PROFILE =================
router.get("/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ================= UPDATE PROFILE =================
router.put("/:userId", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      req.body,
      { new: true }
    ).select("-password");

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ================= UPLOAD PHOTO =================
router.post(
  "/uploadPhoto/:userId",
  upload.single("photo"),
  async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(
        req.params.userId,
        { photo: req.file.path },
        { new: true }
      );
      res.json({ photo: user.photo });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// ================= UPLOAD RESUME =================
router.post(
  "/uploadResume/:userId",
  upload.single("resume"),
  async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(
        req.params.userId,
        {
          resume: {
            filename: req.file.originalname,
            filepath: req.file.path,
          },
        },
        { new: true }
      );
      res.json(user.resume);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// ================= UPLOAD DOCUMENT =================
router.post(
  "/uploadDocument/:userId",
  upload.single("document"),
  async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(
        req.params.userId,
        {
          document: {
            filename: req.file.originalname,
            filepath: req.file.path,
          },
        },
        { new: true }
      );
      res.json(user.document);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

module.exports = router;
