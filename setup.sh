#!/bin/bash

echo "🚀 Setting up Noted.AI..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v16 or higher."
    exit 1
fi

# Check if MongoDB is installed
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB is not installed. Please install MongoDB v6.0 or higher."
    echo "   You can download it from: https://www.mongodb.com/try/download/community"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm run install-all

# Create server environment file if it doesn't exist
if [ ! -f "server/.env" ]; then
    echo "🔧 Creating server environment file..."
    cp production.env.example server/.env
    echo "✅ Server environment file created at server/.env"
    echo "⚠️  Please update server/.env with your API keys and configuration"
fi

# Create client environment file if it doesn't exist
if [ ! -f "client/.env" ]; then
    echo "🔧 Creating client environment file..."
    cat > client/.env << EOF
REACT_APP_API_URL=http://localhost:5002/api
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_test_publishable_key
REACT_APP_ENVIRONMENT=development
EOF
    echo "✅ Client environment file created at client/.env"
    echo "⚠️  Please update client/.env with your Stripe publishable key"
fi

# Create logs directory
mkdir -p logs

# Generate JWT secret
echo "🔐 Generating JWT secret..."
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
echo "Generated JWT Secret: $JWT_SECRET"
echo "⚠️  Please add this to your server/.env file as JWT_SECRET"

# Check if MongoDB is running
if pgrep -x "mongod" > /dev/null; then
    echo "✅ MongoDB is running"
else
    echo "⚠️  MongoDB is not running. Please start MongoDB:"
    echo "   brew services start mongodb-community  # macOS with Homebrew"
    echo "   sudo systemctl start mongod            # Linux"
    echo "   mongod                                 # Manual start"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Update server/.env with your API keys:"
echo "   - OPENAI_API_KEY (required for AI features)"
echo "   - STRIPE_SECRET_KEY and STRIPE_PUBLISHABLE_KEY (for payments)"
echo "   - JWT_SECRET (use the generated secret above)"
echo ""
echo "2. Update client/.env with your Stripe publishable key"
echo ""
echo "3. Start the development servers:"
echo "   npm run dev"
echo ""
echo "4. Open http://localhost:3000 in your browser"
echo ""
echo "📚 For detailed setup instructions, see SETUP_GUIDE.md" 