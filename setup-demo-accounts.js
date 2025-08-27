#!/usr/bin/env node

const axios = require("axios");

const API_BASE_URL = "http://localhost:5002/api";

// Demo accounts to create
const demoAccounts = [
  {
    firstName: "Demo",
    lastName: "Student",
    email: "student@demo.noted.ai",
    password: "demo123",
    role: "student",
  },
  {
    firstName: "Demo",
    lastName: "Premium",
    email: "premium@demo.noted.ai",
    password: "demo123",
    role: "premium",
  },
  {
    firstName: "Demo",
    lastName: "Admin",
    email: "admin@demo.noted.ai",
    password: "demo123",
    role: "university",
  },
];

// Create demo accounts
const setupDemoAccounts = async () => {
  console.log("🎯 Setting up Noted.AI Demo Accounts\n");

  for (const account of demoAccounts) {
    try {
      console.log(`Creating ${account.role} account: ${account.email}`);

      const response = await axios.post(`${API_BASE_URL}/auth/register`, {
        firstName: account.firstName,
        lastName: account.lastName,
        email: account.email,
        password: account.password,
      });

      if (response.status === 201) {
        console.log(`✅ ${account.role} account created successfully`);
      }
    } catch (error) {
      if (error.response?.status === 409) {
        console.log(`⚠️  ${account.role} account already exists`);
      } else {
        console.log(
          `❌ Failed to create ${account.role} account:`,
          error.response?.data?.error || error.message
        );
      }
    }
  }

  console.log("\n🎉 Demo accounts setup complete!");
  console.log("\n📋 Demo Credentials:");
  console.log("┌─────────────────────────────────────────┐");
  console.log("│ Email: student@demo.noted.ai            │");
  console.log("│ Password: demo123                       │");
  console.log("│                                         │");
  console.log("│ Email: premium@demo.noted.ai            │");
  console.log("│ Password: demo123                       │");
  console.log("│                                         │");
  console.log("│ Email: admin@demo.noted.ai              │");
  console.log("│ Password: demo123                       │");
  console.log("└─────────────────────────────────────────┘");

  console.log("\n🌐 Visit http://localhost:3000 to test the demo features!");
};

// Run the setup
setupDemoAccounts().catch(console.error);
