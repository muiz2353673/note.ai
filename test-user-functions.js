#!/usr/bin/env node

const axios = require("axios");

const API_BASE_URL = "http://localhost:5002/api";

// Test user data
const testUser = {
  firstName: "Test",
  lastName: "User",
  email: "testuser@example.com",
  password: "password123",
};

let authToken = null;

// Helper function to make authenticated requests
const makeAuthRequest = async (method, endpoint, data = null) => {
  const config = {
    method,
    url: `${API_BASE_URL}${endpoint}`,
    headers: {
      "Content-Type": "application/json",
      ...(authToken && { Authorization: `Bearer ${authToken}` }),
    },
    ...(data && { data }),
  };

  try {
    const response = await axios(config);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || error.message,
      status: error.response?.status,
    };
  }
};

// Test functions
const tests = {
  // Health check
  async healthCheck() {
    console.log("🏥 Testing health check...");
    const result = await makeAuthRequest("GET", "/health");
    if (result.success) {
      console.log("✅ Health check passed");
      return true;
    } else {
      console.log("❌ Health check failed:", result.error);
      return false;
    }
  },

  // User registration
  async registerUser() {
    console.log("👤 Testing user registration...");
    const result = await makeAuthRequest("POST", "/auth/register", testUser);
    if (result.success) {
      console.log("✅ User registered successfully");
      return true;
    } else if (result.error.includes("already exists")) {
      console.log("⚠️  User already exists, proceeding with login");
      return true;
    } else {
      console.log("❌ Registration failed:", result.error);
      return false;
    }
  },

  // User login
  async loginUser() {
    console.log("🔐 Testing user login...");
    const result = await makeAuthRequest("POST", "/auth/login", {
      email: testUser.email,
      password: testUser.password,
    });
    if (result.success && result.data.token) {
      authToken = result.data.token;
      console.log("✅ Login successful");
      return true;
    } else {
      console.log("❌ Login failed:", result.error);
      return false;
    }
  },

  // Create note
  async createNote() {
    console.log("📝 Testing note creation...");
    const noteData = {
      title: "Test Note",
      content: "This is a test note for testing purposes.",
      subject: "Testing",
      tags: ["test", "demo"],
    };
    const result = await makeAuthRequest("POST", "/notes", noteData);
    if (result.success && result.data.note) {
      console.log("✅ Note created successfully");
      return result.data.note._id;
    } else {
      console.log("❌ Note creation failed:", result.error);
      return null;
    }
  },

  // Get notes
  async getNotes() {
    console.log("📚 Testing get notes...");
    const result = await makeAuthRequest("GET", "/notes");
    if (result.success && result.data.notes) {
      console.log(`✅ Retrieved ${result.data.notes.length} notes`);
      return true;
    } else {
      console.log("❌ Get notes failed:", result.error);
      return false;
    }
  },

  // Update note
  async updateNote(noteId) {
    if (!noteId) {
      console.log("⚠️  Skipping note update (no note ID)");
      return false;
    }
    console.log("✏️  Testing note update...");
    const updateData = {
      title: "Updated Test Note",
      content: "This note has been updated for testing.",
      tags: ["test", "demo", "updated"],
    };
    const result = await makeAuthRequest("PUT", `/notes/${noteId}`, updateData);
    if (result.success) {
      console.log("✅ Note updated successfully");
      return true;
    } else {
      console.log("❌ Note update failed:", result.error);
      return false;
    }
  },

  // AI summarization
  async testAISummarization() {
    console.log("🤖 Testing AI summarization...");
    const content =
      "This is a long piece of text that should be summarized by the AI. It contains multiple sentences and should demonstrate the AI summarization feature. The AI should be able to extract the key points and create a concise summary of this content.";
    const result = await makeAuthRequest("POST", "/ai/summarize", {
      content,
      style: "concise",
    });
    if (result.success) {
      console.log("✅ AI summarization working");
      return true;
    } else {
      console.log(
        "⚠️  AI summarization failed (may need OpenAI key):",
        result.error
      );
      return false;
    }
  },

  // Flashcard generation
  async testFlashcardGeneration() {
    console.log("🃏 Testing flashcard generation...");
    const content =
      "Photosynthesis is the process by which plants convert sunlight into energy. The process involves chlorophyll, carbon dioxide, and water. The result is glucose and oxygen.";
    const result = await makeAuthRequest("POST", "/ai/flashcards", {
      content,
      count: 3,
      difficulty: "medium",
    });
    if (result.success) {
      console.log("✅ Flashcard generation working");
      return true;
    } else {
      console.log(
        "⚠️  Flashcard generation failed (may need OpenAI key):",
        result.error
      );
      return false;
    }
  },

  // Citation generation
  async testCitationGeneration() {
    console.log("📖 Testing citation generation...");
    const result = await makeAuthRequest("POST", "/ai/cite", {
      title: "Test Book",
      author: "Test Author",
      year: "2024",
      style: "APA",
    });
    if (result.success) {
      console.log("✅ Citation generation working");
      return true;
    } else {
      console.log(
        "⚠️  Citation generation failed (may need OpenAI key):",
        result.error
      );
      return false;
    }
  },

  // Get subscription status
  async getSubscriptionStatus() {
    console.log("💳 Testing subscription status...");
    const result = await makeAuthRequest("GET", "/subscriptions/status");
    if (result.success) {
      console.log("✅ Subscription status retrieved");
      return true;
    } else {
      console.log("⚠️  Subscription status failed:", result.error);
      return false;
    }
  },

  // Delete note
  async deleteNote(noteId) {
    if (!noteId) {
      console.log("⚠️  Skipping note deletion (no note ID)");
      return false;
    }
    console.log("🗑️  Testing note deletion...");
    const result = await makeAuthRequest("DELETE", `/notes/${noteId}`);
    if (result.success) {
      console.log("✅ Note deleted successfully");
      return true;
    } else {
      console.log("❌ Note deletion failed:", result.error);
      return false;
    }
  },
};

// Main test runner
async function runTests() {
  console.log("🚀 Starting Noted.AI User Function Tests\n");

  const results = {
    healthCheck: false,
    registration: false,
    login: false,
    noteCreation: false,
    noteRetrieval: false,
    noteUpdate: false,
    noteDeletion: false,
    aiSummarization: false,
    flashcardGeneration: false,
    citationGeneration: false,
    subscriptionStatus: false,
  };

  let noteId = null;

  // Run tests in sequence
  results.healthCheck = await tests.healthCheck();
  results.registration = await tests.registerUser();
  results.login = await tests.loginUser();

  if (results.login) {
    results.noteCreation = await tests.createNote().then((id) => {
      noteId = id;
      return !!id;
    });
    results.noteRetrieval = await tests.getNotes();
    results.noteUpdate = await tests.updateNote(noteId);
    results.aiSummarization = await tests.testAISummarization();
    results.flashcardGeneration = await tests.testFlashcardGeneration();
    results.citationGeneration = await tests.testCitationGeneration();
    results.subscriptionStatus = await tests.getSubscriptionStatus();
    results.noteDeletion = await tests.deleteNote(noteId);
  }

  // Summary
  console.log("\n📊 Test Results Summary:");
  console.log("========================");

  const passed = Object.values(results).filter(Boolean).length;
  const total = Object.keys(results).length;

  Object.entries(results).forEach(([test, passed]) => {
    const status = passed ? "✅" : "❌";
    const testName = test
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
    console.log(`${status} ${testName}`);
  });

  console.log(`\n🎯 Overall: ${passed}/${total} tests passed`);

  if (passed === total) {
    console.log("🎉 All tests passed! Your app is ready for launch!");
  } else if (passed >= total - 3) {
    console.log(
      "✅ Most tests passed! Your app is mostly ready (AI features may need API keys)"
    );
  } else {
    console.log(
      "⚠️  Some tests failed. Check the errors above and fix them before launch."
    );
  }

  console.log("\n🌐 Your app is running at: http://localhost:3000");
  console.log("🔧 Backend API at: http://localhost:5002/api");
}

// Run the tests
runTests().catch(console.error);
