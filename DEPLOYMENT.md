# Vercel Deployment Guide

## Prerequisites

1. Create accounts:
   - [Vercel Account](https://vercel.com/signup)
   - [MongoDB Atlas Account](https://www.mongodb.com/atlas) (if not using local MongoDB)
   - Gmail account with App Password for email service

2. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "prepare for vercel deployment"
   git push origin main
   ```

## Backend Deployment

### Step 1: Deploy Backend to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Set Root Directory to `backend`
5. Build Command: `npm run vercel-build`
6. Output Directory: `dist`
7. Install Command: `npm install`

### Step 2: Configure Environment Variables

In Vercel dashboard, go to your backend project → Settings → Environment Variables and add:

```
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/highway-delight
JWT_SECRET=your-super-secure-jwt-secret-minimum-32-characters
JWT_EXPIRE=7d
FRONTEND_URL=https://your-frontend-domain.vercel.app
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password
```

### Step 3: Deploy
Click "Deploy" and wait for the build to complete.

## Frontend Deployment

### Step 1: Deploy Frontend to Vercel

1. Create a new project in Vercel
2. Import the same GitHub repository
3. Set Root Directory to `frontend`
4. Framework Preset: Vite
5. Build Command: `npm run build`
6. Output Directory: `dist`
7. Install Command: `npm install`

### Step 2: Configure Environment Variables

Add this environment variable:

```
VITE_API_URL=https://your-backend-domain.vercel.app/api
```

Replace `your-backend-domain.vercel.app` with your actual backend domain from step 1.

### Step 3: Deploy
Click "Deploy" and wait for the build to complete.

## Post-Deployment Steps

1. Update CORS settings in your backend by updating `FRONTEND_URL` to your frontend domain
2. Test the application:
   - Sign up with a new account
   - Verify OTP functionality
   - Test note creation and management
   - Test authentication flows

## Custom Domains (Optional)

1. In Vercel dashboard, go to your project
2. Click on "Domains"
3. Add your custom domain
4. Update environment variables with new domain URLs

## Troubleshooting

### Common Issues:

1. **CORS Errors**: Make sure `FRONTEND_URL` in backend matches your frontend domain
2. **API Connection Failed**: Verify `VITE_API_URL` points to correct backend domain
3. **Email Not Working**: Check Gmail App Password configuration
4. **Database Connection**: Verify MongoDB Atlas connection string and IP whitelist

### Checking Logs:

1. Backend logs: Vercel Dashboard → Your Backend Project → Functions tab
2. Frontend logs: Browser Developer Console
3. Build logs: Vercel Dashboard → Deployments

## Environment Variables Checklist

### Backend (.env):
- [ ] NODE_ENV=production
- [ ] MONGODB_URI
- [ ] JWT_SECRET
- [ ] JWT_EXPIRE
- [ ] FRONTEND_URL
- [ ] RATE_LIMIT_WINDOW_MS
- [ ] RATE_LIMIT_MAX_REQUESTS
- [ ] SMTP_USER
- [ ] SMTP_PASS

### Frontend (.env):
- [ ] VITE_API_URL

## Security Notes

- Never commit `.env` files to version control
- Use strong JWT secrets (minimum 32 characters)
- Enable MongoDB Atlas IP whitelist (add 0.0.0.0/0 for Vercel)
- Use Gmail App Passwords, not regular passwords
- Regularly rotate secrets and passwords