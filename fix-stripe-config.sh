#!/bin/bash

# Fix Stripe Configuration Script
echo "🔧 Fixing Stripe Configuration Issues..."

# Update server .env file
echo "📝 Updating server/.env..."
cat > server/.env << 'EOF'
JWT_SECRET=noted_ai_jwt_secret_key_2024_development_environment

# Server Configuration
PORT=5002
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb://localhost:27017/noted-ai

# OpenAI
OPENAI_API_KEY=your_openai_api_key_here

# Stripe (Live Keys - Production Ready)
STRIPE_SECRET_KEY=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
STRIPE_PUBLISHABLE_KEY=pk_live_51Nyu4fCPlM8I9HetTuBHSE1IGymkPpQKFx4uFyCp7PqizBQU2ARWs3hvbgEuGEsrA1kPye2JXmg8jXeJZhSNulYZ00d3kF4D8S
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
STRIPE_STUDENT_PRICE_ID=price_1RqSqDCPlM8I9HetZTiXYnYB
STRIPE_UNIVERSITY_PRICE_ID=price_1RqSqNCPlM8I9Het1fFxdyYk

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
EOF

# Update client .env file
echo "📝 Updating client/.env..."
cat > client/.env << 'EOF'
REACT_APP_API_URL=http://localhost:5002/api
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_51Nyu4fCPlM8I9HetTuBHSE1IGymkPpQKFx4uFyCp7PqizBQU2ARWs3hvbgEuGEsrA1kPye2JXmg8jXeJZhSNulYZ00d3kF4D8S
REACT_APP_ENVIRONMENT=development
EOF

echo "✅ Stripe configuration updated!"
echo ""
echo "🔑 Key Changes Made:"
echo "   - Server and client now use matching LIVE keys"
echo "   - Updated to real Stripe price IDs"
echo "   - Fixed key mismatch issue"
echo ""
echo "⚠️  IMPORTANT: You still need to:"
echo "   1. Set up Stripe webhook endpoint"
echo "   2. Get the webhook secret from Stripe dashboard"
echo "   3. Update STRIPE_WEBHOOK_SECRET in server/.env"
echo ""
echo "🚀 To restart with new config:"
echo "   npm run dev"
