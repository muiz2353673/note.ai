const express = require("express");
const University = require("../models/University");
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();

// Apply for university partnership
router.post("/apply", async (req, res) => {
  try {
    const {
      name,
      domain,
      contactEmail,
      contactPerson,
      departments,
      estimatedStudents,
    } = req.body;

    // Check if university already exists
    const existingUniversity = await University.findOne({ domain });
    if (existingUniversity) {
      return res.status(400).json({ error: "University already registered" });
    }

    const university = new University({
      name,
      domain,
      contactEmail,
      contactPerson,
      departments: departments || [],
      statistics: {
        totalStudents: estimatedStudents || 0,
      },
    });

    await university.save();

    res.status(201).json({
      message: "Partnership application submitted successfully",
      university: {
        id: university._id,
        name: university.name,
        domain: university.domain,
        partnership: university.partnership,
      },
    });
  } catch (error) {
    console.error("University application error:", error);
    res.status(500).json({ error: "Failed to submit application" });
  }
});

// Get university partnership status (public)
router.get("/status/:domain", async (req, res) => {
  try {
    const university = await University.findOne({ domain: req.params.domain });

    if (!university) {
      return res.status(404).json({ error: "University not found" });
    }

    res.json({
      name: university.name,
      domain: university.domain,
      partnership: {
        status: university.partnership.status,
        plan: university.partnership.plan,
      },
    });
  } catch (error) {
    console.error("Get university status error:", error);
    res.status(500).json({ error: "Failed to get university status" });
  }
});

// Get university dashboard (admin only)
router.get("/dashboard/:id", auth, async (req, res) => {
  try {
    const university = await University.findById(req.params.id);

    if (!university) {
      return res.status(404).json({ error: "University not found" });
    }

    // Check if user is admin or university contact
    const user = await User.findById(req.user.userId);
    if (user.role !== "admin" && user.email !== university.contactEmail) {
      return res.status(403).json({ error: "Access denied" });
    }

    // Update statistics
    await university.updateStatistics();

    res.json({
      university,
      recentUsers: await User.find({ "university.domain": university.domain })
        .sort({ createdAt: -1 })
        .limit(10)
        .select("firstName lastName email createdAt"),
    });
  } catch (error) {
    console.error("Get university dashboard error:", error);
    res.status(500).json({ error: "Failed to get university dashboard" });
  }
});

// Update university settings
router.put("/:id/settings", auth, async (req, res) => {
  try {
    const { allowedDomains, defaultCitationStyle, customBranding, features } =
      req.body;

    const university = await University.findById(req.params.id);

    if (!university) {
      return res.status(404).json({ error: "University not found" });
    }

    // Check if user is admin or university contact
    const user = await User.findById(req.user.userId);
    if (user.role !== "admin" && user.email !== university.contactEmail) {
      return res.status(403).json({ error: "Access denied" });
    }

    // Update settings
    if (allowedDomains) university.settings.allowedDomains = allowedDomains;
    if (defaultCitationStyle)
      university.settings.defaultCitationStyle = defaultCitationStyle;
    if (customBranding) university.settings.customBranding = customBranding;
    if (features)
      university.settings.features = {
        ...university.settings.features,
        ...features,
      };

    await university.save();

    res.json({
      message: "University settings updated successfully",
      settings: university.settings,
    });
  } catch (error) {
    console.error("Update university settings error:", error);
    res.status(500).json({ error: "Failed to update university settings" });
  }
});

// Get university analytics
router.get("/:id/analytics", auth, async (req, res) => {
  try {
    const { period = "30d" } = req.query;

    const university = await University.findById(req.params.id);

    if (!university) {
      return res.status(404).json({ error: "University not found" });
    }

    // Check if user is admin or university contact
    const user = await User.findById(req.user.userId);
    if (user.role !== "admin" && user.email !== university.contactEmail) {
      return res.status(403).json({ error: "Access denied" });
    }

    // Calculate date range
    const now = new Date();
    const daysAgo = period === "7d" ? 7 : period === "30d" ? 30 : 90;
    const startDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

    // Get user analytics
    const userAnalytics = await User.aggregate([
      { $match: { "university.domain": university.domain } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          newUsers: { $sum: 1 },
          activeUsers: {
            $sum: {
              $cond: [{ $gte: ["$usage.lastActive", startDate] }, 1, 0],
            },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Get usage analytics
    const usageAnalytics = await User.aggregate([
      { $match: { "university.domain": university.domain } },
      {
        $group: {
          _id: null,
          totalNotes: { $sum: "$usage.totalNotes" },
          totalSummaries: { $sum: "$usage.totalSummaries" },
          totalFlashcards: { $sum: "$usage.totalFlashcards" },
          totalAssignments: { $sum: "$usage.totalAssignments" },
          averageUsagePerUser: {
            $avg: {
              $add: [
                "$usage.totalNotes",
                "$usage.totalSummaries",
                "$usage.totalFlashcards",
                "$usage.totalAssignments",
              ],
            },
          },
        },
      },
    ]);

    res.json({
      userAnalytics,
      usageAnalytics: usageAnalytics[0] || {},
      period,
    });
  } catch (error) {
    console.error("Get university analytics error:", error);
    res.status(500).json({ error: "Failed to get university analytics" });
  }
});

// Get all universities (admin only)
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (user.role !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    const universities = await University.find()
      .select("name domain contactEmail partnership statistics")
      .sort({ createdAt: -1 });

    res.json({ universities });
  } catch (error) {
    console.error("Get universities error:", error);
    res.status(500).json({ error: "Failed to get universities" });
  }
});

// Update partnership status (admin only)
router.patch("/:id/partnership", auth, async (req, res) => {
  try {
    const { status, plan, startDate, endDate } = req.body;

    const user = await User.findById(req.user.userId);
    if (user.role !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    const university = await University.findById(req.params.id);
    if (!university) {
      return res.status(404).json({ error: "University not found" });
    }

    // Update partnership
    if (status) university.partnership.status = status;
    if (plan) university.partnership.plan = plan;
    if (startDate) university.partnership.startDate = new Date(startDate);
    if (endDate) university.partnership.endDate = new Date(endDate);

    await university.save();

    res.json({
      message: "Partnership status updated successfully",
      partnership: university.partnership,
    });
  } catch (error) {
    console.error("Update partnership error:", error);
    res.status(500).json({ error: "Failed to update partnership status" });
  }
});

// Get university users (admin/university contact only)
router.get("/:id/users", auth, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const university = await University.findById(req.params.id);

    if (!university) {
      return res.status(404).json({ error: "University not found" });
    }

    // Check if user is admin or university contact
    const user = await User.findById(req.user.userId);
    if (user.role !== "admin" && user.email !== university.contactEmail) {
      return res.status(403).json({ error: "Access denied" });
    }

    const users = await User.find({ "university.domain": university.domain })
      .select("firstName lastName email role subscription usage createdAt")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments({
      "university.domain": university.domain,
    });

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    console.error("Get university users error:", error);
    res.status(500).json({ error: "Failed to get university users" });
  }
});

module.exports = router;
