from datetime import datetime
from extensions import db

class Transaction(db.Model):
    """Transaction model for monthly closed deals reporting"""
    __tablename__ = 'transactions'
    
    id = db.Column(db.Integer, primary_key=True)
    realtor_id = db.Column(db.Integer, db.ForeignKey('realtors.id'), nullable=False, index=True)
    
    # Time Period
    month = db.Column(db.Integer, nullable=False)  # 1-12
    year = db.Column(db.Integer, nullable=False)
    
    # Transaction Data
    closed_transactions_count = db.Column(db.Integer, nullable=False, default=0)
    calculated_donation_amount = db.Column(db.Numeric(10, 2), nullable=False, default=0.00)
    
    # Status
    status = db.Column(db.String(20), default='pending', nullable=False)  # pending, paid, overdue
    
    # Timestamps
    submitted_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationships
    donation = db.relationship('Donation', backref='transaction', uselist=False, cascade='all, delete-orphan')
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'id': self.id,
            'realtor_id': self.realtor_id,
            'month': self.month,
            'year': self.year,
            'closed_transactions_count': self.closed_transactions_count,
            'calculated_donation_amount': float(self.calculated_donation_amount),
            'status': self.status,
            'submitted_at': self.submitted_at.isoformat() if self.submitted_at else None,
            'has_donation': self.donation is not None
        }
    
    def get_period_display(self):
        """Get human-readable period"""
        months = ['January', 'February', 'March', 'April', 'May', 'June',
                  'July', 'August', 'September', 'October', 'November', 'December']
        return f"{months[self.month - 1]} {self.year}"
    
    __table_args__ = (
        db.UniqueConstraint('realtor_id', 'month', 'year', name='unique_realtor_month_year'),
    )
    
    def __repr__(self):
        return f'<Transaction {self.realtor_id} {self.month}/{self.year}>'
