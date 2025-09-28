#!/bin/bash

# Vercel Deployment Helper Script
# Run this script to prepare your project for Vercel deployment

echo "🚀 Highway Delight - Vercel Deployment Helper"
echo "============================================="

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "frontend" ] || [ ! -d "backend" ]; then
    echo "❌ Error: Please run this script from the root of your Highway Delight project"
    exit 1
fi

echo "✅ Project structure verified"

# Build both frontend and backend to check for errors
echo "🔨 Building backend..."
cd backend
npm install
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Backend build failed. Please fix the errors before deploying."
    exit 1
fi
echo "✅ Backend build successful"

echo "🔨 Building frontend..."
cd ../frontend
npm install
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Frontend build failed. Please fix the errors before deploying."
    exit 1
fi
echo "✅ Frontend build successful"

cd ..

echo ""
echo "🎉 Both builds successful! Your project is ready for Vercel deployment."
echo ""
echo "📋 Next Steps:"
echo "1. Push your code to GitHub:"
echo "   git add ."
echo "   git commit -m \"prepare for vercel deployment\""
echo "   git push origin main"
echo ""
echo "2. Deploy Backend:"
echo "   - Go to https://vercel.com/dashboard"
echo "   - Create new project from your GitHub repo"
echo "   - Set Root Directory: backend"
echo "   - Add environment variables (see DEPLOYMENT.md)"
echo ""
echo "3. Deploy Frontend:"
echo "   - Create another project from same GitHub repo" 
echo "   - Set Root Directory: frontend"
echo "   - Add VITE_API_URL with your backend domain"
echo ""
echo "📖 See DEPLOYMENT.md for detailed instructions"
echo "🌟 Happy deploying!"