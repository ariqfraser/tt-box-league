#!/bin/bash

# Quick Start: Run Firebase Emulators for Development & Testing
# This script sets up and starts all necessary Firebase emulators

set -e

echo "🚀 Starting Firebase Emulators for tt-box-league..."
echo ""

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Install it with: npm install -g firebase-tools"
    exit 1
fi

# Check if functions are built
if [ ! -d "functions/lib" ]; then
    echo "📦 Building Cloud Functions..."
    cd functions
    npm run build
    cd ..
fi

# Set environment for local development
export FIREBASE_EMULATOR_HOST=localhost:8081

echo ""
echo "📋 Emulator Configuration:"
echo "  - Auth Emulator:      http://localhost:9099"
echo "  - Firestore Emulator: localhost:8083"
echo "  - Functions Emulator: localhost:5001"
echo "  - Emulator UI:        http://localhost:4000"
echo ""

# Set verification code for testing
export FIREBASE_FUNCTIONS_CONFIG='{"registration":{"code":"test-code-123"}}'
echo "✅ Verification code set to: test-code-123"
echo ""

echo "Starting emulators..."
firebase emulators:start --only functions,firestore,auth,ui

# Note: Functions emulator will automatically pick up code from functions/lib
# which is built by npm run build in the functions directory
