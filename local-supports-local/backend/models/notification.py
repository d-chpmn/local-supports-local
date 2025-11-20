from datetime import datetime
from extensions import db

class Notification(db.Model):
    """Notification model for in-app and email notifications"""
    __tablename__ = 'notifications'
    
    id = db.Column(db.Integer, primary_key=True)
    realtor_id = db.Column(db.Integer, db.ForeignKey('realtors.id'), nullable=False, index=True)
    
    # Notification Details
    type = db.Column(db.String(50), nullable=False)  # transaction_reminder, payment_request, thank_you, general
    subject = db.Column(db.String(200), nullable=False)
    message = db.Column(db.Text, nullable=False)
    action_url = db.Column(db.String(500))  # Link for user to take action
    
    # Status
    is_read = db.Column(db.Boolean, default=False, nullable=False)
    email_sent = db.Column(db.Boolean, default=False)
    
    # Timestamps
    sent_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    read_at = db.Column(db.DateTime)
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'id': self.id,
            'realtor_id': self.realtor_id,
            'type': self.type,
            'subject': self.subject,
            'message': self.message,
            'action_url': self.action_url,
            'is_read': self.is_read,
            'email_sent': self.email_sent,
            'sent_at': self.sent_at.isoformat() if self.sent_at else None,
            'read_at': self.read_at.isoformat() if self.read_at else None
        }
    
    def mark_as_read(self):
        """Mark notification as read"""
        if not self.is_read:
            self.is_read = True
            self.read_at = datetime.utcnow()
    
    def __repr__(self):
        return f'<Notification {self.id} {self.type}>'
