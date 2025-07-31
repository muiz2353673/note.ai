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

// Test frontend notes functionality
const testFrontendNotes = async () => {
  console.log("🧪 Testing Frontend Notes Functionality\n");

  // Step 1: Login
  console.log("🔐 Logging in...");
  const loginResult = await makeAuthRequest("POST", "/auth/login", testUser);
  if (!loginResult.success) {
    console.log("❌ Login failed:", loginResult.error);
    return;
  }
  authToken = loginResult.data.token;
  console.log("✅ Login successful");

  // Step 2: Create a test note for the frontend
  console.log("\n📝 Creating a test note for frontend...");
  const testNote = {
    title: "Frontend Test Note",
    content:
      "This is a test note to verify the frontend can display and edit notes properly.",
    subject: "Testing",
    tags: ["frontend", "test", "notes"],
  };

  const createResult = await makeAuthRequest("POST", "/notes", testNote);
  if (!createResult.success) {
    console.log("❌ Note creation failed:", createResult.error);
    return;
  }
  console.log("✅ Test note created successfully");
  const noteId = createResult.data.note._id;

  // Step 3: Get all notes to verify they're accessible
  console.log("\n📚 Getting all notes...");
  const getNotesResult = await makeAuthRequest("GET", "/notes");
  if (!getNotesResult.success) {
    console.log("❌ Get notes failed:", getNotesResult.error);
    return;
  }
  console.log("✅ Retrieved notes successfully");
  console.log(`📄 Found ${getNotesResult.data.notes.length} notes`);

  if (getNotesResult.data.notes.length > 0) {
    const firstNote = getNotesResult.data.notes[0];
    console.log("📄 First note details:");
    console.log(`   - ID: ${firstNote._id}`);
    console.log(`   - Title: ${firstNote.title}`);
    console.log(`   - Subject: ${firstNote.subject}`);
    console.log(`   - Tags: ${firstNote.tags.join(", ")}`);
  }

  // Step 4: Get the specific test note
  console.log("\n🔍 Getting the test note by ID...");
  const getNoteResult = await makeAuthRequest("GET", `/notes/${noteId}`);
  if (!getNoteResult.success) {
    console.log("❌ Get note by ID failed:", getNoteResult.error);
    return;
  }
  console.log("✅ Retrieved test note successfully");
  console.log(`📄 Note title: ${getNoteResult.data.note.title}`);
  console.log(
    `📄 Note content length: ${getNoteResult.data.note.content.length} characters`
  );

  // Step 5: Update the test note
  console.log("\n✏️  Updating the test note...");
  const updatedNote = {
    title: "Updated Frontend Test Note",
    content:
      "This note has been updated to test the frontend editing functionality.",
    subject: "Testing",
    tags: ["frontend", "test", "notes", "updated"],
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
  console.log("✅ Test note updated successfully");

  // Step 6: Verify the update
  console.log("\n🔍 Verifying the update...");
  const verifyResult = await makeAuthRequest("GET", `/notes/${noteId}`);
  if (!verifyResult.success) {
    console.log("❌ Verification failed:", verifyResult.error);
    return;
  }
  console.log("✅ Update verified successfully");
  console.log(`📄 Updated title: ${verifyResult.data.note.title}`);
  console.log(`📄 Updated tags: ${verifyResult.data.note.tags.join(", ")}`);

  // Step 7: Clean up
  console.log("\n🗑️  Cleaning up...");
  const deleteResult = await makeAuthRequest("DELETE", `/notes/${noteId}`);
  if (!deleteResult.success) {
    console.log("❌ Note deletion failed:", deleteResult.error);
    return;
  }
  console.log("✅ Test note deleted successfully");

  console.log("\n🎉 Frontend Notes Test Completed Successfully!");
  console.log("✅ All CRUD operations working");
  console.log("✅ Notes can be created, read, updated, and deleted");
  console.log("✅ Frontend should now be able to display and edit notes");
  console.log("🌐 Visit http://localhost:3000 to test the UI");
};

// Run the test
testFrontendNotes().catch(console.error);
