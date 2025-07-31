#!/usr/bin/env node

const axios = require("axios");

const API_BASE_URL = "http://localhost:5002/api";

// Test user credentials
const testUser = {
  email: "test@example.com",
  password: "testpassword123",
};

let authToken = null;

// Helper function to make authenticated requests
const makeAuthRequest = async (method, endpoint, data = null) => {
  try {
    const config = {
      method,
      url: `${API_BASE_URL}${endpoint}`,
      headers: {
        "Content-Type": "application/json",
        ...(authToken && { Authorization: `Bearer ${authToken}` }),
      },
      ...(data && { data }),
    };

    const response = await axios(config);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || error.message,
    };
  }
};

// Test note saving functionality
const testNoteSaving = async () => {
  console.log("🧪 Testing Note Saving Functionality\n");

  // Step 1: Login
  console.log("🔐 Logging in...");
  const loginResult = await makeAuthRequest("POST", "/auth/login", testUser);
  if (!loginResult.success) {
    console.log("❌ Login failed:", loginResult.error);
    return;
  }
  authToken = loginResult.data.token;
  console.log("✅ Login successful");

  // Step 2: Create a new note
  console.log("\n📝 Creating a new note...");
  const newNote = {
    title: "Test Note for Saving",
    content:
      "This is a test note to verify the saving functionality works correctly.",
    subject: "Testing",
    tags: ["test", "saving", "frontend"],
  };

  const createResult = await makeAuthRequest("POST", "/notes", newNote);
  if (!createResult.success) {
    console.log("❌ Note creation failed:", createResult.error);
    return;
  }
  console.log("✅ Note created successfully");
  const noteId = createResult.data.note._id;

  // Step 3: Update the note
  console.log("\n✏️  Updating the note...");
  const updatedNote = {
    title: "Updated Test Note",
    content: "This note has been updated to test the update functionality.",
    subject: "Testing",
    tags: ["test", "saving", "frontend", "updated"],
  };

  const updateResult = await makeAuthRequest(
    "PUT",
    `/notes/${noteId}`,
    updatedNote
  );
  if (!updateResult.success) {
    console.log("❌ Note update failed:", updateResult.error);
    return;
  }
  console.log("✅ Note updated successfully");

  // Step 4: Retrieve the note to verify changes
  console.log("\n📚 Retrieving the updated note...");
  const getResult = await makeAuthRequest("GET", `/notes/${noteId}`);
  if (!getResult.success) {
    console.log("❌ Note retrieval failed:", getResult.error);
    return;
  }
  console.log("✅ Note retrieved successfully");
  const retrievedNote = getResult.data.note;
  console.log("📄 Note title:", retrievedNote.title);
  console.log(
    "📄 Note content length:",
    retrievedNote.content.length,
    "characters"
  );
  console.log("📄 Note tags:", retrievedNote.tags.join(", "));

  // Step 5: Clean up - delete the test note
  console.log("\n🗑️  Cleaning up - deleting test note...");
  const deleteResult = await makeAuthRequest("DELETE", `/notes/${noteId}`);
  if (!deleteResult.success) {
    console.log("❌ Note deletion failed:", deleteResult.error);
    return;
  }
  console.log("✅ Test note deleted successfully");

  console.log("\n🎉 Note saving functionality test completed successfully!");
  console.log("✅ Create, Update, Retrieve, and Delete operations all working");
  console.log(
    "🌐 You can now save notes in the frontend at: http://localhost:3000"
  );
};

// Run the test
testNoteSaving().catch(console.error);
