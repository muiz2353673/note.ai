const mongoose = require("mongoose");

const universitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    domain: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    contactEmail: {
      type: String,
      required: true,
      lowercase: true,
    },
    contactPerson: {
      name: String,
      title: String,
      phone: String,
    },
    partnership: {
      status: {
        type: String,
        enum: ["pending", "active", "inactive", "expired"],
        default: "pending",
      },
      startDate: Date,
      endDate: Date,
      plan: {
        type: String,
        enum: ["basic", "premium", "enterprise"],
        default: "basic",
      },
      features: {
        customBranding: { type: Boolean, default: false },
        analytics: { type: Boolean, default: false },
        lmsIntegration: { type: Boolean, default: false },
        prioritySupport: { type: Boolean, default: false },
        unlimitedUsers: { type: Boolean, default: false },
      },
      pricing: {
        monthlyRate: Number,
        annualRate: Number,
        currency: {
          type: String,
          default: "USD",
        },
      },
    },
    departments: [
      {
        name: String,
        code: String,
        studentCount: Number,
      },
    ],
    statistics: {
      totalStudents: { type: Number, default: 0 },
      activeUsers: { type: Number, default: 0 },
      totalNotes: { type: Number, default: 0 },
      totalSummaries: { type: Number, default: 0 },
      totalFlashcards: { type: Number, default: 0 },
      averageUsagePerStudent: { type: Number, default: 0 },
    },
    settings: {
      allowedDomains: [String],
      defaultCitationStyle: {
        type: String,
        enum: ["APA", "MLA", "Chicago", "Harvard"],
        default: "APA",
      },
      customBranding: {
        logo: String,
        primaryColor: String,
        secondaryColor: String,
      },
      features: {
        enableSharing: { type: Boolean, default: true },
        enableAnalytics: { type: Boolean, default: true },
        requireVerification: { type: Boolean, default: false },
      },
    },
    integrations: {
      lms: {
        type: {
          type: String,
          enum: ["canvas", "blackboard", "moodle", "schoology", "other"],
          default: "other",
        },
        apiKey: String,
        webhookUrl: String,
        isActive: { type: Boolean, default: false },
      },
      sso: {
        provider: {
          type: String,
          enum: ["saml", "oauth", "none"],
          default: "none",
        },
        config: mongoose.Schema.Types.Mixed,
      },
    },
    billing: {
      stripeCustomerId: String,
      stripeSubscriptionId: String,
      billingCycle: {
        type: String,
        enum: ["monthly", "annual"],
        default: "annual",
      },
      nextBillingDate: Date,
      lastPaymentDate: Date,
      paymentMethod: {
        type: String,
        enum: ["card", "bank_transfer", "invoice"],
        default: "card",
      },
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
universitySchema.index({ domain: 1 });
universitySchema.index({ "partnership.status": 1 });
universitySchema.index({ "partnership.plan": 1 });

// Virtual for partnership status
universitySchema.virtual("isActive").get(function () {
  return (
    this.partnership.status === "active" &&
    (!this.partnership.endDate || this.partnership.endDate > new Date())
  );
});

// Method to update statistics
universitySchema.methods.updateStatistics = function () {
  return this.model("User")
    .aggregate([
      { $match: { "university.domain": this.domain } },
      {
        $group: {
          _id: null,
          totalStudents: { $sum: 1 },
          activeUsers: {
            $sum: {
              $cond: [
                {
                  $gte: [
                    "$usage.lastActive",
                    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                  ],
                },
                1,
                0,
              ],
            },
          },
          totalNotes: { $sum: "$usage.totalNotes" },
          totalSummaries: { $sum: "$usage.totalSummaries" },
          totalFlashcards: { $sum: "$usage.totalFlashcards" },
        },
      },
    ])
    .then((results) => {
      if (results.length > 0) {
        const stats = results[0];
        this.statistics = {
          ...this.statistics,
          totalStudents: stats.totalStudents,
          activeUsers: stats.activeUsers,
          totalNotes: stats.totalNotes,
          totalSummaries: stats.totalSummaries,
          totalFlashcards: stats.totalFlashcards,
          averageUsagePerStudent:
            stats.totalStudents > 0
              ? (stats.totalNotes +
                  stats.totalSummaries +
                  stats.totalFlashcards) /
                stats.totalStudents
              : 0,
        };
        return this.save();
      }
    });
};

// Method to check if domain is allowed
universitySchema.methods.isDomainAllowed = function (email) {
  const domain = email.split("@")[1];
  return (
    this.settings.allowedDomains.includes(domain) || domain === this.domain
  );
};

module.exports = mongoose.model("University", universitySchema);
