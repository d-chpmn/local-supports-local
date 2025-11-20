# Local Supports Local - Technical Architecture

## System Overview

The Local Supports Local platform is a full-stack web application designed to manage realtor donations to support homebuyer down payment assistance grants.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React)                      │
│  ┌────────────┬──────────────┬─────────────┬──────────────┐ │
│  │  Sign Up   │   Dashboard  │ Transactions│   Payment    │ │
│  │    Page    │     Page     │    Page     │    Page      │ │
│  └────────────┴──────────────┴─────────────┴──────────────┘ │
│                           ↕ REST API                         │
└─────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────┐
│                     Backend (Flask/Python)                   │
│  ┌────────────┬──────────────┬─────────────┬──────────────┐ │
│  │   Auth     │   Realtors   │Transactions │  Donations   │ │
│  │  Routes    │    Routes    │   Routes    │   Routes     │ │
│  └────────────┴──────────────┴─────────────┴──────────────┘ │
│  ┌─────────────────────────────────────────────────────────┐│
│  │              Business Logic Services                     ││
│  │  - Authentication  - Calculations  - Notifications       ││
│  └─────────────────────────────────────────────────────────┘│
│                           ↕ SQLAlchemy ORM                   │
└─────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────┐
│                   Database (SQLite/PostgreSQL)               │
│  Tables: realtors, transactions, donations, notifications    │
└─────────────────────────────────────────────────────────────┘
```

## Database Schema

### Realtors Table
```sql
- id (Primary Key)
- email (Unique)
- password_hash
- first_name
- last_name
- phone
- brokerage
- license_number
- donation_amount_per_transaction (Decimal)
- headshot_url
- created_at
- updated_at
- is_active (Boolean)
```

### Transactions Table
```sql
- id (Primary Key)
- realtor_id (Foreign Key)
- month (Integer 1-12)
- year (Integer)
- closed_transactions_count (Integer)
- calculated_donation_amount (Decimal)
- submitted_at
- status (pending/paid/overdue)
```

### Donations Table
```sql
- id (Primary Key)
- realtor_id (Foreign Key)
- transaction_id (Foreign Key)
- amount (Decimal)
- payment_method
- payment_reference
- paid_at
- thank_you_image_generated (Boolean)
```

### Notifications Table
```sql
- id (Primary Key)
- realtor_id (Foreign Key)
- type (transaction_reminder/payment_request/thank_you)
- message
- sent_at
- read_at
- action_url
```

## Frontend Structure

### Pages
1. **Landing/Home** - Foundation information and signup CTA
2. **Sign Up** - Realtor registration form
3. **Login** - Authentication
4. **Dashboard** - Overview of donations and statistics
5. **Profile** - Edit profile and upload headshot
6. **Submit Transactions** - Monthly transaction reporting
7. **Make Payment** - Payment submission interface
8. **History** - View past donations and transactions
9. **Social Share** - Download and share marketing materials

### Key Components
- `Header/Navigation` - Top nav with logo and menu
- `DashboardStats` - Cards showing key metrics
- `TransactionForm` - Form for entering closed deals
- `PaymentForm` - Payment submission interface
- `ProfileUpload` - Headshot upload with preview
- `SocialShareCard` - Generated marketing image
- `NotificationBanner` - Alert for pending actions

## Backend Structure

### Routes (API Endpoints)

#### Authentication (`/api/auth`)
- `POST /register` - Create new realtor account
- `POST /login` - Authenticate and return JWT
- `POST /logout` - Invalidate token
- `GET /verify` - Verify JWT token

#### Realtors (`/api/realtors`)
- `GET /profile` - Get current realtor profile
- `PUT /profile` - Update profile information
- `POST /upload-headshot` - Upload profile photo
- `PUT /donation-amount` - Update per-transaction donation

#### Transactions (`/api/transactions`)
- `POST /submit` - Submit monthly closed transactions
- `GET /current-month` - Check if current month submitted
- `GET /history` - Get all transaction submissions
- `GET /pending` - Get months pending submission

#### Donations (`/api/donations`)
- `POST /payment` - Record payment
- `GET /stats` - Get donation statistics (total, YTD, etc.)
- `GET /history` - Get payment history
- `GET /pending` - Get unpaid donations

#### Notifications (`/api/notifications`)
- `GET /` - Get all notifications
- `POST /:id/read` - Mark notification as read
- `GET /unread-count` - Count unread notifications

### Services

#### AuthService
- Password hashing and verification
- JWT token generation and validation
- Session management

#### RealtorService
- Profile CRUD operations
- Headshot upload to storage
- Validation of realtor data

#### TransactionService
- Calculate donation from transactions
- Track submission status
- Generate monthly reminders

#### DonationService
- Process payments
- Generate receipts
- Calculate statistics

#### NotificationService
- Schedule monthly reminders
- Send payment requests
- Email integration
- In-app notifications

#### SocialMediaService
- Generate thank-you graphics
- Create shareable content
- Track social shares

## Workflow

### 1. Realtor Signup
```
User visits signup page
  → Fills registration form (name, contact, brokerage info)
  → Sets donation_amount_per_transaction
  → Submits form
  → Backend creates account
  → Sends welcome email
  → Redirects to dashboard
```

### 2. Monthly Transaction Reporting
```
First business day of month
  → System sends notification
  → Realtor logs in
  → Navigates to Submit Transactions
  → Enters closed_transactions_prior_month
  → System calculates: donation_amount = donation_amount_per_transaction × closed_transactions_prior_month
  → Saves transaction record
  → Sends payment request notification
```

### 3. Payment Submission
```
Realtor receives payment notification
  → Clicks link to payment page
  → Reviews donation amount
  → Enters payment information
  → Submits payment
  → System records donation
  → Generates thank-you message
  → Creates shareable social media graphic
  → Downloads marketing image
```

## Scheduled Tasks

### Monthly (1st Business Day)
- Query all active realtors
- Send transaction reporting reminders
- Create notification records

### Weekly
- Check for overdue transaction submissions
- Send reminder emails
- Check for unpaid donations (>7 days)

### Daily
- Process payment confirmations
- Update donation statistics
- Clean up old notifications

## Security Considerations

1. **Authentication**
   - JWT-based authentication
   - Secure password hashing (bcrypt)
   - Token expiration and refresh

2. **Data Protection**
   - HTTPS only in production
   - Environment variables for secrets
   - SQL injection prevention (ORM)
   - XSS protection

3. **File Uploads**
   - Image validation and sanitization
   - File size limits
   - Secure storage (S3 or local with restricted access)

4. **Payment Security**
   - Never store full credit card numbers
   - Use payment gateway tokens
   - PCI compliance considerations

## Deployment Considerations

### Development
- SQLite database
- Local file storage
- Email logging to console

### Production
- PostgreSQL database
- AWS S3 for file storage
- SendGrid/AWS SES for emails
- Stripe/PayPal for payments
- Environment-based configuration
- SSL certificates
- Regular backups

## Future Enhancements

1. Admin dashboard for foundation management
2. Public-facing stats (total grants provided)
3. Homebuyer grant application portal
4. Automated tax receipt generation
5. Mobile app version
6. Integration with MLS systems
7. Referral program for realtors
8. Grant recipient stories/testimonials
9. Annual reports and impact metrics
10. Multi-office/team management
