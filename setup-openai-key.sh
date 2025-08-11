#!/bin/bash

# Setup OpenAI API Key Script
echo "🔧 Setting up OpenAI API Key for AI Features"

# Check if OpenAI key is already set
if grep -q "sk-" server/.env; then
    echo "✅ OpenAI API key already configured in server/.env"
    echo "Current key: $(grep "OPENAI_API_KEY" server/.env | cut -d'=' -f2 | cut -c1-10)..."
else
    echo "⚠️  No OpenAI API key found in server/.env"
fi

echo ""
echo "📝 To set up your OpenAI API key:"
echo ""
echo "1. Go to https://platform.openai.com/api-keys"
echo "2. Create a new API key"
echo "3. Copy the key (starts with 'sk-')"
echo "4. Update server/.env with:"
echo "   OPENAI_API_KEY=sk-your-actual-key-here"
echo ""
echo "🔑 Example:"
echo "   OPENAI_API_KEY=sk-1234567890abcdef1234567890abcdef1234567890abcdef"
echo ""
echo "⚠️  Important:"
echo "   - Keep your API key secret"
echo "   - Never commit it to git"
echo "   - The key is already in .gitignore"
echo ""
echo "🚀 After setting the key, restart your server:"
echo "   npm run dev"
echo ""
echo "✅ AI features will then work with real OpenAI integration!"
