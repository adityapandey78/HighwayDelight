@echo off
REM Vercel Deployment Helper Script for Windows
REM Run this script to prepare your project for Vercel deployment

echo 🚀 Highway Delight - Vercel Deployment Helper
echo =============================================

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: Please run this script from the root of your Highway Delight project
    exit /b 1
)
if not exist "frontend" (
    echo ❌ Error: Frontend directory not found
    exit /b 1
)
if not exist "backend" (
    echo ❌ Error: Backend directory not found  
    exit /b 1
)

echo ✅ Project structure verified

REM Build backend
echo 🔨 Building backend...
cd backend
call npm install
call npm run build
if %ERRORLEVEL% neq 0 (
    echo ❌ Backend build failed. Please fix the errors before deploying.
    exit /b 1
)
echo ✅ Backend build successful

REM Build frontend
echo 🔨 Building frontend...
cd ..\frontend
call npm install
call npm run build
if %ERRORLEVEL% neq 0 (
    echo ❌ Frontend build failed. Please fix the errors before deploying.
    exit /b 1
)
echo ✅ Frontend build successful

cd ..

echo.
echo 🎉 Both builds successful! Your project is ready for Vercel deployment.
echo.
echo 📋 Next Steps:
echo 1. Push your code to GitHub:
echo    git add .
echo    git commit -m "prepare for vercel deployment"
echo    git push origin main
echo.
echo 2. Deploy Backend:
echo    - Go to https://vercel.com/dashboard
echo    - Create new project from your GitHub repo
echo    - Set Root Directory: backend
echo    - Add environment variables (see DEPLOYMENT.md)
echo.
echo 3. Deploy Frontend:
echo    - Create another project from same GitHub repo
echo    - Set Root Directory: frontend  
echo    - Add VITE_API_URL with your backend domain
echo.
echo 📖 See DEPLOYMENT.md for detailed instructions
echo 🌟 Happy deploying!

pause