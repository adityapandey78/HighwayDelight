# Highway Delight - Full Stack Application

A modern, responsive full-stack web application built with TypeScript, React, Node.js, Express, and MongoDB. Features secure user authentication with OTP verification and a comprehensive notes management system.

## Features

- **Secure Authentication**: Sign up and sign in with OTP email verification
- **Responsive Design**: Optimized for mobile, tablet, and desktop devices
- **Notes Management**: Create, read, update, and delete personal notes
- **User Dashboard**: Personal dashboard with profile information
- **Modern UI**: Clean, beautiful interface with Tailwind CSS
- **Type Safety**: Full TypeScript implementation across frontend and backend
- **Security**: Password hashing, JWT authentication, rate limiting, and CORS protection
- **Email Integration**: OTP and password reset functionality via email

## Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v22.12+ or latest LTS)
- **npm** (comes with Node.js)
- **MongoDB** (local installation or MongoDB Atlas)

## Installation & Setup

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd HighwayDelight
```

### 2. Backend Setup

Navigate to the backend directory:
```bash
cd backend
```

Install dependencies:
```bash
npm install
```

Create environment file:
```bash
copy src/.env.example .env
```

Edit the `.env` file with your configuration:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/highway-delight
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

Build the TypeScript code:
```bash
npm run build
```

### 3. Frontend Setup

Navigate to the frontend directory:
```bash
cd ../frontend
```

Install dependencies:
```bash
npm install
```

### 4. Database Setup

#### Option A: Local MongoDB
1. Install MongoDB on your system
2. Start MongoDB service:
   ```bash
   mongod
   ```

#### Option B: MongoDB Atlas (Recommended)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string
4. Update the `MONGODB_URI` in your `.env` file

### 5. Running the Application

#### Start the Backend Server
```bash
cd backend
npm run dev
```
The backend will run on `http://localhost:5000`

#### Start the Frontend Development Server
Open a new terminal:
```bash
cd frontend
npm run dev
```
The frontend will run on `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration with OTP
- `POST /api/auth/signin` - User login
- `GET /api/auth/me` - Get current user profile

### Notes
- `GET /api/notes` - Get all user notes
- `POST /api/notes` - Create a new note
- `PUT /api/notes/:id` - Update a note
- `DELETE /api/notes/:id` - Delete a note

## Usage Guide

### 1. Sign Up
1. Navigate to the signup page
2. Fill in your details (name, email, date of birth, password)
3. Click "Get OTP"
4. Enter the OTP: `123456` (demo OTP for testing)
5. Click "Sign up" to complete registration

### 2. Sign In
1. Navigate to the signin page
2. Enter your email and password
3. Click "Sign In"

### 3. Dashboard
1. View your profile information
2. Create new notes by clicking "Create Note"
3. View all your notes in the main area
4. Delete notes using the trash icon

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting to prevent abuse
- CORS protection
- Helmet for security headers
- Input validation and sanitization

## Design System

The application uses a modern design system with:
- **Colors**: Blue gradient theme
- **Typography**: Inter font family
- **Components**: Consistent spacing and styling
- **Responsive**: Mobile-first design approach

## Troubleshooting

### Backend Issues
- **MongoDB Connection Error**: Ensure MongoDB is running and the connection string is correct
- **Port Already in Use**: Change the PORT in `.env` file
- **JWT Secret**: Make sure JWT_SECRET is set in `.env`

### Frontend Issues
- **API Connection Error**: Ensure backend is running on port 5000
- **Build Errors**: Run `npm install` to ensure all dependencies are installed
- **TypeScript Errors**: Run `npm run build` to check for type errors

## Deployment

This application is optimized for deployment on Vercel, which provides seamless hosting for both frontend and backend.

### Quick Deployment Steps:

1. **Prepare your code:**
   ```bash
   git add .
   git commit -m "prepare for vercel deployment"
   git push origin main
   ```

2. **Deploy Backend:**
   - Create new Vercel project from your GitHub repository
   - Set Root Directory to `backend`
   - Configure environment variables (MongoDB, JWT, email settings)
   - Deploy and copy the domain URL

3. **Deploy Frontend:**
   - Create another Vercel project from same GitHub repository
   - Set Root Directory to `frontend`
   - Add `VITE_API_URL` environment variable with your backend domain
   - Deploy

### Detailed Instructions
For complete step-by-step deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

### Environment Variables Needed:
- **Backend**: MongoDB URI, JWT secret, email credentials, CORS settings
- **Frontend**: API URL pointing to your deployed backend
---
This readme has been generated with the help of AI.
**Happy Coding!**