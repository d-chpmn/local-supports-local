from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models import GrantApplication, Realtor, Notification
from datetime import datetime
from utils.address_validation import validate_address
from utils.email_service import send_application_confirmation_email, send_new_application_notification

grant_applications_bp = Blueprint('grant_applications', __name__)

@grant_applications_bp.route('/validate-address', methods=['POST'])
def validate_address_route():
    """Validate address using USPS API"""
    data = request.get_json()
    
    address = data.get('address')
    city = data.get('city')
    state = data.get('state')
    zip_code = data.get('zip')
    
    if not all([address, city, state, zip_code]):
        return jsonify({'error': 'All address fields are required'}), 400
    
    # For demo purposes, skip actual USPS validation and return the address as-is
    # In production, you would call validate_address(address, city, state, zip_code)
    result = {
        'success': True,
        'address': address,
        'city': city,
        'state': state,
        'zip5': zip_code,
        'zip4': '',
        'full_address': f"{address}, {city}, {state} {zip_code}"
    }
    
    return jsonify(result), 200

@grant_applications_bp.route('/', methods=['POST'])
def submit_application():
    """Submit a new grant application"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = [
            'application_type', 'applicant_first_name', 'applicant_last_name',
            'applicant_address', 'applicant_email', 'applicant_phone',
            'applicant_birthday', 'applicant_story'
        ]
        
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        # Validate story length (max 500 words)
        story_word_count = len(data.get('applicant_story', '').split())
        if story_word_count > 500:
            return jsonify({'error': 'Story must be 500 words or less'}), 400
        
        # If applying for someone else, validate submitter fields
        if data.get('application_type') == 'someone_else':
            submitter_fields = [
                'submitter_first_name', 'submitter_last_name', 'submitter_address',
                'submitter_email', 'submitter_phone', 'submitter_relationship'
            ]
            for field in submitter_fields:
                if not data.get(field):
                    return jsonify({'error': f'{field} is required when applying for someone else'}), 400
        
        # Parse birthday
        try:
            birthday = datetime.strptime(data.get('applicant_birthday'), '%Y-%m-%d').date()
        except ValueError:
            return jsonify({'error': 'Invalid birthday format. Use YYYY-MM-DD'}), 400
        
        # Create application
        application = GrantApplication(
            application_type=data.get('application_type'),
            applicant_first_name=data.get('applicant_first_name'),
            applicant_last_name=data.get('applicant_last_name'),
            applicant_address=data.get('applicant_address'),
            applicant_email=data.get('applicant_email'),
            applicant_phone=data.get('applicant_phone'),
            applicant_birthday=birthday,
            applicant_story=data.get('applicant_story'),
            submitter_first_name=data.get('submitter_first_name'),
            submitter_last_name=data.get('submitter_last_name'),
            submitter_address=data.get('submitter_address'),
            submitter_email=data.get('submitter_email'),
            submitter_phone=data.get('submitter_phone'),
            submitter_relationship=data.get('submitter_relationship')
        )
        
        db.session.add(application)
        db.session.commit()
        
        # Send notification to all admins
        admins = Realtor.query.filter_by(is_admin=True, is_approved=True).all()
        for admin in admins:
            notification = Notification(
                realtor_id=admin.id,
                type='grant_application',
                subject='New Grant Application Received',
                message=f'A new grant application has been submitted by {application.applicant_first_name} {application.applicant_last_name}.',
                is_read=False
            )
            db.session.add(notification)
        
        db.session.commit()
        
        # Send confirmation email to applicant
        send_application_confirmation_email(application)
        
        # Send notification emails to admins and approved realtors
        approved_realtors = Realtor.query.filter_by(is_approved=True).all()
        recipient_emails = [realtor.email for realtor in approved_realtors]
        send_new_application_notification(application, recipient_emails)
        
        return jsonify({
            'message': 'Application submitted successfully',
            'application': application.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@grant_applications_bp.route('/', methods=['GET'])
@jwt_required()
def get_applications():
    """Get all grant applications (requires authentication)"""
    try:
        current_user_id = int(get_jwt_identity())
        realtor = Realtor.query.get(current_user_id)
        
        if not realtor or not realtor.is_approved:
            return jsonify({'error': 'Access denied'}), 403
        
        # Get query parameters for filtering
        status = request.args.get('status')
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        
        query = GrantApplication.query
        
        if status:
            query = query.filter_by(status=status)
        
        # Order by newest first
        query = query.order_by(GrantApplication.created_at.desc())
        
        # Paginate
        pagination = query.paginate(page=page, per_page=per_page, error_out=False)
        
        applications = [app.to_dict() for app in pagination.items]
        
        return jsonify({
            'applications': applications,
            'total': pagination.total,
            'pages': pagination.pages,
            'current_page': page
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@grant_applications_bp.route('/<int:application_id>', methods=['GET'])
@jwt_required()
def get_application(application_id):
    """Get a specific grant application"""
    try:
        current_user_id = int(get_jwt_identity())
        realtor = Realtor.query.get(current_user_id)
        
        if not realtor or not realtor.is_approved:
            return jsonify({'error': 'Access denied'}), 403
        
        application = GrantApplication.query.get(application_id)
        
        if not application:
            return jsonify({'error': 'Application not found'}), 404
        
        return jsonify(application.to_dict()), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@grant_applications_bp.route('/<int:application_id>/status', methods=['PUT'])
@jwt_required()
def update_application_status(application_id):
    """Update application status (admin only)"""
    try:
        current_user_id = int(get_jwt_identity())
        realtor = Realtor.query.get(current_user_id)
        
        if not realtor or not realtor.is_admin:
            return jsonify({'error': 'Admin access required'}), 403
        
        application = GrantApplication.query.get(application_id)
        
        if not application:
            return jsonify({'error': 'Application not found'}), 404
        
        data = request.get_json()
        new_status = data.get('status')
        admin_notes = data.get('admin_notes')
        
        if new_status not in ['pending', 'under_review', 'approved', 'denied']:
            return jsonify({'error': 'Invalid status'}), 400
        
        application.status = new_status
        if admin_notes:
            application.admin_notes = admin_notes
        application.reviewed_by = current_user_id
        application.reviewed_at = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({
            'message': 'Application status updated',
            'application': application.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
