# 🚀 Quick Deploy Reference Card

## Your URLs (After Deployment)
- **Share this**: https://local-supports-local.vercel.app
- **Backend**: https://local-supports-local-backend.onrender.com
- **API**: https://local-supports-local-backend.onrender.com/api

---

## Deploy Sequence
1. ✅ Push code to GitHub
2. ✅ Create PostgreSQL on Render
3. ✅ Deploy backend to Render
4. ✅ Initialize database (run migrations)
5. ✅ Deploy frontend to Vercel
6. ✅ Update backend FRONTEND_URL

---

## Important Environment Variables

### Render Backend
```
SECRET_KEY=<generate-random-32-chars>
JWT_SECRET_KEY=<generate-random-32-chars>
DATABASE_URL=<from-render-postgres>
FRONTEND_URL=https://local-supports-local.vercel.app
FLASK_ENV=production
FROM_EMAIL=noreply@localmortgage.com
USPS_USER_ID=dchapman@localmortgage.com
```

### Vercel Frontend
```
REACT_APP_API_URL=https://local-supports-local-backend.onrender.com
REACT_APP_SITE_NAME=Local Supports Local
```

---

## Generate Secure Keys
```powershell
# Run in PowerShell:
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})
```

---

## Database Setup Commands (Render Shell)
```bash
python migrate_database.py
python create_admin.py
```

---

## Update Deployment
```powershell
git add .
git commit -m "Update"
git push origin main
```
Both Render and Vercel auto-deploy from GitHub!

---

## Pre-Demo Checklist
- [ ] Wake up backend (visit URL 5 min before)
- [ ] Test login works
- [ ] Test creating transaction
- [ ] Test admin dashboard
- [ ] Have demo data ready

---

## Troubleshooting
**Blank page**: Check REACT_APP_API_URL in Vercel  
**CORS error**: Update FRONTEND_URL in Render  
**Slow first load**: Free tier sleeps - visit 5 min early  
**Check logs**: Render/Vercel dashboards → Logs tab
