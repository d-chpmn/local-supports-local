from datetime import datetime
from extensions import db
import bcrypt

class Realtor(db.Model):
    """Realtor model for foundation members"""
    __tablename__ = 'realtors'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    
    # Personal Information
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20))
    
    # Professional Information
    brokerage = db.Column(db.String(200))
    license_number = db.Column(db.String(50))
    
    # Donation Configuration
    donation_amount_per_transaction = db.Column(db.Numeric(10, 2), nullable=False, default=0.00)
    
    # Profile
    headshot_url = db.Column(db.String(500))
    bio = db.Column(db.Text)
    
    # Status
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    email_verified = db.Column(db.Boolean, default=False)
    is_approved = db.Column(db.Boolean, default=False, nullable=False)  # Admin approval required
    is_admin = db.Column(db.Boolean, default=False, nullable=False)  # Admin privileges
    approval_status = db.Column(db.String(20), default='pending')  # pending, approved, denied
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    approved_at = db.Column(db.DateTime)
    
    # Relationships
    transactions = db.relationship('Transaction', backref='realtor', lazy='dynamic', cascade='all, delete-orphan')
    donations = db.relationship('Donation', backref='realtor', lazy='dynamic', cascade='all, delete-orphan')
    notifications = db.relationship('Notification', backref='realtor', lazy='dynamic', cascade='all, delete-orphan')
    
    def set_password(self, password):
        """Hash and set password"""
        self.password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    def check_password(self, password):
        """Verify password"""
        return bcrypt.checkpw(password.encode('utf-8'), self.password_hash.encode('utf-8'))
    
    def to_dict(self, include_sensitive=False):
        """Convert to dictionary"""
        data = {
            'id': self.id,
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'phone': self.phone,
            'brokerage': self.brokerage,
            'license_number': self.license_number,
            'donation_amount_per_transaction': float(self.donation_amount_per_transaction),
            'headshot_url': self.headshot_url,
            'bio': self.bio,
            'is_active': self.is_active,
            'email_verified': self.email_verified,
            'is_approved': self.is_approved,
            'is_admin': self.is_admin,
            'approval_status': self.approval_status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'approved_at': self.approved_at.isoformat() if self.approved_at else None
        }
        return data
    
    def get_full_name(self):
        """Get full name"""
        return f"{self.first_name} {self.last_name}"
    
    def __repr__(self):
        return f'<Realtor {self.email}>'
