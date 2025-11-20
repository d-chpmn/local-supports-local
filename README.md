# Local Supports Local Foundation Platform

A web platform for managing realtor donations to the Local Supports Local 501(c)(3) foundation, which provides down payment grants to deserving homebuyers.

## Project Overview

This platform enables realtors to:
- Sign up as foundation members
- Commit a donation amount per closed transaction
- Report monthly closed transactions
- Make monthly donations based on their activity
- View their donation statistics on a dashboard
- Share their contributions on social media

## Tech Stack

### Frontend
- React 18
- React Router for navigation
- Axios for API calls
- Tailwind CSS for styling
- Custom components with #00305B (navy) and #FEBC42 (gold) brand colors

### Backend
- Python 3.9+
- Flask web framework
- SQLAlchemy ORM
- Flask-CORS for cross-origin requests
- SQLite database (development) / PostgreSQL (production)
- JWT authentication

## Features

1. **Realtor Registration & Authentication**
   - Signup form with contact information
   - Profile management with headshot upload
   - Secure login system

2. **Dashboard**
   - Total donations to date
   - Monthly donation history
   - Closed transactions tracking
   - Profile overview

3. **Monthly Transaction Reporting**
   - Form to enter closed transactions
   - Automatic donation calculation
   - Payment submission workflow

4. **Payment System**
   - Integration-ready payment processing
   - Payment confirmation
   - Receipt generation

5. **Notification System**
   - Monthly reminders to report transactions
   - Payment request notifications
   - Email notification templates

6. **Social Media Marketing**
   - Downloadable thank-you graphics
   - Pre-filled social media posts
   - Donation impact statements

## Getting Started

### Prerequisites
- Node.js 16+ and npm
- Python 3.9+
- pip package manager

### Installation

1. Clone the repository
2. Install backend dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

### Running the Application

#### Backend
```bash
cd backend
python app.py
```
The API will run on http://localhost:5000

#### Frontend
```bash
cd frontend
npm start
```
The React app will run on http://localhost:3000

## Project Structure

```
local-supports-local/
├── backend/
│   ├── app.py                 # Flask application entry point
│   ├── config.py              # Configuration settings
│   ├── requirements.txt       # Python dependencies
│   ├── models/                # Database models
│   ├── routes/                # API endpoints
│   ├── services/              # Business logic
│   └── utils/                 # Utility functions
├── frontend/
│   ├── public/                # Static files
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── pages/             # Page components
│   │   ├── services/          # API service layer
│   │   ├── utils/             # Utility functions
│   │   ├── App.js             # Main app component
│   │   └── index.js           # Entry point
│   ├── package.json
│   └── tailwind.config.js
└── README.md
```

## Environment Variables

### Backend (.env)
```
FLASK_APP=app.py
FLASK_ENV=development
SECRET_KEY=your-secret-key
DATABASE_URL=sqlite:///local_supports_local.db
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@example.com
MAIL_PASSWORD=your-password
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new realtor
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout

### Realtors
- `GET /api/realtors/profile` - Get profile
- `PUT /api/realtors/profile` - Update profile
- `POST /api/realtors/upload-headshot` - Upload profile photo

### Transactions
- `POST /api/transactions/submit` - Submit monthly transactions
- `GET /api/transactions/history` - Get transaction history

### Donations
- `GET /api/donations/stats` - Get donation statistics
- `POST /api/donations/payment` - Submit payment
- `GET /api/donations/history` - Get payment history

### Notifications
- `GET /api/notifications` - Get notifications
- `POST /api/notifications/mark-read` - Mark as read

## Development Roadmap

- [x] Project setup and architecture
- [ ] Backend API implementation
- [ ] Database schema and models
- [ ] Frontend UI components
- [ ] Authentication system
- [ ] Dashboard implementation
- [ ] Monthly notification system
- [ ] Payment integration (Stripe/PayPal)
- [ ] Social media sharing
- [ ] Email notifications
- [ ] Admin panel for foundation management

## License

Proprietary - Local Mortgage © 2024
