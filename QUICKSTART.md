# Local Supports Local - Quick Start Guide

## Prerequisites

### Required Software
- **Node.js** 16 or higher ([Download](https://nodejs.org/))
- **Python** 3.9 or higher ([Download](https://www.python.org/downloads/))
- **Git** (optional, for version control)
- **Code Editor** (VS Code recommended)

## Installation Steps

### 1. Backend Setup

#### Navigate to Backend Directory
```powershell
cd "c:\Users\Dchapman\OneDrive - Local Mortgage\Documents\web work\local-supports-local\backend"
```

#### Install Python Dependencies
```powershell
pip install -r requirements.txt
```

#### Configure Environment Variables
1. Copy `.env.example` to `.env`:
```powershell
Copy-Item .env.example .env
```

2. Edit `.env` file and update the following:
   - `SECRET_KEY` - Generate a secure random string
   - `JWT_SECRET_KEY` - Generate another secure random string
   - Email settings (if using email notifications)
   - Stripe keys (when ready for payment processing)

#### Initialize Database
The database will be created automatically on first run. The app uses SQLite for development.

#### Start Backend Server
```powershell
python app.py
```

The API will be available at `http://localhost:5000`

### 2. Frontend Setup

#### Navigate to Frontend Directory
Open a new terminal window:
```powershell
cd "c:\Users\Dchapman\OneDrive - Local Mortgage\Documents\web work\local-supports-local\frontend"
```

#### Install Dependencies
```powershell
npm install
```

#### Start Development Server
```powershell
npm start
```

The React app will open automatically at `http://localhost:3000`

## Testing the Application

### Create a Test Realtor Account
1. Navigate to `http://localhost:3000`
2. Click "Join Now" or "Register"
3. Fill in the registration form:
   - Email: test@example.com
   - Password: testpassword123
   - First/Last Name: Test User
   - Donation per transaction: 100.00
4. Click "Create Account"

### Test the Workflow
1. **Dashboard** - View your stats (initially empty)
2. **Submit Transactions** - Enter closed deals for a month
3. **Make Payment** - Submit a payment for pending donations
4. **Social Share** - See thank you message and share options
5. **Profile** - Update your information and upload headshot
6. **History** - View past transactions and donations

## Project Structure

```
local-supports-local/
├── backend/                    # Flask Python API
│   ├── app.py                 # Main application
│   ├── config.py              # Configuration
│   ├── extensions.py          # Flask extensions
│   ├── requirements.txt       # Python dependencies
│   ├── models/                # Database models
│   │   ├── realtor.py
│   │   ├── transaction.py
│   │   ├── donation.py
│   │   └── notification.py
│   └── routes/                # API endpoints
│       ├── auth.py
│       ├── realtors.py
│       ├── transactions.py
│       ├── donations.py
│       └── notifications.py
│
└── frontend/                   # React application
    ├── public/
    ├── src/
    │   ├── components/        # Reusable components
    │   ├── context/           # React context (Auth)
    │   ├── pages/             # Page components
    │   ├── services/          # API service layer
    │   ├── App.js             # Main app
    │   └── index.js           # Entry point
    ├── package.json
    └── tailwind.config.js
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new realtor
- `POST /api/auth/login` - Login
- `GET /api/auth/verify` - Verify token

### Realtors
- `GET /api/realtors/profile` - Get profile
- `PUT /api/realtors/profile` - Update profile
- `POST /api/realtors/upload-headshot` - Upload photo
- `GET /api/realtors/stats` - Get statistics

### Transactions
- `POST /api/transactions/submit` - Submit monthly transactions
- `GET /api/transactions/history` - Get history
- `GET /api/transactions/current-month` - Check current month

### Donations
- `POST /api/donations/payment` - Submit payment
- `GET /api/donations/stats` - Get statistics
- `GET /api/donations/history` - Get history
- `GET /api/donations/pending` - Get pending donations

### Notifications
- `GET /api/notifications` - Get all notifications
- `POST /api/notifications/:id/read` - Mark as read
- `GET /api/notifications/unread-count` - Get unread count

## Common Issues & Solutions

### Backend Issues

**Issue**: Module not found error
```
Solution: Make sure you're in the backend directory and run:
pip install -r requirements.txt
```

**Issue**: Port 5000 already in use
```
Solution: Change the port in app.py or kill the process using port 5000
```

**Issue**: Database errors
```
Solution: Delete the .db file and restart the server to recreate it
```

### Frontend Issues

**Issue**: npm install fails
```
Solution: Delete node_modules folder and package-lock.json, then run:
npm install
```

**Issue**: Tailwind CSS not working
```
Solution: Make sure postcss.config.js and tailwind.config.js exist
```

**Issue**: API connection refused
```
Solution: Make sure the backend server is running on port 5000
```

## Next Steps

### For Development
1. **Add Logo** - Place Local Supports Local logo in `frontend/public/`
2. **Email Setup** - Configure SMTP settings in backend `.env`
3. **Testing** - Add test users and test the complete workflow
4. **Customize Colors** - Adjust in `frontend/tailwind.config.js`

### For Production
1. **Database** - Switch from SQLite to PostgreSQL
2. **Payment Gateway** - Integrate Stripe or PayPal
3. **Email Service** - Set up SendGrid or AWS SES
4. **File Storage** - Use AWS S3 for file uploads
5. **Hosting** - Deploy backend to Heroku/AWS, frontend to Vercel/Netlify
6. **SSL** - Enable HTTPS for security
7. **Domain** - Point custom domain to application
8. **Monitoring** - Add error tracking (Sentry) and analytics

## Additional Features to Implement

### Phase 2 Features
- [ ] Admin dashboard for foundation management
- [ ] Automated monthly reminders (scheduled tasks)
- [ ] Email notification system
- [ ] Payment integration (Stripe/PayPal)
- [ ] Social media image generation
- [ ] PDF receipt generation
- [ ] Export data to CSV/Excel
- [ ] Two-factor authentication

### Phase 3 Features
- [ ] Public-facing stats page
- [ ] Homebuyer grant application portal
- [ ] Success stories and testimonials
- [ ] Mobile responsive improvements
- [ ] Mobile app (React Native)
- [ ] Integration with MLS systems
- [ ] Automated tax receipts
- [ ] Referral program

## Support

For questions or issues:
- Check the README.md for detailed documentation
- Review PROJECT_ARCHITECTURE.md for technical details
- Contact: Local Mortgage IT Team

## License

Proprietary - Local Mortgage © 2024
