const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      trim: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    aiGenerated: {
      summary: {
        content: String,
        generatedAt: Date,
        model: String,
      },
      flashcards: [
        {
          question: String,
          answer: String,
          difficulty: {
            type: String,
            enum: ["easy", "medium", "hard"],
            default: "medium",
          },
          category: String,
        },
      ],
      keyPoints: [String],
      studyGuide: String,
    },
    metadata: {
      wordCount: Number,
      readingTime: Number, // in minutes
      language: {
        type: String,
        default: "en",
      },
      source: {
        type: String,
        enum: ["manual", "upload", "import"],
        default: "manual",
      },
      originalFile: String, // if uploaded from file
    },
    visibility: {
      type: String,
      enum: ["private", "shared", "public"],
      default: "private",
    },
    sharedWith: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        permission: {
          type: String,
          enum: ["view", "edit"],
          default: "view",
        },
      },
    ],
    isArchived: {
      type: Boolean,
      default: false,
    },
    lastStudied: Date,
    studyCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
noteSchema.index({ user: 1, createdAt: -1 });
noteSchema.index({ user: 1, subject: 1 });
noteSchema.index({ tags: 1 });

// Calculate word count and reading time
noteSchema.pre("save", function (next) {
  if (this.isModified("content")) {
    this.metadata.wordCount = this.content.split(/\s+/).length;
    this.metadata.readingTime = Math.ceil(this.metadata.wordCount / 200); // Average reading speed
  }
  next();
});

// Virtual for full content with AI enhancements
noteSchema.virtual("enhancedContent").get(function () {
  let enhanced = this.content;

  if (this.aiGenerated.summary?.content) {
    enhanced += `\n\n--- AI Summary ---\n${this.aiGenerated.summary.content}`;
  }

  if (this.aiGenerated.keyPoints?.length > 0) {
    enhanced += `\n\n--- Key Points ---\n${this.aiGenerated.keyPoints.join(
      "\n• "
    )}`;
  }

  return enhanced;
});

// Method to add flashcard
noteSchema.methods.addFlashcard = function (
  question,
  answer,
  difficulty = "medium",
  category = "General"
) {
  this.aiGenerated.flashcards.push({
    question,
    answer,
    difficulty,
    category,
  });
  return this.save();
};

// Method to update study count
noteSchema.methods.markAsStudied = function () {
  this.lastStudied = new Date();
  this.studyCount += 1;
  return this.save();
};

module.exports = mongoose.model("Note", noteSchema);
