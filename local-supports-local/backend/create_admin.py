"""
Utility script to create an admin user
Run this script to create the first admin account for the system
"""
from app import create_app
from extensions import db
from models import Realtor

def create_admin():
    app = create_app()
    
    with app.app_context():
        # Check if admin exists
        admin_email = "admin@localmortgage.com"
        existing_admin = Realtor.query.filter_by(email=admin_email).first()
        
        if existing_admin:
            print(f"Admin user already exists: {admin_email}")
            if not existing_admin.is_admin:
                existing_admin.is_admin = True
                existing_admin.is_approved = True
                existing_admin.approval_status = 'approved'
                db.session.commit()
                print(f"Updated {admin_email} to admin status")
            return
        
        # Create admin user
        admin = Realtor(
            email=admin_email,
            first_name="Admin",
            last_name="User",
            phone="(555) 555-5555",
            brokerage="Local Mortgage",
            license_number="ADMIN001",
            donation_amount_per_transaction=100.00,
            is_admin=True,
            is_approved=True,
            approval_status='approved'
        )
        admin.set_password("admin123")  # Change this password after first login!
        
        db.session.add(admin)
        db.session.commit()
        
        print("=" * 60)
        print("Admin user created successfully!")
        print("=" * 60)
        print(f"Email: {admin_email}")
        print("Password: admin123")
        print("=" * 60)
        print("IMPORTANT: Please change this password after first login!")
        print("=" * 60)

if __name__ == '__main__':
    create_admin()
