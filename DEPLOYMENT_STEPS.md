# 🚀 Deploy Local Supports Local - Step-by-Step Guide

**Goal**: Get your app live with shareable links for your demo!

**Time Required**: 30-40 minutes  
**Services**: Render (Backend + Database) + Vercel (Frontend)  
**Cost**: FREE tier for both

---

## 📋 Prerequisites

Before you start, make sure you have:
- [ ] GitHub account
- [ ] Render account (sign up at [render.com](https://render.com))
- [ ] Vercel account (sign up at [vercel.com](https://vercel.com))
- [ ] Your code pushed to GitHub

---

## Part 1: Push Code to GitHub (5 minutes)

### Step 1: Verify Git Status
```powershell
cd D:\Development\Projects\local-supports-local
git status
```

### Step 2: Commit and Push
```powershell
# Add all changes
git add .

# Commit
git commit -m "Ready for production deployment"

# Push to GitHub
git push origin main
```

If you haven't set up the remote yet:
```powershell
git remote add origin https://github.com/d-chpmn/local-supports-local.git
git branch -M main
git push -u origin main
```

---

## Part 2: Deploy Backend to Render (15 minutes)

### Step 1: Create PostgreSQL Database

1. Go to [render.com/dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"PostgreSQL"**
3. Configure:
   - **Name**: `local-supports-local-db`
   - **Database**: `local_supports_local`
   - **User**: `local_supports_local_user`
   - **Region**: Choose closest to you (e.g., Oregon)
   - **Instance Type**: **Free**
4. Click **"Create Database"**
5. Wait for it to provision (2-3 minutes)
6. **Copy the "Internal Database URL"** - you'll need this!

### Step 2: Create Backend Web Service

1. Click **"New +"** → **"Web Service"**
2. Click **"Connect a repository"** → Connect your GitHub account
3. Select repository: `d-chpmn/local-supports-local`
4. Configure the service:
   - **Name**: `local-supports-local-backend`
   - **Region**: Same as database (e.g., Oregon)
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: **Python 3**
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`
   - **Instance Type**: **Free**

### Step 3: Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"** and add these:

| Key | Value |
|-----|-------|
| `SECRET_KEY` | `prod-secret-key-change-this-to-random-string` |
| `JWT_SECRET_KEY` | `prod-jwt-key-change-this-to-random-string` |
| `FLASK_ENV` | `production` |
| `DATABASE_URL` | Paste the Internal Database URL from Step 1 |
| `FRONTEND_URL` | `https://local-supports-local.vercel.app` (we'll update this later) |
| `SENDGRID_API_KEY` | Leave blank for now (or add your SendGrid key) |
| `FROM_EMAIL` | `noreply@localmortgage.com` |
| `USPS_USER_ID` | `dchapman@localmortgage.com` |

**Generate secure keys** for SECRET_KEY and JWT_SECRET_KEY:
```powershell
# Run in PowerShell to generate random keys
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})
```

### Step 4: Deploy!

1. Click **"Create Web Service"**
2. Wait for deployment (5-7 minutes)
3. Once deployed, you'll see: ✅ **Live** with a URL like:
   `https://local-supports-local-backend.onrender.com`
4. **Copy this URL** - you'll need it for the frontend!

### Step 5: Initialize Database

1. In your backend service dashboard, click **"Shell"** (top right)
2. Run these commands:
   ```bash
   python migrate_database.py
   python create_admin.py
   ```
3. Follow prompts to create admin user
4. Type `exit` to close shell

---

## Part 3: Deploy Frontend to Vercel (10 minutes)

### Step 1: Create Vercel Project

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"** → Connect GitHub if needed
4. Select: `d-chpmn/local-supports-local`
5. Configure:
   - **Framework Preset**: `Create React App`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

### Step 2: Add Environment Variables

Click **"Environment Variables"** and add:

| Key | Value |
|-----|-------|
| `REACT_APP_API_URL` | `https://local-supports-local-backend.onrender.com` |
| `REACT_APP_SITE_NAME` | `Local Supports Local` |

**Important**: Replace the backend URL with YOUR actual Render backend URL from Part 2, Step 4!

### Step 3: Deploy!

1. Click **"Deploy"**
2. Wait for build (3-5 minutes)
3. Once deployed, you'll see your live URL:
   `https://local-supports-local.vercel.app`

---

## Part 4: Update Backend CORS (5 minutes)

### Step 1: Update FRONTEND_URL

1. Go back to Render dashboard
2. Open your backend service
3. Click **"Environment"** in left sidebar
4. Find `FRONTEND_URL` variable
5. Update value to your Vercel URL: `https://local-supports-local.vercel.app`
6. Click **"Save Changes"**
7. Service will automatically redeploy

---

## 🎉 Your App is Live!

### Your URLs:
- **Frontend**: `https://local-supports-local.vercel.app`
- **Backend**: `https://local-supports-local-backend.onrender.com`
- **API**: `https://local-supports-local-backend.onrender.com/api`

### Test Your Deployment:

1. **Visit frontend URL** - should load homepage
2. **Test login** with admin credentials you created
3. **Check dashboard** - all features should work
4. **Submit a test transaction** - verify backend connectivity

---

## 🐛 Troubleshooting

### Frontend shows blank page
- Check browser console for errors (F12)
- Verify `REACT_APP_API_URL` in Vercel environment variables
- Make sure backend URL doesn't have trailing slash

### Backend returns CORS errors
- Verify `FRONTEND_URL` in Render matches your Vercel URL exactly
- No trailing slash in either URL

### Database connection errors
- Check `DATABASE_URL` in Render environment variables
- Make sure database is in "Available" status

### Backend service won't start
- Check Render logs (click "Logs" tab)
- Verify all required environment variables are set
- Check `requirements.txt` for missing dependencies

---

## 🔄 Updating Your Deployment

Whenever you make code changes:

### Update Backend:
```powershell
git add .
git commit -m "Your update message"
git push origin main
```
Render will automatically rebuild and deploy!

### Update Frontend:
Same as backend - just push to GitHub, Vercel will auto-deploy!

### Manual Redeploy:
- **Render**: Click "Manual Deploy" → "Deploy latest commit"
- **Vercel**: Click "Deployments" → "Redeploy"

---

## 📧 Setup Email (Optional)

To enable email notifications:

1. Sign up for [SendGrid](https://sendgrid.com) (free tier: 100 emails/day)
2. Get your API key
3. Add to Render environment variables:
   - `SENDGRID_API_KEY`: Your SendGrid API key
   - `FROM_EMAIL`: Verified sender email
4. Save and redeploy

---

## 💡 Tips for Demo

- **First-time load may be slow** (free tier "sleeps" after 15 min of inactivity)
- **Wake up backend** 5 minutes before demo by visiting the URL
- **Create test data** beforehand so you have something to show
- **Test all features** before the demo to ensure everything works

---

## 🔐 Security Notes for Production

Before sharing with real users:
- [ ] Change SECRET_KEY and JWT_SECRET_KEY to strong random values
- [ ] Enable HTTPS only (both services do this by default)
- [ ] Set up proper email verification
- [ ] Add rate limiting to prevent abuse
- [ ] Review and restrict CORS settings
- [ ] Set up monitoring and error tracking

---

## 📱 Share Your Demo

**Share this link with colleagues:**
```
https://local-supports-local.vercel.app
```

**Admin login** (the credentials you created):
- Email: [your admin email]
- Password: [your admin password]

---

## ✅ Checklist

- [ ] Code pushed to GitHub
- [ ] PostgreSQL database created on Render
- [ ] Backend deployed to Render
- [ ] Database initialized with migrate_database.py
- [ ] Admin user created
- [ ] Frontend deployed to Vercel
- [ ] FRONTEND_URL updated in Render
- [ ] Tested login and basic features
- [ ] URLs saved for sharing

---

**Need help?** Check the logs:
- **Render**: Service dashboard → "Logs" tab
- **Vercel**: Project dashboard → "Deployments" → Click on deployment → "View Function Logs"
