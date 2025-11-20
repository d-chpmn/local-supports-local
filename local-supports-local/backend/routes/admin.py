from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models import Realtor, Notification
from datetime import datetime
from utils.email_service import send_realtor_approval_email, send_monthly_transaction_reminder

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/realtors/pending', methods=['GET'])
@jwt_required()
def get_pending_realtors():
    """Get all pending realtor registrations (admin only)"""
    try:
        current_user_id = get_jwt_identity()
        admin = Realtor.query.get(current_user_id)
        
        if not admin or not admin.is_admin:
            return jsonify({'error': 'Admin access required'}), 403
        
        pending_realtors = Realtor.query.filter_by(approval_status='pending').order_by(Realtor.created_at.desc()).all()
        
        return jsonify({
            'realtors': [realtor.to_dict() for realtor in pending_realtors]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/realtors/<int:realtor_id>/approve', methods=['POST'])
@jwt_required()
def approve_realtor(realtor_id):
    """Approve a realtor registration (admin only)"""
    try:
        current_user_id = get_jwt_identity()
        admin = Realtor.query.get(current_user_id)
        
        if not admin or not admin.is_admin:
            return jsonify({'error': 'Admin access required'}), 403
        
        realtor = Realtor.query.get(realtor_id)
        
        if not realtor:
            return jsonify({'error': 'Realtor not found'}), 404
        
        if realtor.approval_status != 'pending':
            return jsonify({'error': 'Realtor is not pending approval'}), 400
        
        realtor.approval_status = 'approved'
        realtor.is_approved = True
        realtor.approved_at = datetime.utcnow()
        
        # Create notification for the realtor
        notification = Notification(
            realtor_id=realtor.id,
            type='account_approved',
            title='Account Approved',
            message='Congratulations! Your realtor account has been approved. You can now access the full dashboard.',
            is_read=False
        )
        db.session.add(notification)
        
        db.session.commit()
        
        # Send approval email to the realtor
        send_realtor_approval_email(realtor)
        
        return jsonify({
            'message': 'Realtor approved successfully',
            'realtor': realtor.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/realtors/<int:realtor_id>/deny', methods=['POST'])
@jwt_required()
def deny_realtor(realtor_id):
    """Deny a realtor registration (admin only)"""
    try:
        current_user_id = get_jwt_identity()
        admin = Realtor.query.get(current_user_id)
        
        if not admin or not admin.is_admin:
            return jsonify({'error': 'Admin access required'}), 403
        
        realtor = Realtor.query.get(realtor_id)
        
        if not realtor:
            return jsonify({'error': 'Realtor not found'}), 404
        
        if realtor.approval_status != 'pending':
            return jsonify({'error': 'Realtor is not pending approval'}), 400
        
        data = request.get_json()
        reason = data.get('reason', '')
        
        realtor.approval_status = 'denied'
        realtor.is_approved = False
        
        # Create notification for the realtor
        notification = Notification(
            realtor_id=realtor.id,
            type='account_denied',
            title='Account Application Denied',
            message=f'Your realtor account application has been denied. {reason}',
            is_read=False
        )
        db.session.add(notification)
        
        db.session.commit()
        
        return jsonify({
            'message': 'Realtor denied',
            'realtor': realtor.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/realtors', methods=['GET'])
@jwt_required()
def get_all_realtors():
    """Get all realtors (admin only)"""
    try:
        current_user_id = get_jwt_identity()
        admin = Realtor.query.get(current_user_id)
        
        if not admin or not admin.is_admin:
            return jsonify({'error': 'Admin access required'}), 403
        
        status = request.args.get('status')  # approved, pending, denied
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        
        query = Realtor.query
        
        if status:
            query = query.filter_by(approval_status=status)
        
        query = query.order_by(Realtor.created_at.desc())
        pagination = query.paginate(page=page, per_page=per_page, error_out=False)
        
        return jsonify({
            'realtors': [realtor.to_dict() for realtor in pagination.items],
            'total': pagination.total,
            'pages': pagination.pages,
            'current_page': page
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_admin_stats():
    """Get admin dashboard statistics"""
    try:
        current_user_id = get_jwt_identity()
        admin = Realtor.query.get(current_user_id)
        
        if not admin or not admin.is_admin:
            return jsonify({'error': 'Admin access required'}), 403
        
        from models import GrantApplication, Transaction, Donation
        
        stats = {
            'pending_realtors': Realtor.query.filter_by(approval_status='pending').count(),
            'approved_realtors': Realtor.query.filter_by(approval_status='approved').count(),
            'pending_applications': GrantApplication.query.filter_by(status='pending').count(),
            'total_applications': GrantApplication.query.count(),
            'total_transactions': Transaction.query.count(),
            'total_donations': db.session.query(db.func.sum(Donation.amount)).scalar() or 0
        }
        
        return jsonify(stats), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/send-monthly-reminders', methods=['POST'])
@jwt_required()
def send_monthly_reminders():
    """Send monthly transaction report reminders to all approved realtors (admin only)"""
    try:
        current_user_id = get_jwt_identity()
        admin = Realtor.query.get(current_user_id)
        
        if not admin or not admin.is_admin:
            return jsonify({'error': 'Admin access required'}), 403
        
        # Get all approved realtors
        approved_realtors = Realtor.query.filter_by(
            is_approved=True,
            approval_status='approved'
        ).all()
        
        if not approved_realtors:
            return jsonify({'message': 'No approved realtors to send reminders to'}), 200
        
        from datetime import date
        from dateutil.relativedelta import relativedelta
        from utils.email_service import send_email
        
        # Get previous month name and year
        today = date.today()
        last_month = today - relativedelta(months=1)
        month_name = last_month.strftime('%B')
        year = last_month.year
        
        emails_sent = 0
        errors = []
        
        for realtor in approved_realtors:
            try:
                # Send email reminder
                if send_monthly_transaction_reminder(
                    realtor=realtor,
                    month=month_name,
                    year=year,
                    report_url=f'{request.host_url}#/report-transactions'
                ):
                    emails_sent += 1
            except Exception as email_error:
                errors.append(f'{realtor.email}: {str(email_error)}')
        
        response = {
            'message': f'Monthly reminders sent to {emails_sent} realtor(s)',
            'emails_sent': emails_sent,
            'total_realtors': len(approved_realtors)
        }
        
        if errors:
            response['errors'] = errors
        
        return jsonify(response), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
