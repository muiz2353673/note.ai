const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["student", "teacher", "admin"],
      default: "student",
    },
    subscription: {
      plan: {
        type: String,
        enum: ["free", "student", "university"],
        default: "free",
      },
      status: {
        type: String,
        enum: [
          "active",
          "inactive",
          "cancelled",
          "incomplete",
          "past_due",
          "trialing",
        ],
        default: "active",
      },
      stripeCustomerId: String,
      stripeSubscriptionId: String,
      currentPeriodEnd: Date,
      features: {
        aiSummaries: { type: Number, default: 5 }, // Free tier limit
        flashcardGeneration: { type: Number, default: 3 },
        assignmentHelp: { type: Number, default: 2 },
        citations: { type: Number, default: 10 },
      },
    },
    university: {
      name: String,
      domain: String,
      studentId: String,
      department: String,
      year: Number,
    },
    preferences: {
      citationStyle: {
        type: String,
        enum: ["APA", "MLA", "Chicago", "Harvard"],
        default: "APA",
      },
      language: {
        type: String,
        default: "en",
      },
      theme: {
        type: String,
        enum: ["light", "dark", "auto"],
        default: "auto",
      },
    },
    usage: {
      totalNotes: { type: Number, default: 0 },
      totalSummaries: { type: Number, default: 0 },
      totalFlashcards: { type: Number, default: 0 },
      totalAssignments: { type: Number, default: 0 },
      totalCitations: { type: Number, default: 0 },
      lastActive: { type: Date, default: Date.now },
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Get full name
userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Check if user has feature access
userSchema.methods.canUseFeature = function (feature) {
  // University plan has unlimited access
  if (this.subscription.plan === "university") return true;

  // Student and free plans have limits
  const featureLimits = this.subscription.features[feature];

  // Map feature names to usage keys
  const featureToUsageMap = {
    aiSummaries: "totalSummaries",
    flashcardGeneration: "totalFlashcards",
    assignmentHelp: "totalAssignments",
    citations: "totalCitations",
  };

  const usageKey =
    featureToUsageMap[feature] ||
    `total${feature.charAt(0).toUpperCase() + feature.slice(1)}`;
  const currentUsage = this.usage[usageKey] || 0;

  // Check if user has reached their limit
  return currentUsage < featureLimits;
};

// Increment usage
userSchema.methods.incrementUsage = function (feature) {
  // Map feature names to usage keys
  const featureToUsageMap = {
    aiSummaries: "totalSummaries",
    flashcardGeneration: "totalFlashcards",
    assignmentHelp: "totalAssignments",
    citations: "totalCitations",
  };

  const usageKey =
    featureToUsageMap[feature] ||
    `total${feature.charAt(0).toUpperCase() + feature.slice(1)}`;
  this.usage[usageKey] = (this.usage[usageKey] || 0) + 1;
  this.usage.lastActive = new Date();
  return this.save();
};

module.exports = mongoose.model("User", userSchema);
