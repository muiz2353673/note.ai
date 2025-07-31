const express = require("express");
const OpenAI = require("openai");
const User = require("../models/User");
const Note = require("../models/Note");
const auth = require("../middleware/auth");
const fallbackResponses = require("../utils/aiFallback");

const router = express.Router();

// Initialize OpenAI (only if API key is available)
let openai = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

// Function to get the best available GPT model based on subscription
const getBestModel = (user) => {
  // Check if we have a valid API key
  if (!openai || process.env.OPENAI_API_KEY === "your_openai_api_key_here") {
    return "fallback";
  }

  // Premium users get access to GPT-4 models
  if (
    user.subscription.plan === "university" ||
    user.subscription.plan === "student"
  ) {
    // Try GPT-4o first (most capable and cost-effective)
    return "gpt-4o";
  }

  // Free users get GPT-3.5-turbo
  return "gpt-3.5-turbo";
};

// Middleware to check feature access
const checkFeatureAccess = (feature) => async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.canUseFeature(feature)) {
      return res.status(403).json({
        error: `Feature limit reached for ${feature}. Please upgrade your subscription.`,
        currentUsage:
          user.usage[
            `total${feature.charAt(0).toUpperCase() + feature.slice(1)}`
          ],
        limit: user.subscription.features[feature],
      });
    }

    req.userData = user;
    next();
  } catch (error) {
    res.status(500).json({ error: "Failed to check feature access" });
  }
};

// Summarize notes
router.post(
  "/summarize",
  auth,
  checkFeatureAccess("aiSummaries"),
  async (req, res) => {
    try {
      const { content, noteId, style = "concise" } = req.body;
      const user = req.userData;

      if (!content || content.trim().length < 50) {
        return res
          .status(400)
          .json({ error: "Content must be at least 50 characters long" });
      }

      // Create prompt based on style
      const stylePrompts = {
        concise:
          "Create a concise summary of the following academic content, highlighting the main points and key concepts:",
        detailed:
          "Create a detailed summary of the following academic content, including important details and explanations:",
        bullet:
          "Create a bullet-point summary of the following academic content, organizing key information clearly:",
        study:
          "Create a study-friendly summary of the following academic content, focusing on concepts that are likely to appear on exams:",
      };

      const prompt = `${stylePrompts[style]}\n\n${content}`;

      // Check if OpenAI is available
      if (
        !openai ||
        process.env.OPENAI_API_KEY === "your_openai_api_key_here"
      ) {
        // Use fallback response when OpenAI is not configured
        const fallbackResult = fallbackResponses.summarize(content);
        return res.json({
          summary: fallbackResult.summary,
          model: fallbackResult.model,
          isFallback: fallbackResult.isFallback,
        });
      }

      // Get the best available model for this user
      const model = getBestModel(user);

      // If fallback is needed, use it
      if (model === "fallback") {
        const fallbackResult = fallbackResponses.summarize(content);
        return res.json({
          summary: fallbackResult.summary,
          model: fallbackResult.model,
          isFallback: fallbackResult.isFallback,
        });
      }

      // Call OpenAI API with the best available model
      const completion = await openai.chat.completions.create({
        model: model,
        messages: [
          {
            role: "system",
            content:
              "You are an expert academic assistant. Provide clear, accurate, and well-structured summaries of educational content.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 1000,
        temperature: 0.3,
      });

      const summary = completion.choices[0].message.content;

      // Update note if noteId provided
      if (noteId) {
        const note = await Note.findOne({ _id: noteId, user: user._id });
        if (note) {
          note.aiGenerated.summary = {
            content: summary,
            generatedAt: new Date(),
            model: "gpt-3.5-turbo",
          };
          await note.save();
        }
      }

      // Increment usage
      await user.incrementUsage("aiSummaries");

      res.json({
        summary,
        model: model,
        usage: user.usage.totalSummaries,
        limit: user.subscription.features.aiSummaries,
      });
    } catch (error) {
      console.error("Summarization error:", error);

      // Handle specific OpenAI errors with fallback
      if (error.code === "insufficient_quota" || error.status === 429) {
        console.log("Using fallback AI for summarization");
        const fallbackResult = fallbackResponses.summarize(content);

        // Update note if noteId provided
        if (noteId) {
          const note = await Note.findOne({ _id: noteId, user: user._id });
          if (note) {
            note.aiGenerated.summary = {
              content: fallbackResult.summary,
              generatedAt: new Date(),
              model: "fallback",
            };
            await note.save();
          }
        }

        // Increment usage
        await user.incrementUsage("aiSummaries");

        return res.json({
          summary: fallbackResult.summary,
          model: "fallback",
          usage: user.usage.totalSummaries,
          limit: user.subscription.features.aiSummaries,
          isFallback: true,
        });
      }

      if (error.code === "model_not_found") {
        return res.status(503).json({
          error: "AI model temporarily unavailable. Please try again later.",
        });
      }

      res.status(500).json({ error: "Failed to generate summary" });
    }
  }
);

// Generate flashcards
router.post(
  "/flashcards",
  auth,
  checkFeatureAccess("flashcardGeneration"),
  async (req, res) => {
    try {
      const { content, noteId, count = 5, difficulty = "medium" } = req.body;
      const user = req.userData;

      if (!content || content.trim().length < 100) {
        return res
          .status(400)
          .json({ error: "Content must be at least 100 characters long" });
      }

      const prompt = `Generate ${count} flashcards from the following academic content. 
    Difficulty level: ${difficulty}
    Format each flashcard as JSON with "question" and "answer" fields.
    Make questions challenging but fair, and answers clear and concise.
    
    Content:
    ${content}`;

      // Check if OpenAI is available
      if (
        !openai ||
        process.env.OPENAI_API_KEY === "your_openai_api_key_here"
      ) {
        // Use fallback response when OpenAI is not configured
        const fallbackResult = fallbackResponses.flashcards(content);

        // Increment usage
        await user.incrementUsage("flashcardGeneration");

        return res.json({
          flashcards: fallbackResult.flashcards,
          model: fallbackResult.model,
          usage: user.usage.totalFlashcards,
          limit: user.subscription.features.flashcardGeneration,
          isFallback: fallbackResult.isFallback,
        });
      }

      // Get the best available model for this user
      const model = getBestModel(user);

      // If fallback is needed, use it
      if (model === "fallback") {
        const fallbackResult = fallbackResponses.flashcards(content);

        // Increment usage
        await user.incrementUsage("flashcardGeneration");

        return res.json({
          flashcards: fallbackResult.flashcards,
          model: fallbackResult.model,
          usage: user.usage.totalFlashcards,
          limit: user.subscription.features.flashcardGeneration,
          isFallback: fallbackResult.isFallback,
        });
      }

      const completion = await openai.chat.completions.create({
        model: model,
        messages: [
          {
            role: "system",
            content:
              "You are an expert educator creating study flashcards. Generate clear, educational flashcards in JSON format.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 1500,
        temperature: 0.4,
      });

      let flashcards;
      try {
        const responseText = completion.choices[0].message.content;
        // Extract JSON from response
        const jsonMatch = responseText.match(/\[[\s\S]*\]/);
        flashcards = jsonMatch ? JSON.parse(jsonMatch[0]) : [];

        // Ensure proper format
        flashcards = flashcards.map((card) => ({
          question: card.question || "",
          answer: card.answer || "",
          difficulty,
          category: "General",
        }));
      } catch (parseError) {
        console.error("Flashcard parsing error:", parseError);
        flashcards = [];
      }

      // Update note if noteId provided
      if (noteId) {
        const note = await Note.findOne({ _id: noteId, user: user._id });
        if (note) {
          note.aiGenerated.flashcards = flashcards;
          await note.save();
        }
      }

      // Increment usage
      await user.incrementUsage("flashcardGeneration");

      res.json({
        flashcards,
        model: model,
        usage: user.usage.totalFlashcards,
        limit: user.subscription.features.flashcardGeneration,
      });
    } catch (error) {
      console.error("Flashcard generation error:", error);

      // Handle specific OpenAI errors with fallback
      if (error.code === "insufficient_quota" || error.status === 429) {
        console.log("Using fallback AI for flashcard generation");
        const fallbackResult = fallbackResponses.flashcards(content);

        // Increment usage
        await user.incrementUsage("flashcardGeneration");

        return res.json({
          flashcards: fallbackResult.flashcards,
          model: "fallback",
          usage: user.usage.totalFlashcards,
          limit: user.subscription.features.flashcardGeneration,
          isFallback: true,
        });
      }

      if (error.code === "model_not_found") {
        return res.status(503).json({
          error: "AI model temporarily unavailable. Please try again later.",
        });
      }

      res.status(500).json({ error: "Failed to generate flashcards" });
    }
  }
);

// Assignment help
router.post(
  "/assignment",
  auth,
  checkFeatureAccess("assignmentHelp"),
  async (req, res) => {
    try {
      const { topic, requirements, content, type = "essay" } = req.body;
      const user = req.userData;

      if (!topic || !requirements) {
        return res
          .status(400)
          .json({ error: "Topic and requirements are required" });
      }

      const typePrompts = {
        essay: "Write an academic essay outline and provide writing guidance",
        research: "Help with research paper structure and methodology",
        presentation: "Create presentation outline and speaking points",
        report: "Structure a formal academic report",
      };

      const prompt = `Help with a ${type} assignment on: ${topic}
    
    Requirements: ${requirements}
    
    ${content ? `Existing content: ${content}` : ""}
    
    Please provide:
    1. A structured outline
    2. Key points to include
    3. Writing tips and guidance
    4. Common pitfalls to avoid`;

      // Check if OpenAI is available
      if (
        !openai ||
        process.env.OPENAI_API_KEY === "your_openai_api_key_here"
      ) {
        // Use fallback response when OpenAI is not configured
        const fallbackResult = fallbackResponses.assignment(
          topic,
          requirements
        );

        // Increment usage
        await user.incrementUsage("assignmentHelp");

        return res.json({
          assignmentHelp: fallbackResult.assignmentHelp,
          model: fallbackResult.model,
          usage: user.usage.totalAssignments,
          limit: user.subscription.features.assignmentHelp,
          isFallback: fallbackResult.isFallback,
        });
      }

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are an expert academic writing tutor. Provide helpful guidance for academic assignments while encouraging original thinking.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 2000,
        temperature: 0.3,
      });

      const assignmentHelp = completion.choices[0].message.content;

      // Increment usage
      await user.incrementUsage("assignmentHelp");

      res.json({
        assignmentHelp,
        model: "gpt-3.5-turbo",
        usage: user.usage.totalAssignments,
        limit: user.subscription.features.assignmentHelp,
      });
    } catch (error) {
      console.error("Assignment help error:", error);

      // Handle specific OpenAI errors with fallback
      if (error.code === "insufficient_quota" || error.status === 429) {
        console.log("Using fallback AI for assignment help");
        const fallbackResult = fallbackResponses.assignment(
          topic,
          requirements
        );

        // Increment usage
        await user.incrementUsage("assignmentHelp");

        return res.json({
          assignmentHelp: fallbackResult.assignmentHelp,
          model: "fallback",
          usage: user.usage.totalAssignments,
          limit: user.subscription.features.assignmentHelp,
          isFallback: true,
        });
      }

      if (error.code === "model_not_found") {
        return res.status(503).json({
          error: "AI model temporarily unavailable. Please try again later.",
        });
      }

      res.status(500).json({ error: "Failed to generate assignment help" });
    }
  }
);

// Generate citations
router.post(
  "/cite",
  auth,
  checkFeatureAccess("citations"),
  async (req, res) => {
    try {
      const {
        title,
        authors,
        year,
        journal,
        url,
        doi,
        style = "APA",
      } = req.body;

      if (!title) {
        return res.status(400).json({ error: "Title is required" });
      }

      const styleFormats = {
        APA: "American Psychological Association (APA)",
        MLA: "Modern Language Association (MLA)",
        Chicago: "Chicago Manual of Style",
        Harvard: "Harvard Referencing Style",
      };

      const prompt = `Generate a citation in ${
        styleFormats[style]
      } format for the following source:
    
    Title: ${title}
    ${authors ? `Authors: ${authors}` : ""}
    ${year ? `Year: ${year}` : ""}
    ${journal ? `Journal: ${journal}` : ""}
    ${url ? `URL: ${url}` : ""}
    ${doi ? `DOI: ${doi}` : ""}
    
    Please provide only the formatted citation, no additional text.`;

      // Check if OpenAI is available
      if (
        !openai ||
        process.env.OPENAI_API_KEY === "your_openai_api_key_here"
      ) {
        // Use fallback response when OpenAI is not configured
        const fallbackResult = fallbackResponses.cite(
          title,
          authors,
          year,
          style
        );

        // Increment usage
        await req.userData.incrementUsage("citations");

        return res.json({
          citation: fallbackResult.citation,
          style,
          usage: req.userData.usage.totalCitations,
          limit: req.userData.subscription.features.citations,
          isFallback: fallbackResult.isFallback,
        });
      }

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are an expert in academic citation formats. Generate accurate citations in the requested style.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 300,
        temperature: 0.1,
      });

      const citation = completion.choices[0].message.content.trim();

      // Increment usage
      await req.userData.incrementUsage("citations");

      res.json({
        citation,
        style,
        usage: req.userData.usage.totalCitations,
        limit: req.userData.subscription.features.citations,
      });
    } catch (error) {
      console.error("Citation generation error:", error);
      res.status(500).json({ error: "Failed to generate citation" });
    }
  }
);

// Get usage statistics
router.get("/usage", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      usage: user.usage,
      limits: user.subscription.features,
      plan: user.subscription.plan,
    });
  } catch (error) {
    console.error("Usage stats error:", error);
    res.status(500).json({ error: "Failed to get usage statistics" });
  }
});

module.exports = router;
