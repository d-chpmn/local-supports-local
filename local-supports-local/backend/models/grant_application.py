from extensions import db
from datetime import datetime

class GrantApplication(db.Model):
    __tablename__ = 'grant_applications'
    
    id = db.Column(db.Integer, primary_key=True)
    
    # Application Type
    application_type = db.Column(db.String(50), nullable=False)  # 'self' or 'someone_else'
    
    # Applicant Information
    applicant_first_name = db.Column(db.String(100), nullable=False)
    applicant_last_name = db.Column(db.String(100), nullable=False)
    applicant_address = db.Column(db.String(500), nullable=False)
    applicant_email = db.Column(db.String(120), nullable=False)
    applicant_phone = db.Column(db.String(20), nullable=False)
    applicant_birthday = db.Column(db.Date, nullable=False)
    applicant_story = db.Column(db.Text, nullable=False)
    
    # Submitter Information (if applying for someone else)
    submitter_first_name = db.Column(db.String(100))
    submitter_last_name = db.Column(db.String(100))
    submitter_address = db.Column(db.String(500))
    submitter_email = db.Column(db.String(120))
    submitter_phone = db.Column(db.String(20))
    submitter_relationship = db.Column(db.String(200))
    
    # Application Status
    status = db.Column(db.String(50), default='pending')  # pending, under_review, approved, denied
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Admin notes
    admin_notes = db.Column(db.Text)
    reviewed_by = db.Column(db.Integer, db.ForeignKey('realtors.id'))
    reviewed_at = db.Column(db.DateTime)
    
    def to_dict(self):
        return {
            'id': self.id,
            'application_type': self.application_type,
            'applicant': {
                'first_name': self.applicant_first_name,
                'last_name': self.applicant_last_name,
                'address': self.applicant_address,
                'email': self.applicant_email,
                'phone': self.applicant_phone,
                'birthday': self.applicant_birthday.isoformat() if self.applicant_birthday else None,
                'story': self.applicant_story
            },
            'submitter': {
                'first_name': self.submitter_first_name,
                'last_name': self.submitter_last_name,
                'address': self.submitter_address,
                'email': self.submitter_email,
                'phone': self.submitter_phone,
                'relationship': self.submitter_relationship
            } if self.application_type == 'someone_else' else None,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'admin_notes': self.admin_notes,
            'reviewed_by': self.reviewed_by,
            'reviewed_at': self.reviewed_at.isoformat() if self.reviewed_at else None
        }
