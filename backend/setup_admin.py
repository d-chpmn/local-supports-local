"""
One-time setup endpoint to create admin user
Access this via: https://your-backend-url.onrender.com/setup-admin
"""
from flask import Blueprint, jsonify
from extensions import db
from models import Realtor

setup_bp = Blueprint('setup', __name__)

@setup_bp.route('/setup-admin', methods=['GET'])
def setup_admin():
    """Create admin user - one-time setup endpoint"""
    try:
        # Check if admin exists
        admin_email = "admin@localmortgage.com"
        existing_admin = Realtor.query.filter_by(email=admin_email).first()
        
        if existing_admin:
            if not existing_admin.is_admin:
                existing_admin.is_admin = True
                existing_admin.is_approved = True
                existing_admin.approval_status = 'approved'
                db.session.commit()
                return jsonify({
                    'success': True,
                    'message': f'Updated {admin_email} to admin status',
                    'email': admin_email,
                    'password': 'admin123'
                }), 200
            return jsonify({
                'success': True,
                'message': 'Admin user already exists',
                'email': admin_email,
                'note': 'Use existing password or reset if forgotten'
            }), 200
        
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
        admin.set_password("admin123")
        
        db.session.add(admin)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Admin user created successfully!',
            'email': admin_email,
            'password': 'admin123',
            'warning': 'Change this password after first login!'
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
