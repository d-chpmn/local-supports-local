"""
Create sample test data for demo purposes.
This script creates test realtors and grant applications.
"""
from app import create_app
from extensions import db
from models.realtor import Realtor
from models.grant_application import GrantApplication
from datetime import datetime, timedelta

def create_test_data():
    app = create_app()
    
    with app.app_context():
        print("Creating test data for demo...")
        print("-" * 60)
        
        # Create test realtors
        test_realtors = [
            {
                'email': 'john.smith@realestate.com',
                'password': 'password123',
                'first_name': 'John',
                'last_name': 'Smith',
                'phone': '(555) 123-4567',
                'brokerage': 'Premier Real Estate',
                'license_number': 'CA-DRE-12345678',
                'donation_amount_per_transaction': 100.00,
                'is_approved': True,
                'approval_status': 'approved',
                'approved_at': datetime.utcnow()
            },
            {
                'email': 'sarah.johnson@homes.com',
                'password': 'password123',
                'first_name': 'Sarah',
                'last_name': 'Johnson',
                'phone': '(555) 234-5678',
                'brokerage': 'Coastal Properties',
                'license_number': 'CA-DRE-87654321',
                'donation_amount_per_transaction': 150.00,
                'is_approved': False,
                'approval_status': 'pending'
            },
            {
                'email': 'mike.wilson@realty.com',
                'password': 'password123',
                'first_name': 'Mike',
                'last_name': 'Wilson',
                'phone': '(555) 345-6789',
                'brokerage': 'Wilson Realty Group',
                'license_number': 'CA-DRE-11223344',
                'donation_amount_per_transaction': 75.00,
                'is_approved': False,
                'approval_status': 'pending'
            }
        ]
        
        created_realtors = []
        for realtor_data in test_realtors:
            # Check if realtor already exists
            existing = Realtor.query.filter_by(email=realtor_data['email']).first()
            if existing:
                print(f"⚠️  Realtor already exists: {realtor_data['email']}")
                created_realtors.append(existing)
                continue
            
            password = realtor_data.pop('password')
            realtor = Realtor(**realtor_data)
            realtor.set_password(password)
            db.session.add(realtor)
            created_realtors.append(realtor)
            print(f"✓ Created realtor: {realtor.first_name} {realtor.last_name} ({realtor.email})")
        
        db.session.commit()
        
        # Create test grant applications
        test_applications = [
            {
                'application_type': 'self',
                'applicant_first_name': 'Maria',
                'applicant_last_name': 'Garcia',
                'applicant_address': '123 Main St, Apt 4B, Los Angeles, CA 90012',
                'applicant_email': 'maria.garcia@email.com',
                'applicant_phone': '(555) 111-2222',
                'applicant_birthday': datetime(1985, 6, 15).date(),
                'applicant_story': 'I am a single mother of two children, working full-time as a nurse. Due to unexpected medical bills and car repairs, I am struggling to make ends meet this month. A grant would help me pay for groceries and keep the lights on while I get back on my feet. I have always been proud to support my family, but sometimes life throws challenges that are hard to overcome alone.',
                'status': 'pending',
                'created_at': datetime.utcnow() - timedelta(days=2)
            },
            {
                'application_type': 'someone_else',
                'applicant_first_name': 'Robert',
                'applicant_last_name': 'Chen',
                'applicant_address': '456 Oak Avenue, Long Beach, CA 90802',
                'applicant_email': 'robert.chen@email.com',
                'applicant_phone': '(555) 222-3333',
                'applicant_birthday': datetime(1972, 3, 22).date(),
                'applicant_story': 'Robert is a veteran who recently lost his job due to company downsizing. He has been actively searching for work but needs assistance with rent this month to avoid eviction. He is a proud member of our community and has always helped others when he could. Now he needs our support to stay in his home while he finds new employment.',
                'submitter_first_name': 'John',
                'submitter_last_name': 'Smith',
                'submitter_address': '789 Realtor Plaza, Los Angeles, CA 90015',
                'submitter_email': 'john.smith@realestate.com',
                'submitter_phone': '(555) 123-4567',
                'submitter_relationship': 'Realtor helping a community member',
                'status': 'under_review',
                'created_at': datetime.utcnow() - timedelta(days=5)
            },
            {
                'application_type': 'self',
                'applicant_first_name': 'Linda',
                'applicant_last_name': 'Martinez',
                'applicant_address': '789 Pine Street, Santa Monica, CA 90401',
                'applicant_email': 'linda.martinez@email.com',
                'applicant_phone': '(555) 333-4444',
                'applicant_birthday': datetime(1990, 11, 8).date(),
                'applicant_story': 'I am a recent college graduate working two part-time jobs while searching for full-time employment in my field. I have student loan payments coming due and am struggling to afford both rent and loan payments. A grant would help me stay current on my loans and maintain my good credit while I search for better employment. I am determined to succeed and just need a little help during this transition period.',
                'status': 'approved',
                'created_at': datetime.utcnow() - timedelta(days=10),
                'reviewed_at': datetime.utcnow() - timedelta(days=3),
                'admin_notes': 'Approved - genuine need, good candidate for assistance'
            },
            {
                'application_type': 'self',
                'applicant_first_name': 'James',
                'applicant_last_name': 'Thompson',
                'applicant_address': '321 Elm Drive, Pasadena, CA 91101',
                'applicant_email': 'james.thompson@email.com',
                'applicant_phone': '(555) 444-5555',
                'applicant_birthday': datetime(1968, 9, 14).date(),
                'applicant_story': 'After a recent health crisis, I have been unable to work for the past month. My savings are depleted from medical bills not covered by insurance. I need help with utilities and groceries while I recover and return to work. I have worked hard my entire life and hate asking for help, but I have no other options right now.',
                'status': 'pending',
                'created_at': datetime.utcnow() - timedelta(hours=12)
            },
            {
                'application_type': 'someone_else',
                'applicant_first_name': 'Emily',
                'applicant_last_name': 'Rodriguez',
                'applicant_address': '654 Maple Court, Torrance, CA 90503',
                'applicant_email': 'emily.rodriguez@email.com',
                'applicant_phone': '(555) 555-6666',
                'applicant_birthday': datetime(1995, 2, 28).date(),
                'applicant_story': 'Emily is a young teacher who recently moved to the area to start her first teaching position. She had unexpected expenses with her move and starting her apartment, and is now short on funds before her first paycheck arrives. She is an excellent teacher who is making a difference in her students lives, and just needs help bridging the gap until her first pay period.',
                'submitter_first_name': 'Sarah',
                'submitter_last_name': 'Johnson',
                'submitter_address': '111 Coastal Road, Long Beach, CA 90803',
                'submitter_email': 'sarah.johnson@homes.com',
                'submitter_phone': '(555) 234-5678',
                'submitter_relationship': 'Realtor who helped her find housing',
                'status': 'denied',
                'created_at': datetime.utcnow() - timedelta(days=7),
                'reviewed_at': datetime.utcnow() - timedelta(days=1),
                'admin_notes': 'Denied - applicant has access to other resources. Recommended to contact teacher credit union for short-term loan.'
            }
        ]
        
        for app_data in test_applications:
            # Check if similar application exists
            existing = GrantApplication.query.filter_by(
                applicant_email=app_data['applicant_email']
            ).first()
            
            if existing:
                print(f"⚠️  Application already exists: {app_data['applicant_first_name']} {app_data['applicant_last_name']}")
                continue
            
            application = GrantApplication(**app_data)
            db.session.add(application)
            print(f"✓ Created application: {application.applicant_first_name} {application.applicant_last_name} ({application.status})")
        
        db.session.commit()
        
        print("-" * 60)
        print("✅ Test data created successfully!\n")
        
        print("TEST REALTOR ACCOUNTS:")
        print("-" * 60)
        for realtor in created_realtors:
            status = "✓ APPROVED" if realtor.is_approved else "⏳ PENDING"
            print(f"{status} | {realtor.first_name} {realtor.last_name}")
            print(f"  Email: {realtor.email}")
            print(f"  Password: password123")
            print(f"  Brokerage: {realtor.brokerage}")
            print()
        
        print("\nGRANT APPLICATIONS SUMMARY:")
        print("-" * 60)
        pending = GrantApplication.query.filter_by(status='pending').count()
        under_review = GrantApplication.query.filter_by(status='under_review').count()
        approved = GrantApplication.query.filter_by(status='approved').count()
        denied = GrantApplication.query.filter_by(status='denied').count()
        
        print(f"Pending: {pending}")
        print(f"Under Review: {under_review}")
        print(f"Approved: {approved}")
        print(f"Denied: {denied}")
        print(f"Total: {pending + under_review + approved + denied}")
        
        print("\n" + "=" * 60)
        print("You can now demo with realistic test data!")
        print("=" * 60)

if __name__ == '__main__':
    create_test_data()
