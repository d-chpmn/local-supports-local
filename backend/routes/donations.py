from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models.realtor import Realtor
from models.transaction import Transaction
from models.donation import Donation
from models.notification import Notification
from datetime import datetime
from sqlalchemy import func, extract

donations_bp = Blueprint('donations', __name__, url_prefix='/api/donations')

@donations_bp.route('/payment', methods=['POST'])
@jwt_required()
def submit_payment():
    """Submit payment for a transaction"""
    try:
        realtor_id = get_jwt_identity()
        realtor = Realtor.query.get(realtor_id)
        
        if not realtor:
            return jsonify({'error': 'Realtor not found'}), 404
        
        data = request.get_json()
        
        # Validate required fields
        if 'transaction_id' not in data:
            return jsonify({'error': 'transaction_id is required'}), 400
        
        transaction_id = data['transaction_id']
        
        # Get transaction
        transaction = Transaction.query.get(transaction_id)
        
        if not transaction:
            return jsonify({'error': 'Transaction not found'}), 404
        
        if transaction.realtor_id != realtor_id:
            return jsonify({'error': 'Unauthorized'}), 403
        
        if transaction.status == 'paid':
            return jsonify({'error': 'Transaction already paid'}), 409
        
        # Check if donation already exists
        existing_donation = Donation.query.filter_by(transaction_id=transaction_id).first()
        if existing_donation:
            return jsonify({'error': 'Payment already recorded'}), 409
        
        # In production, integrate with payment gateway (Stripe, PayPal, etc.)
        # For now, we'll just record the payment
        
        donation = Donation(
            realtor_id=realtor_id,
            transaction_id=transaction_id,
            amount=transaction.calculated_donation_amount,
            payment_method=data.get('payment_method', 'credit_card'),
            payment_reference=data.get('payment_reference', ''),
            payment_status='completed'
        )
        
        # Update transaction status
        transaction.status = 'paid'
        
        db.session.add(donation)
        
        # Create thank you notification
        notification = Notification(
            realtor_id=realtor_id,
            type='thank_you',
            subject='Thank You for Your Donation!',
            message=f'Thank you for your ${donation.amount:.2f} donation for {transaction.get_period_display()}! Your contribution helps families achieve homeownership.',
            action_url='/donations/share'
        )
        db.session.add(notification)
        
        db.session.commit()
        
        return jsonify({
            'message': 'Payment submitted successfully',
            'donation': donation.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@donations_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_stats():
    """Get donation statistics"""
    try:
        realtor_id = get_jwt_identity()
        
        # Total donations
        total = db.session.query(func.sum(Donation.amount))\
            .filter(Donation.realtor_id == realtor_id, Donation.payment_status == 'completed')\
            .scalar() or 0
        
        # Year to date
        current_year = datetime.utcnow().year
        ytd = db.session.query(func.sum(Donation.amount))\
            .join(Transaction)\
            .filter(
                Donation.realtor_id == realtor_id,
                Donation.payment_status == 'completed',
                Transaction.year == current_year
            )\
            .scalar() or 0
        
        # Monthly breakdown for current year
        monthly_donations = db.session.query(
            Transaction.month,
            func.sum(Donation.amount).label('total')
        ).join(Donation)\
        .filter(
            Donation.realtor_id == realtor_id,
            Donation.payment_status == 'completed',
            Transaction.year == current_year
        )\
        .group_by(Transaction.month)\
        .all()
        
        monthly_data = [{'month': m, 'amount': float(a)} for m, a in monthly_donations]
        
        # Count of donations
        donation_count = Donation.query\
            .filter(Donation.realtor_id == realtor_id, Donation.payment_status == 'completed')\
            .count()
        
        return jsonify({
            'total_donations': float(total),
            'ytd_donations': float(ytd),
            'donation_count': donation_count,
            'monthly_breakdown': monthly_data
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@donations_bp.route('/history', methods=['GET'])
@jwt_required()
def get_history():
    """Get donation history"""
    try:
        realtor_id = get_jwt_identity()
        
        donations = Donation.query\
            .filter_by(realtor_id=realtor_id)\
            .order_by(Donation.paid_at.desc())\
            .all()
        
        # Include transaction details
        result = []
        for donation in donations:
            donation_dict = donation.to_dict()
            if donation.transaction:
                donation_dict['transaction'] = donation.transaction.to_dict()
            result.append(donation_dict)
        
        return jsonify({
            'donations': result
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@donations_bp.route('/pending', methods=['GET'])
@jwt_required()
def get_pending():
    """Get pending donations (transactions not yet paid)"""
    try:
        realtor_id = get_jwt_identity()
        
        pending_transactions = Transaction.query\
            .filter_by(realtor_id=realtor_id, status='pending')\
            .order_by(Transaction.year.desc(), Transaction.month.desc())\
            .all()
        
        return jsonify({
            'pending': [t.to_dict() for t in pending_transactions]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@donations_bp.route('/share-image/<int:donation_id>', methods=['GET'])
@jwt_required()
def get_share_image(donation_id):
    """Get social media share image for a donation"""
    try:
        realtor_id = get_jwt_identity()
        donation = Donation.query.get(donation_id)
        
        if not donation:
            return jsonify({'error': 'Donation not found'}), 404
        
        if donation.realtor_id != realtor_id:
            return jsonify({'error': 'Unauthorized'}), 403
        
        # In production, generate image with PIL or use a service
        # For now, return placeholder
        
        return jsonify({
            'image_url': donation.thank_you_image_url or '/api/donations/generate-image/' + str(donation_id),
            'message': f'Thank you for supporting Local Supports Local! ${donation.amount:.2f} donated to help families achieve homeownership.'
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
