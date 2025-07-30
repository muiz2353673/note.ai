const express = require("express");
const Note = require("../models/Note");
const auth = require("../middleware/auth");

const router = express.Router();

// Get all notes for user
router.get("/", auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, subject, tags, search } = req.query;

    const query = { user: req.user.userId, isArchived: false };

    if (subject) query.subject = subject;
    if (tags) query.tags = { $in: tags.split(",") };
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }

    const notes = await Note.find(query)
      .sort({ updatedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate("sharedWith.user", "firstName lastName email");

    const total = await Note.countDocuments(query);

    res.json({
      notes,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    console.error("Get notes error:", error);
    res.status(500).json({ error: "Failed to fetch notes" });
  }
});

// Get single note
router.get("/:id", auth, async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      $or: [{ user: req.user.userId }, { "sharedWith.user": req.user.userId }],
    }).populate("sharedWith.user", "firstName lastName email");

    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.json({ note });
  } catch (error) {
    console.error("Get note error:", error);
    res.status(500).json({ error: "Failed to fetch note" });
  }
});

// Create new note
router.post("/", auth, async (req, res) => {
  try {
    const { title, content, subject, tags, visibility } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required" });
    }

    const note = new Note({
      user: req.user.userId,
      title,
      content,
      subject,
      tags: tags || [],
      visibility: visibility || "private",
    });

    await note.save();

    // Update user usage
    const User = require("../models/User");
    await User.findByIdAndUpdate(req.user.userId, {
      $inc: { "usage.totalNotes": 1 },
    });

    res.status(201).json({ note });
  } catch (error) {
    console.error("Create note error:", error);
    res.status(500).json({ error: "Failed to create note" });
  }
});

// Update note
router.put("/:id", auth, async (req, res) => {
  try {
    const { title, content, subject, tags, visibility } = req.body;

    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    if (title) note.title = title;
    if (content) note.content = content;
    if (subject !== undefined) note.subject = subject;
    if (tags) note.tags = tags;
    if (visibility) note.visibility = visibility;

    await note.save();

    res.json({ note });
  } catch (error) {
    console.error("Update note error:", error);
    res.status(500).json({ error: "Failed to update note" });
  }
});

// Delete note
router.delete("/:id", auth, async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("Delete note error:", error);
    res.status(500).json({ error: "Failed to delete note" });
  }
});

// Archive note
router.patch("/:id/archive", auth, async (req, res) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      { isArchived: true },
      { new: true }
    );

    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.json({ note });
  } catch (error) {
    console.error("Archive note error:", error);
    res.status(500).json({ error: "Failed to archive note" });
  }
});

// Share note
router.post("/:id/share", auth, async (req, res) => {
  try {
    const { email, permission = "view" } = req.body;

    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    // Find user to share with
    const User = require("../models/User");
    const userToShare = await User.findOne({ email });

    if (!userToShare) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if already shared
    const alreadyShared = note.sharedWith.find(
      (share) => share.user.toString() === userToShare._id.toString()
    );

    if (alreadyShared) {
      return res
        .status(400)
        .json({ error: "Note already shared with this user" });
    }

    note.sharedWith.push({
      user: userToShare._id,
      permission,
    });

    await note.save();

    res.json({ message: "Note shared successfully" });
  } catch (error) {
    console.error("Share note error:", error);
    res.status(500).json({ error: "Failed to share note" });
  }
});

// Get shared notes
router.get("/shared/with-me", auth, async (req, res) => {
  try {
    const notes = await Note.find({
      "sharedWith.user": req.user.userId,
    }).populate("user", "firstName lastName email");

    res.json({ notes });
  } catch (error) {
    console.error("Get shared notes error:", error);
    res.status(500).json({ error: "Failed to fetch shared notes" });
  }
});

// Get note statistics
router.get("/stats", auth, async (req, res) => {
  try {
    const stats = await Note.aggregate([
      { $match: { user: req.user.userId } },
      {
        $group: {
          _id: null,
          totalNotes: { $sum: 1 },
          totalWords: { $sum: "$metadata.wordCount" },
          totalReadingTime: { $sum: "$metadata.readingTime" },
          subjects: { $addToSet: "$subject" },
          tags: { $addToSet: "$tags" },
        },
      },
    ]);

    const result = stats[0] || {
      totalNotes: 0,
      totalWords: 0,
      totalReadingTime: 0,
      subjects: [],
      tags: [],
    };

    res.json({ stats: result });
  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({ error: "Failed to fetch statistics" });
  }
});

module.exports = router;
