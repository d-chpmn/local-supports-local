from datetime import datetime
from extensions import db

class Donation(db.Model):
    """Donation model for tracking payments"""
    __tablename__ = 'donations'
    
    id = db.Column(db.Integer, primary_key=True)
    realtor_id = db.Column(db.Integer, db.ForeignKey('realtors.id'), nullable=False, index=True)
    transaction_id = db.Column(db.Integer, db.ForeignKey('transactions.id'), nullable=False, unique=True, index=True)
    
    # Payment Information
    amount = db.Column(db.Numeric(10, 2), nullable=False)
    payment_method = db.Column(db.String(50))  # credit_card, bank_transfer, check, etc.
    payment_reference = db.Column(db.String(200))  # Stripe payment ID, check number, etc.
    payment_status = db.Column(db.String(20), default='completed', nullable=False)  # completed, pending, failed
    
    # Marketing
    thank_you_image_generated = db.Column(db.Boolean, default=False)
    thank_you_image_url = db.Column(db.String(500))
    social_media_shared = db.Column(db.Boolean, default=False)
    
    # Timestamps
    paid_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'id': self.id,
            'realtor_id': self.realtor_id,
            'transaction_id': self.transaction_id,
            'amount': float(self.amount),
            'payment_method': self.payment_method,
            'payment_reference': self.payment_reference,
            'payment_status': self.payment_status,
            'thank_you_image_generated': self.thank_you_image_generated,
            'thank_you_image_url': self.thank_you_image_url,
            'social_media_shared': self.social_media_shared,
            'paid_at': self.paid_at.isoformat() if self.paid_at else None,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
    
    def __repr__(self):
        return f'<Donation {self.id} ${self.amount}>'
