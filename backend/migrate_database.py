"""
Database migration script to add new columns to existing database.
This script adds the new approval and admin columns to the realtors table.
"""
from app import create_app
from extensions import db
from sqlalchemy import text
import os

def migrate_database():
    app = create_app()
    
    with app.app_context():
        try:
            # Check if columns already exist
            inspector = db.inspect(db.engine)
            columns = [col['name'] for col in inspector.get_columns('realtors')]
            
            print("Current columns in realtors table:", columns)
            
            # Add is_admin column if it doesn't exist
            if 'is_admin' not in columns:
                print("Adding is_admin column...")
                db.session.execute(text('ALTER TABLE realtors ADD COLUMN is_admin BOOLEAN DEFAULT 0'))
                print("✓ Added is_admin column")
            else:
                print("✓ is_admin column already exists")
            
            # Add is_approved column if it doesn't exist
            if 'is_approved' not in columns:
                print("Adding is_approved column...")
                db.session.execute(text('ALTER TABLE realtors ADD COLUMN is_approved BOOLEAN DEFAULT 0'))
                print("✓ Added is_approved column")
            else:
                print("✓ is_approved column already exists")
            
            # Add approval_status column if it doesn't exist
            if 'approval_status' not in columns:
                print("Adding approval_status column...")
                db.session.execute(text('ALTER TABLE realtors ADD COLUMN approval_status VARCHAR(20) DEFAULT "pending"'))
                print("✓ Added approval_status column")
            else:
                print("✓ approval_status column already exists")
            
            # Add approved_at column if it doesn't exist
            if 'approved_at' not in columns:
                print("Adding approved_at column...")
                db.session.execute(text('ALTER TABLE realtors ADD COLUMN approved_at DATETIME'))
                print("✓ Added approved_at column")
            else:
                print("✓ approved_at column already exists")
            
            db.session.commit()
            
            print("\n✅ Database migration completed successfully!")
            print("\nNext step: Run 'python create_admin.py' to create your admin user")
            
        except Exception as e:
            print(f"\n❌ Error during migration: {str(e)}")
            db.session.rollback()
            raise

if __name__ == '__main__':
    migrate_database()
