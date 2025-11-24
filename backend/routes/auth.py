from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from extensions import db
from models.realtor import Realtor
from models.notification import Notification
from email_validator import validate_email, EmailNotValidError
from utils.email_service import send_realtor_welcome_email, send_admin_notification_new_realtor

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new realtor"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['email', 'password', 'first_name', 'last_name', 'donation_amount_per_transaction']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({'error': f'{field} is required'}), 400
        
        # Validate email
        try:
            email_info = validate_email(data['email'], check_deliverability=False)
            email = email_info.normalized
        except EmailNotValidError as e:
            return jsonify({'error': str(e)}), 400
        
        # Check if email already exists
        if Realtor.query.filter_by(email=email).first():
            return jsonify({'error': 'Email already registered'}), 409
        
        # Validate donation amount
        try:
            donation_amount = float(data['donation_amount_per_transaction'])
            if donation_amount < 0:
                return jsonify({'error': 'Donation amount must be positive'}), 400
        except (ValueError, TypeError):
            return jsonify({'error': 'Invalid donation amount'}), 400
        
        # Create new realtor
        realtor = Realtor(
            email=email,
            first_name=data['first_name'],
            last_name=data['last_name'],
            phone=data.get('phone'),
            brokerage=data.get('brokerage'),
            license_number=data.get('license_number'),
            donation_amount_per_transaction=donation_amount,
            bio=data.get('bio'),
            is_approved=True,
            approval_status='approved'
        )
        realtor.set_password(data['password'])
        
        db.session.add(realtor)
        db.session.commit()
        
        # Send welcome email to the new realtor
        send_realtor_welcome_email(realtor)
        
        # Send notification to all admins about new registration
        admins = Realtor.query.filter_by(is_admin=True, is_approved=True).all()
        for admin in admins:
            notification = Notification(
                realtor_id=admin.id,
                type='new_realtor_registration',
                subject='New Realtor Registration',
                message=f'New realtor registration: {realtor.first_name} {realtor.last_name} ({realtor.email}) - requires approval.',
                is_read=False
            )
            db.session.add(notification)
        
        # Send email notification to admins
        send_admin_notification_new_realtor(realtor)
        
        db.session.commit()
        
        # Create tokens
        access_token = create_access_token(identity=str(realtor.id))
        refresh_token = create_refresh_token(identity=str(realtor.id))
        
        return jsonify({
            'message': 'Registration successful',
            'realtor': realtor.to_dict(),
            'access_token': access_token,
            'refresh_token': refresh_token
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    """Login a realtor"""
    try:
        data = request.get_json()
        
        if not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Email and password are required'}), 400
        
        # Find realtor
        realtor = Realtor.query.filter_by(email=data['email']).first()
        
        if not realtor or not realtor.check_password(data['password']):
            return jsonify({'error': 'Invalid email or password'}), 401
        
        if not realtor.is_active:
            return jsonify({'error': 'Account is inactive'}), 403
        
        # Create tokens
        access_token = create_access_token(identity=str(realtor.id))
        refresh_token = create_refresh_token(identity=str(realtor.id))
        
        return jsonify({
            'message': 'Login successful',
            'realtor': realtor.to_dict(),
            'access_token': access_token,
            'refresh_token': refresh_token
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    """Refresh access token"""
    try:
        identity = get_jwt_identity()
        access_token = create_access_token(identity=str(identity))
        return jsonify({'access_token': access_token}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/verify', methods=['GET'])
@jwt_required()
def verify():
    """Verify JWT token and return current user"""
    try:
        realtor_id = get_jwt_identity()
        realtor = Realtor.query.get(realtor_id)
        
        if not realtor:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({
            'valid': True,
            'realtor': realtor.to_dict()
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    """Logout (client should delete token)"""
    # In a production app, you might want to blacklist the token
    return jsonify({'message': 'Logout successful'}), 200

