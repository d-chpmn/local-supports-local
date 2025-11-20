from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
from extensions import db
from models.realtor import Realtor
from models.donation import Donation
from models.transaction import Transaction
import os
from datetime import datetime

realtors_bp = Blueprint('realtors', __name__, url_prefix='/api/realtors')

def allowed_file(filename, allowed_extensions):
    """Check if file extension is allowed"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed_extensions

@realtors_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    """Get current realtor profile"""
    try:
        realtor_id = get_jwt_identity()
        realtor = Realtor.query.get(realtor_id)
        
        if not realtor:
            return jsonify({'error': 'Realtor not found'}), 404
        
        return jsonify(realtor.to_dict()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@realtors_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    """Update realtor profile"""
    try:
        realtor_id = get_jwt_identity()
        realtor = Realtor.query.get(realtor_id)
        
        if not realtor:
            return jsonify({'error': 'Realtor not found'}), 404
        
        data = request.get_json()
        
        # Update allowed fields
        if 'first_name' in data:
            realtor.first_name = data['first_name']
        if 'last_name' in data:
            realtor.last_name = data['last_name']
        if 'phone' in data:
            realtor.phone = data['phone']
        if 'brokerage' in data:
            realtor.brokerage = data['brokerage']
        if 'license_number' in data:
            realtor.license_number = data['license_number']
        if 'bio' in data:
            realtor.bio = data['bio']
        if 'donation_amount_per_transaction' in data:
            try:
                donation_amount = float(data['donation_amount_per_transaction'])
                if donation_amount < 0:
                    return jsonify({'error': 'Donation amount must be positive'}), 400
                realtor.donation_amount_per_transaction = donation_amount
            except (ValueError, TypeError):
                return jsonify({'error': 'Invalid donation amount'}), 400
        
        realtor.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'message': 'Profile updated successfully',
            'realtor': realtor.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@realtors_bp.route('/upload-headshot', methods=['POST'])
@jwt_required()
def upload_headshot():
    """Upload realtor headshot"""
    try:
        realtor_id = get_jwt_identity()
        realtor = Realtor.query.get(realtor_id)
        
        if not realtor:
            return jsonify({'error': 'Realtor not found'}), 404
        
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        allowed_extensions = {'png', 'jpg', 'jpeg', 'gif'}
        if not allowed_file(file.filename, allowed_extensions):
            return jsonify({'error': 'Invalid file type. Allowed: png, jpg, jpeg, gif'}), 400
        
        # Create upload directory if it doesn't exist
        upload_folder = 'uploads/headshots'
        os.makedirs(upload_folder, exist_ok=True)
        
        # Save file with secure filename
        filename = secure_filename(f"{realtor_id}_{datetime.utcnow().timestamp()}_{file.filename}")
        filepath = os.path.join(upload_folder, filename)
        file.save(filepath)
        
        # Update realtor headshot URL
        realtor.headshot_url = f'/uploads/headshots/{filename}'
        realtor.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'message': 'Headshot uploaded successfully',
            'headshot_url': realtor.headshot_url
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@realtors_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_stats():
    """Get realtor donation statistics"""
    try:
        realtor_id = get_jwt_identity()
        realtor = Realtor.query.get(realtor_id)
        
        if not realtor:
            return jsonify({'error': 'Realtor not found'}), 404
        
        # Calculate statistics
        total_donations = db.session.query(db.func.sum(Donation.amount))\
            .filter(Donation.realtor_id == realtor_id, Donation.payment_status == 'completed')\
            .scalar() or 0
        
        total_transactions = db.session.query(db.func.sum(Transaction.closed_transactions_count))\
            .filter(Transaction.realtor_id == realtor_id)\
            .scalar() or 0
        
        current_year = datetime.utcnow().year
        ytd_donations = db.session.query(db.func.sum(Donation.amount))\
            .join(Transaction)\
            .filter(
                Donation.realtor_id == realtor_id,
                Donation.payment_status == 'completed',
                Transaction.year == current_year
            )\
            .scalar() or 0
        
        pending_donations = db.session.query(db.func.sum(Transaction.calculated_donation_amount))\
            .filter(
                Transaction.realtor_id == realtor_id,
                Transaction.status == 'pending'
            )\
            .scalar() or 0
        
        # Get recent donations
        recent_donations = Donation.query\
            .filter(Donation.realtor_id == realtor_id)\
            .order_by(Donation.paid_at.desc())\
            .limit(5)\
            .all()
        
        return jsonify({
            'total_donations': float(total_donations),
            'total_transactions': int(total_transactions),
            'ytd_donations': float(ytd_donations),
            'pending_donations': float(pending_donations),
            'donation_per_transaction': float(realtor.donation_amount_per_transaction),
            'recent_donations': [d.to_dict() for d in recent_donations]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
