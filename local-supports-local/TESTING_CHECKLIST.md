# Testing Checklist - Local Supports Local Updates

## Pre-Testing Setup

- [ ] Backend server running on http://localhost:5000
- [ ] Frontend server running on http://localhost:3000
- [ ] Admin account created (run `python create_admin.py`)

## Test 1: Grant Application (Public User)

### Path A: Self Application
- [ ] Navigate to http://localhost:3000
- [ ] Click "Apply for Grant" button in navbar
- [ ] Select "I am applying for myself or my household"
- [ ] Fill out applicant information:
  - [ ] First and last name
  - [ ] Valid street address (e.g., "123 Main St")
  - [ ] City, State, ZIP
  - [ ] Email and phone number
  - [ ] Date of birth
  - [ ] Story (test word counter at 500 words)
- [ ] Click "Submit Application"
- [ ] Verify address validation runs (may see brief "Validating Address..." message)
- [ ] Verify redirect to confirmation page
- [ ] Verify application ID displayed
- [ ] Click "Return to Home"

### Path B: Apply for Someone Else
- [ ] Navigate to http://localhost:3000
- [ ] Click "Apply for Grant" button
- [ ] Select "I am applying for someone else"
- [ ] Fill out YOUR information (submitter):
  - [ ] Your first and last name
  - [ ] Your street address, city, state, ZIP
  - [ ] Your email and phone
  - [ ] Your relationship to applicant
- [ ] Click "Next"
- [ ] Fill out APPLICANT information:
  - [ ] Applicant's details
  - [ ] Their address
  - [ ] Their story
- [ ] Submit and verify confirmation

## Test 2: Realtor Registration & Approval

### Register New Realtor
- [ ] Go to home page
- [ ] Click "Realtor Login" button in hero section
- [ ] Click "Sign Up" or "Join Now"
- [ ] Fill out registration form:
  - [ ] Email (use unique email)
  - [ ] Password
  - [ ] First and last name
  - [ ] Phone number
  - [ ] Brokerage name
  - [ ] License number
  - [ ] Donation amount per transaction (e.g., $100)
- [ ] Submit registration
- [ ] Verify redirect to dashboard
- [ ] **VERIFY: Yellow "Account Pending Approval" banner displayed**
- [ ] Logout

### Admin Approval Process
- [ ] Login as admin (admin@localmortgage.com / admin123)
- [ ] Verify "Admin Dashboard" button appears on regular dashboard
- [ ] Click "Admin Dashboard"
- [ ] **VERIFY: Statistics cards show correct counts**
- [ ] **VERIFY: Pending realtor appears in "Pending Realtor Approvals" table**
- [ ] **VERIFY: Table shows realtor's name, email, brokerage, license, donation amount**
- [ ] Click "Approve" button
- [ ] Confirm approval in popup
- [ ] **VERIFY: Realtor disappears from pending list**
- [ ] Logout

### Verify Approval as Realtor
- [ ] Login as the newly approved realtor
- [ ] **VERIFY: No pending approval banner**
- [ ] **VERIFY: Full access to all dashboard features**
- [ ] **VERIFY: Can see "Grant Applications" link in navbar**

## Test 3: Admin Denial Flow

### Deny a Realtor
- [ ] Register another new realtor account
- [ ] Logout
- [ ] Login as admin
- [ ] Go to Admin Dashboard
- [ ] Click "Deny" on the new pending realtor
- [ ] Enter a reason (e.g., "Invalid license number")
- [ ] Confirm denial
- [ ] **VERIFY: Realtor removed from pending list**

### Verify Denial as Realtor
- [ ] Login as the denied realtor
- [ ] Check dashboard for any messaging
- [ ] (Optional) Check notifications bell for denial message

## Test 4: Grant Applications View

### As Approved Realtor
- [ ] Login as approved realtor
- [ ] Click "Grant Applications" in navbar
- [ ] **VERIFY: List of submitted applications displayed**
- [ ] **VERIFY: Tabs for filtering (All, Pending, Under Review, Approved, Denied)**
- [ ] Click on different filter tabs
- [ ] **VERIFY: Filtering works correctly**
- [ ] Click "View Details" on an application
- [ ] **VERIFY: Full application details displayed**
- [ ] **VERIFY: Applicant information shown**
- [ ] **VERIFY: Applicant's story displayed**
- [ ] **VERIFY: No admin action buttons visible (realtor is not admin)**

### As Admin
- [ ] Login as admin
- [ ] Go to Grant Applications
- [ ] Click "View Details" on an application
- [ ] **VERIFY: Admin action buttons visible:**
  - [ ] "Mark as Under Review"
  - [ ] "Approve Application"
  - [ ] "Deny Application"
- [ ] Click "Mark as Under Review"
- [ ] Confirm action
- [ ] **VERIFY: Status badge updated to "UNDER REVIEW"**
- [ ] **VERIFY: Reviewed timestamp appears**
- [ ] Click "Approve Application"
- [ ] **VERIFY: Status changes to "APPROVED"**

## Test 5: Navigation & UI

### Public User Navigation
- [ ] Open home page (logged out)
- [ ] **VERIFY: "Apply for Grant" button visible in navbar (top right)**
- [ ] **VERIFY: No "Login" link in navbar**
- [ ] **VERIFY: Hero section shows two buttons:**
  - [ ] "Apply for Grant"
  - [ ] "Realtor Login"
- [ ] **VERIFY: Bottom CTA shows both buttons:**
  - [ ] "Apply for Grant"
  - [ ] "Become a Realtor Member"
- [ ] Click "Realtor Login" in hero
- [ ] **VERIFY: Redirects to login page**

### Realtor Navigation
- [ ] Login as approved realtor
- [ ] **VERIFY: Navbar shows:**
  - [ ] Dashboard
  - [ ] Submit Transactions
  - [ ] Grant Applications (NEW)
  - [ ] History
  - [ ] Profile
  - [ ] Notifications bell
  - [ ] User name
  - [ ] Logout button
- [ ] **VERIFY: Logo still displays correctly (large, white background)**

### Admin Navigation
- [ ] Login as admin
- [ ] **VERIFY: "Admin Dashboard" button on regular dashboard**
- [ ] **VERIFY: All realtor navbar items present**
- [ ] Go to Admin Dashboard
- [ ] **VERIFY: Quick links work:**
  - [ ] "View All Grant Applications"
  - [ ] "View All Realtors"

## Test 6: Address Validation

### Test Valid Address
- [ ] Start grant application
- [ ] Enter a valid address:
  - Address: "1600 Pennsylvania Ave NW"
  - City: "Washington"
  - State: "DC"
  - ZIP: "20500"
- [ ] Proceed to next step
- [ ] **VERIFY: Address validation succeeds**
- [ ] **VERIFY: Address may be standardized**

### Test Invalid Address
- [ ] Start new grant application
- [ ] Enter invalid address:
  - Address: "1234 Fake Street"
  - City: "Nowhere"
  - State: "XX"
  - ZIP: "00000"
- [ ] Try to proceed
- [ ] **VERIFY: Error message appears**
- [ ] **VERIFY: Cannot proceed without valid address**

## Test 7: Notifications

### Admin Notifications
- [ ] Login as admin
- [ ] Check notification bell
- [ ] **VERIFY: Notifications for:**
  - [ ] New realtor registrations
  - [ ] New grant applications
- [ ] Click a notification
- [ ] **VERIFY: Notification marked as read**
- [ ] **VERIFY: Badge count decrements**

### Realtor Notifications
- [ ] Have admin approve a pending realtor
- [ ] Login as that realtor
- [ ] Check notification bell
- [ ] **VERIFY: "Account Approved" notification present**

## Test 8: Word Counter

### Grant Application Story
- [ ] Start grant application
- [ ] Get to the story field
- [ ] Start typing
- [ ] **VERIFY: Word count updates in real-time**
- [ ] Type more than 500 words
- [ ] **VERIFY: Red error message appears**
- [ ] **VERIFY: Submit button is disabled**
- [ ] Reduce to under 500 words
- [ ] **VERIFY: Error disappears**
- [ ] **VERIFY: Submit button enabled**

## Test 9: Phone Formatting

### Auto-Format Phone Numbers
- [ ] Start grant application or registration
- [ ] Click in phone number field
- [ ] Type: "5551234567"
- [ ] **VERIFY: Auto-formats to "(555) 123-4567"**
- [ ] Try typing non-numeric characters
- [ ] **VERIFY: Non-numeric characters ignored**

## Test 10: Responsive Design

### Mobile View
- [ ] Open browser dev tools (F12)
- [ ] Switch to mobile view (e.g., iPhone)
- [ ] Test all pages:
  - [ ] Home page
  - [ ] Grant application form
  - [ ] Dashboard
  - [ ] Grant applications list
  - [ ] Admin dashboard
- [ ] **VERIFY: Hamburger menu works on navbar**
- [ ] **VERIFY: Tables are scrollable/responsive**
- [ ] **VERIFY: Buttons stack vertically**
- [ ] **VERIFY: Forms are readable and usable**

## Test 11: Error Handling

### Backend Errors
- [ ] Stop backend server
- [ ] Try to submit grant application
- [ ] **VERIFY: Error message displays**
- [ ] Restart backend server

### Invalid Data
- [ ] Try to submit application with missing required fields
- [ ] **VERIFY: Validation prevents submission**
- [ ] Try to submit with invalid email format
- [ ] **VERIFY: Validation catches it**

## Test 12: Database Persistence

### Data Persistence
- [ ] Submit a grant application
- [ ] Note the application ID
- [ ] Restart both servers
- [ ] Login and view grant applications
- [ ] **VERIFY: Submitted application still exists**
- [ ] Approve a realtor
- [ ] Restart servers
- [ ] **VERIFY: Realtor remains approved**

## Test 13: Admin Stats

### Statistics Accuracy
- [ ] Login as admin
- [ ] Go to Admin Dashboard
- [ ] Note the statistics:
  - [ ] Pending realtors: ___
  - [ ] Approved realtors: ___
  - [ ] Pending applications: ___
  - [ ] Total applications: ___
- [ ] Approve a realtor
- [ ] Refresh page
- [ ] **VERIFY: Pending realtors count decreased**
- [ ] **VERIFY: Approved realtors count increased**

## Issues Found

Document any issues here:

1. Issue: _______________________
   Expected: ____________________
   Actual: ______________________
   Priority: High/Medium/Low

2. Issue: _______________________
   Expected: ____________________
   Actual: ______________________
   Priority: High/Medium/Low

---

## Testing Completed By: _____________
## Date: _____________
## Overall Status: Pass / Fail / Needs Fixes