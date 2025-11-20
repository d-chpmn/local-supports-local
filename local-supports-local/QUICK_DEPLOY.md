# Quick Deployment Options for Shareable Demo Link

## 🚀 Fastest: ngrok (5 minutes)
**Best for:** Quick demo, testing before full deployment

### Setup
```bash
# Install ngrok
choco install ngrok  # Windows
# or download from https://ngrok.com/download

# Start your servers locally
cd backend
python app.py  # Terminal 1

cd frontend
npm start      # Terminal 2

# Create tunnels (in separate terminals)
ngrok http 5000  # Terminal 3 - Backend
ngrok http 3000  # Terminal 4 - Frontend
```

### Update Frontend to Use Backend Tunnel
Create `frontend/.env.local`:
```
REACT_APP_API_URL=https://xxxx-xx-xxx-xxx.ngrok-free.app/api
```

Restart frontend: `npm start`

### Share Links
- **Frontend URL**: The ngrok URL from Terminal 4
- **Valid for**: Your demo session (URLs change when you restart)

**Pros:** 
- ✅ 5 minutes to set up
- ✅ No deployment needed
- ✅ Free

**Cons:**
- ❌ URLs change when you restart
- ❌ Free tier shows ngrok warning page
- ❌ Not suitable for long-term

---

## ⚡ Recommended: Render (30 minutes)
**Best for:** Professional demo, persistent link

### Backend Deployment
1. Push code to GitHub:
```bash
git init
git add .
git commit -m "Ready for deployment"
git remote add origin YOUR_GITHUB_REPO
git push -u origin main
```

2. Deploy on Render:
   - Go to [render.com](https://render.com)
   - New → Web Service
   - Connect GitHub repo
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`
   - Add environment variables (see .env.example)

3. Create PostgreSQL database:
   - New → PostgreSQL
   - Copy Internal Database URL
   - Add to backend service as `DATABASE_URL`

4. Run migrations in Shell:
```bash
python migrate_database.py
python create_admin.py
```

### Frontend Deployment
1. On Render:
   - New → Static Site
   - Same GitHub repo
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`
   - Environment variable:
     ```
     REACT_APP_API_URL=https://YOUR-BACKEND.onrender.com/api
     ```

2. Update backend `FRONTEND_URL` to match frontend URL

### Share Links
Your app URLs will be:
- `https://local-supports-local-frontend.onrender.com`
- `https://local-supports-local-backend.onrender.com`

**Pros:**
- ✅ Free tier available
- ✅ Automatic HTTPS
- ✅ Persistent URLs
- ✅ Professional appearance

**Cons:**
- ❌ Free tier spins down after 15 min inactivity (30s to wake up)
- ❌ Requires GitHub account
- ❌ 30 min setup time

---

## 🌐 Alternative: Vercel + Railway (25 minutes)

### Backend on Railway
1. [railway.app](https://railway.app) → New Project
2. Deploy from GitHub
3. Add PostgreSQL database (one click)
4. Add environment variables
5. Auto-deploys on push

### Frontend on Vercel
1. [vercel.com](https://vercel.com) → Import Project
2. Connect GitHub
3. Framework: Create React App
4. Root Directory: `frontend`
5. Add `REACT_APP_API_URL` environment variable
6. Deploy

**Pros:**
- ✅ Vercel doesn't sleep (always fast)
- ✅ Great for React apps
- ✅ Simple setup

**Cons:**
- ❌ Railway free tier limits
- ❌ Two platforms to manage

---

## 🏢 Enterprise: AWS (2-3 hours)

### Backend: Elastic Beanstalk
```bash
cd backend
eb init -p python-3.11 local-supports-local
eb create production
eb deploy
```

### Frontend: Amplify
1. AWS Console → Amplify
2. Connect repository
3. Configure build settings
4. Deploy

**Pros:**
- ✅ Highly scalable
- ✅ Production-ready
- ✅ Advanced features

**Cons:**
- ❌ More complex
- ❌ Costs more
- ❌ Longer setup

---

## 📧 SendGrid Setup (10 minutes)
**Required for email notifications**

1. Sign up at [sendgrid.com](https://sendgrid.com)
   - Free tier: 100 emails/day
   
2. Verify sender email:
   - Settings → Sender Authentication
   - Single Sender Verification
   - Add `noreply@localmortgage.com`
   - Click verification link in email

3. Create API Key:
   - Settings → API Keys
   - Create API Key
   - Name: "LocalSupportsLocal"
   - Permissions: Full Access
   - Copy the key (shows once!)

4. Add to environment variables:
```
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
FROM_EMAIL=noreply@localmortgage.com
```

5. Test by registering a new realtor

**Without SendGrid:**
- Emails will be logged to console instead
- App works normally, just no actual emails sent

---

## 💡 My Recommendation

**For Your Demo Tomorrow:**
Use **ngrok** (5 min setup, works immediately)

**For Colleague Demo This Week:**
Use **Render** (30 min setup, professional persistent link)

**For Production Launch:**
Use **AWS** or **Render paid tier** with custom domain

---

## Quick Decision Matrix

| Need | Solution | Time | Cost |
|------|----------|------|------|
| Demo right now | ngrok | 5 min | Free |
| Demo this week | Render | 30 min | Free |
| Share for testing | Render | 30 min | Free |
| Production launch | Render/AWS | 1-3 hrs | $7-30/mo |

---

## Environment Variables Reference

### Backend (.env)
```bash
SECRET_KEY=your-secret-key
JWT_SECRET_KEY=your-jwt-key
DATABASE_URL=postgresql://... or sqlite:///local_supports_local.db
FRONTEND_URL=https://your-frontend-url
SENDGRID_API_KEY=SG.xxx (optional - for emails)
FROM_EMAIL=noreply@localmortgage.com
USPS_USER_ID=dchapman@localmortgage.com
```

### Frontend (.env)
```bash
REACT_APP_API_URL=https://your-backend-url/api
```

---

## Next Steps

1. **Choose your deployment method** based on timeline
2. **Set up SendGrid** if you want email notifications
3. **Follow deployment guide** for your chosen platform
4. **Test everything** before sharing link
5. **Create test data** for impressive demo

Need help deciding? Ask yourself:
- When is the demo? (today = ngrok, this week = Render)
- Need emails working? (set up SendGrid)
- How long will you use it? (short-term = ngrok, long-term = Render)

You're ready to deploy! 🎉
