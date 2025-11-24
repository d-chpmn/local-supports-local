from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models.realtor import Realtor
from models.transaction import Transaction
from models.notification import Notification
from datetime import datetime

transactions_bp = Blueprint('transactions', __name__, url_prefix='/api/transactions')

@transactions_bp.route('/submit', methods=['POST'])
@jwt_required()
def submit_transaction():
    """Submit monthly closed transactions"""
    try:
        realtor_id = int(get_jwt_identity())
        realtor = Realtor.query.get(realtor_id)
        
        if not realtor:
            return jsonify({'error': 'Realtor not found'}), 404
        
        data = request.get_json()
        
        # Validate required fields
        if 'closed_transactions_count' not in data:
            return jsonify({'error': 'closed_transactions_count is required'}), 400
        
        # Get month and year (default to previous month)
        month = data.get('month')
        year = data.get('year')
        
        if not month or not year:
            now = datetime.utcnow()
            if now.month == 1:
                month = 12
                year = now.year - 1
            else:
                month = now.month - 1
                year = now.year
        
        # Validate month and year
        if not (1 <= month <= 12):
            return jsonify({'error': 'Month must be between 1 and 12'}), 400
        
        if year < 2020 or year > datetime.utcnow().year:
            return jsonify({'error': 'Invalid year'}), 400
        
        # Validate transaction count
        try:
            closed_count = int(data['closed_transactions_count'])
            if closed_count < 0:
                return jsonify({'error': 'Transaction count must be non-negative'}), 400
        except (ValueError, TypeError):
            return jsonify({'error': 'Invalid transaction count'}), 400
        
        # Check if transaction already exists for this period
        existing = Transaction.query.filter_by(
            realtor_id=realtor_id,
            month=month,
            year=year
        ).first()
        
        if existing:
            return jsonify({'error': f'Transactions for {month}/{year} already submitted'}), 409
        
        # Calculate donation amount
        calculated_amount = closed_count * realtor.donation_amount_per_transaction
        
        # Create transaction record
        transaction = Transaction(
            realtor_id=realtor_id,
            month=month,
            year=year,
            closed_transactions_count=closed_count,
            calculated_donation_amount=calculated_amount,
            status='pending' if calculated_amount > 0 else 'paid'
        )
        
        db.session.add(transaction)
        
        # Create payment request notification if donation is due
        if calculated_amount > 0:
            notification = Notification(
                realtor_id=realtor_id,
                type='payment_request',
                subject='Payment Requested for Monthly Donation',
                message=f'Thank you for submitting your transactions! Your donation amount for {transaction.get_period_display()} is ${calculated_amount:.2f}. Please submit your payment.',
                action_url='/donations/payment'
            )
            db.session.add(notification)
        
        db.session.commit()
        
        return jsonify({
            'message': 'Transactions submitted successfully',
            'transaction': transaction.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@transactions_bp.route('/history', methods=['GET'])
@jwt_required()
def get_history():
    """Get transaction history"""
    try:
        realtor_id = int(get_jwt_identity())
        
        transactions = Transaction.query\
            .filter_by(realtor_id=realtor_id)\
            .order_by(Transaction.year.desc(), Transaction.month.desc())\
            .all()
        
        return jsonify({
            'transactions': [t.to_dict() for t in transactions]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@transactions_bp.route('/current-month', methods=['GET'])
@jwt_required()
def check_current_month():
    """Check if current month transactions have been submitted"""
    try:
        realtor_id = int(get_jwt_identity())
        
        # Get previous month
        now = datetime.utcnow()
        if now.month == 1:
            month = 12
            year = now.year - 1
        else:
            month = now.month - 1
            year = now.year
        
        transaction = Transaction.query.filter_by(
            realtor_id=realtor_id,
            month=month,
            year=year
        ).first()
        
        return jsonify({
            'month': month,
            'year': year,
            'submitted': transaction is not None,
            'transaction': transaction.to_dict() if transaction else None
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@transactions_bp.route('/pending', methods=['GET'])
@jwt_required()
def get_pending():
    """Get pending transaction submissions"""
    try:
        realtor_id = int(get_jwt_identity())
        realtor = Realtor.query.get(realtor_id)
        
        if not realtor:
            return jsonify({'error': 'Realtor not found'}), 404
        
        # Find months that haven't been submitted
        # For now, just return the previous month if not submitted
        now = datetime.utcnow()
        if now.month == 1:
            month = 12
            year = now.year - 1
        else:
            month = now.month - 1
            year = now.year
        
        transaction = Transaction.query.filter_by(
            realtor_id=realtor_id,
            month=month,
            year=year
        ).first()
        
        pending = []
        if not transaction and realtor.created_at < datetime(year, month, 1):
            months = ['January', 'February', 'March', 'April', 'May', 'June',
                      'July', 'August', 'September', 'October', 'November', 'December']
            pending.append({
                'month': month,
                'year': year,
                'display': f"{months[month - 1]} {year}"
            })
        
        return jsonify({
            'pending': pending
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
