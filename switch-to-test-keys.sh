#!/bin/bash

# Switch to Stripe Test Keys Script
echo "🔧 Switching to Stripe Test Keys for Development"

echo ""
echo "📝 Please enter your Stripe test keys:"
echo ""

# Get test secret key
read -p "Enter your Stripe test SECRET key (sk_test_...): " TEST_SECRET_KEY

# Get test publishable key  
read -p "Enter your Stripe test PUBLISHABLE key (pk_test_...): " TEST_PUBLISHABLE_KEY

echo ""
echo "🔧 Updating environment files..."

# Update server .env
sed -i '' "s/STRIPE_SECRET_KEY=.*/STRIPE_SECRET_KEY=$TEST_SECRET_KEY/" server/.env
sed -i '' "s/STRIPE_PUBLISHABLE_KEY=.*/STRIPE_PUBLISHABLE_KEY=$TEST_PUBLISHABLE_KEY/" server/.env

# Update client .env
sed -i '' "s/REACT_APP_STRIPE_PUBLISHABLE_KEY=.*/REACT_APP_STRIPE_PUBLISHABLE_KEY=$TEST_PUBLISHABLE_KEY/" client/.env

echo "✅ Environment files updated!"
echo ""
echo "🔑 Test Keys Configured:"
echo "   Secret: ${TEST_SECRET_KEY:0:20}..."
echo "   Publishable: ${TEST_PUBLISHABLE_KEY:0:20}..."
echo ""
echo "🚀 Next steps:"
echo "   1. Restart your server: npm run dev"
echo "   2. Test with card: 4242 4242 4242 4242"
echo "   3. Subscription creation should work now!"
echo ""
echo "⚠️  Remember: These are TEST keys for development only!"
