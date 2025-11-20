# Deployment Guide - Local Supports Local Foundation

## Overview
This guide will help you deploy the Local Supports Local Foundation platform to make it accessible via a shareable link for demos and production use.

## Quick Start for Demo
The fastest way to get a shareable link is to deploy to **Render** (free tier available).

---

## Option 1: Deploy to Render (Recommended for Demo)

### Why Render?
- Free tier available
- Automatic HTTPS
- Easy deployment from GitHub
- Built-in database
- No credit card required for basic tier

### Steps:

#### 1. Prepare Your Code for GitHub
```bash
# In your project root
git init
git add .
git commit -m "Initial commit - ready for demo"

# Create a new repository on GitHub and push
git remote add origin https://github.com/YOUR_USERNAME/local-supports-local.git
git branch -M main
git push -u origin main
```

#### 2. Deploy Backend to Render

1. Go to [render.com](https://render.com) and sign up/log in
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `local-supports-local-backend`
   - **Region**: Choose closest to your location
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`
   - **Instance Type**: `Free`

5. Add Environment Variables:
   ```
   SECRET_KEY=your-production-secret-key-here
   JWT_SECRET_KEY=your-production-jwt-key-here
   FRONTEND_URL=https://your-frontend-url.onrender.com
   SENDGRID_API_KEY=your-sendgrid-api-key
   FROM_EMAIL=noreply@localmortgage.com
   USPS_USER_ID=dchapman@localmortgage.com
   DATABASE_URL=postgresql://... (Render will provide this)
   ```

6. Click **"Create Web Service"**

#### 3. Set Up Database on Render

1. After backend is created, go to **Dashboard** → **"New +"** → **"PostgreSQL"**
2. Configure:
   - **Name**: `local-supports-local-db`
   - **Instance Type**: `Free`
3. Copy the **Internal Database URL**
4. Go back to your backend service → **Environment** → Update `DATABASE_URL`

#### 4. Initialize Database

1. In Render dashboard, go to your backend service → **Shell**
2. Run migration commands:
   ```bash
   python migrate_database.py
   python create_admin.py
   ```

#### 5. Deploy Frontend to Render

1. Click **"New +"** → **"Static Site"**
2. Connect same GitHub repository
3. Configure:
   - **Name**: `local-supports-local-frontend`
   - **Branch**: `main`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`

4. Add Environment Variable:
   ```
   REACT_APP_API_URL=https://your-backend-url.onrender.com/api
   ```

5. Click **"Create Static Site"**

#### 6. Update Backend CORS

Update the `FRONTEND_URL` environment variable in your backend service to match your frontend URL.

### Your Demo is Ready! 🎉

Your app will be available at:
- **Frontend**: `https://local-supports-local-frontend.onrender.com`
- **Backend**: `https://local-supports-local-backend.onrender.com`

**Admin Login:**
- Email: `admin@localmortgage.com`
- Password: `admin123`

---

## Option 2: Deploy to Vercel + Railway

### Backend on Railway

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click **"New Project"** → **"Deploy from GitHub repo"**
4. Select your repository
5. Add environment variables (same as Render)
6. Railway will auto-detect Python and deploy

### Frontend on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Configure:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
4. Add environment variable:
   ```
   REACT_APP_API_URL=https://your-railway-backend.up.railway.app/api
   ```
5. Deploy

---

## Option 3: AWS Amplify + Elastic Beanstalk

For production-grade deployment with more control.

### Backend on Elastic Beanstalk

1. Install AWS CLI and EB CLI
2. Initialize EB in backend folder:
   ```bash
   cd backend
   eb init -p python-3.11 local-supports-local
   ```
3. Create environment and deploy:
   ```bash
   eb create production
   eb deploy
   ```

### Frontend on AWS Amplify

1. Go to AWS Amplify Console
2. Connect your repository
3. Configure build settings for React
4. Deploy

---

## Database Migration for Production

Before deploying, you need to migrate from SQLite to PostgreSQL:

### 1. Update requirements.txt
Add: `psycopg2-binary==2.9.9`

### 2. Update Database Connection
The `DATABASE_URL` environment variable will be provided by your hosting service.

### 3. Run Migrations
After deployment:
```bash
python migrate_database.py
python create_admin.py
```

---

## SendGrid Email Setup

1. Sign up at [sendgrid.com](https://sendgrid.com) (free tier: 100 emails/day)
2. Verify your sender email (noreply@localmortgage.com)
3. Create an API key:
   - Go to Settings → API Keys
   - Create API Key with "Full Access"
   - Copy the key
4. Add to environment variables:
   ```
   SENDGRID_API_KEY=SG.xxx...
   FROM_EMAIL=noreply@localmortgage.com
   ```

---

## Custom Domain Setup

### Backend
1. In Render/Railway, add custom domain in settings
2. Update DNS records as instructed
3. SSL is automatic

### Frontend
1. Add custom domain in Vercel/Render
2. Update DNS records
3. Update `FRONTEND_URL` in backend

---

## Environment Variables Checklist

### Backend
- ✅ `SECRET_KEY` - Random string for Flask
- ✅ `JWT_SECRET_KEY` - Random string for JWT
- ✅ `DATABASE_URL` - PostgreSQL connection string
- ✅ `FRONTEND_URL` - Your frontend URL
- ✅ `SENDGRID_API_KEY` - SendGrid API key
- ✅ `FROM_EMAIL` - Verified sender email
- ✅ `USPS_USER_ID` - USPS API user ID

### Frontend
- ✅ `REACT_APP_API_URL` - Your backend API URL

---

## Testing Your Deployment

1. **Visit frontend URL** - Should load homepage
2. **Test grant application** - Submit a test application
3. **Login as admin** - Use admin@localmortgage.com / admin123
4. **Check emails** - Verify SendGrid is sending emails
5. **Create test realtor** - Register and approve
6. **Submit application as realtor** - Test full workflow

---

## Monitoring & Logs

### Render
- Dashboard → Your Service → Logs
- View real-time logs and errors

### Vercel
- Dashboard → Your Project → Deployments
- Click deployment to view logs

### Railway
- Dashboard → Your Project → Deployments
- View build and runtime logs

---

## Troubleshooting

### "Cannot connect to database"
- Check `DATABASE_URL` is set correctly
- Ensure database service is running
- Run migrations: `python migrate_database.py`

### "CORS error" in browser console
- Update `FRONTEND_URL` in backend environment variables
- Restart backend service

### "Emails not sending"
- Check `SENDGRID_API_KEY` is set
- Verify sender email in SendGrid
- Check SendGrid dashboard for delivery issues

### "Module not found" errors
- Ensure all dependencies in requirements.txt
- Rebuild: `pip install -r requirements.txt`
- Check Python version (3.11+)

---

## Cost Estimate

### Free Tier (Good for Demo)
- **Render**: Free backend + database (spins down after inactivity)
- **Render Static**: Free frontend
- **SendGrid**: 100 emails/day free
- **Total**: $0/month

### Paid Tier (Production)
- **Render**: $7/month (always-on backend)
- **PostgreSQL**: $7/month (production database)
- **SendGrid**: $15/month (up to 50k emails)
- **Total**: ~$29/month

---

## Security Checklist Before Demo

- ✅ Change admin password from default
- ✅ Use strong `SECRET_KEY` and `JWT_SECRET_KEY`
- ✅ Enable HTTPS (automatic on most platforms)
- ✅ Set up CORS properly
- ✅ Verify SendGrid sender domain
- ✅ Test all email flows
- ✅ Check error handling works

---

## Quick Demo Script

1. **Homepage Tour**
   - Show "Apply for Grant" button
   - Explain foundation mission
   - Show realtor member benefits

2. **Grant Application Flow**
   - Click "Apply for Grant"
   - Fill out form (use test data)
   - Show USPS address validation
   - Submit and show confirmation

3. **Admin Dashboard**
   - Login as admin
   - Show pending realtors
   - Approve a test realtor
   - View grant applications
   - Change application status

4. **Email Notifications**
   - Show SendGrid dashboard
   - Check emails were sent/received
   - Demonstrate notification bell

5. **Realtor Experience**
   - Login as approved realtor
   - View grant applications
   - Show pending approval notice

---

## Need Help?

Common deployment platforms documentation:
- [Render Docs](https://render.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [Railway Docs](https://docs.railway.app)
- [SendGrid Docs](https://docs.sendgrid.com)

---

## Next Steps After Demo

1. Collect feedback
2. Set up custom domain
3. Configure production database backups
4. Add Google Analytics
5. Set up monitoring (Sentry, LogRocket)
6. Plan feature roadmap
