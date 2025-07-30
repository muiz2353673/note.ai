#!/bin/bash

# Noted.AI Production Deployment Script
# This script sets up the production environment and deploys the application

set -e  # Exit on any error

echo "🚀 Starting Noted.AI Production Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

# Check if .env file exists
if [ ! -f "server/.env" ]; then
    print_warning "No .env file found. Please create one based on production.env.example"
    exit 1
fi

print_status "Installing dependencies..."
npm run install-all

print_status "Building frontend for production..."
cd client && npm run build && cd ..

print_status "Creating logs directory..."
mkdir -p server/logs

print_status "Setting up production environment..."
export NODE_ENV=production

print_status "Starting production server..."
npm start

print_status "✅ Deployment completed successfully!"
print_status "Your app should now be running on port 5002"
print_status "Frontend build is available in client/build/" 