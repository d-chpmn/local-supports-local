"""
Email service for sending notifications.
Uses SendGrid for email delivery.
"""
import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, Email, To, Content
from flask import current_app

def send_email(to_email, subject, html_content, from_name="Local Supports Local"):
    """
    Send an email using SendGrid.
    
    Args:
        to_email: Recipient email address
        subject: Email subject line
        html_content: HTML content of the email
        from_name: Name to display as sender
    
    Returns:
        Boolean indicating success
    """
    try:
        sendgrid_api_key = current_app.config.get('SENDGRID_API_KEY')
        from_email = current_app.config.get('FROM_EMAIL', 'noreply@localmortgage.com')
        
        if not sendgrid_api_key:
            current_app.logger.warning("SENDGRID_API_KEY not configured. Email not sent.")
            # For development/demo, just log the email
            current_app.logger.info(f"[EMAIL] To: {to_email}, Subject: {subject}")
            return True
        
        message = Mail(
            from_email=Email(from_email, from_name),
            to_emails=To(to_email),
            subject=subject,
            html_content=Content("text/html", html_content)
        )
        
        sg = SendGridAPIClient(sendgrid_api_key)
        response = sg.send(message)
        
        current_app.logger.info(f"Email sent to {to_email}: {subject} (Status: {response.status_code})")
        return True
        
    except Exception as e:
        current_app.logger.error(f"Error sending email to {to_email}: {str(e)}")
        return False


def send_realtor_welcome_email(realtor):
    """
    Send welcome email to newly registered realtor.
    """
    subject = "Welcome to Local Supports Local Foundation!"
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background-color: #00305B; color: white; padding: 30px; text-align: center; }}
            .content {{ padding: 30px; background-color: #f9f9f9; }}
            .button {{ 
                display: inline-block; 
                padding: 12px 30px; 
                background-color: #FEBC42; 
                color: #00305B; 
                text-decoration: none; 
                border-radius: 5px;
                font-weight: bold;
                margin: 20px 0;
            }}
            .footer {{ padding: 20px; text-align: center; color: #666; font-size: 12px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Welcome to Local Supports Local!</h1>
            </div>
            <div class="content">
                <h2>Hi {realtor.first_name},</h2>
                <p>Thank you for joining the Local Supports Local Foundation as a realtor member!</p>
                
                <p>Your account is currently pending approval. Our admin team will review your registration and approve your access shortly.</p>
                
                <p><strong>What happens next:</strong></p>
                <ul>
                    <li>Our admin team will review your registration within 24-48 hours</li>
                    <li>You'll receive an email notification once your account is approved</li>
                    <li>Once approved, you can access the full realtor dashboard and submit grant applications</li>
                </ul>
                
                <p>In the meantime, you can log in to view your account status and learn more about our foundation's mission.</p>
                
                <a href="{current_app.config.get('FRONTEND_URL', 'http://localhost:3000')}/login" class="button">
                    Go to Dashboard
                </a>
                
                <p>If you have any questions, feel free to reach out to our team.</p>
                
                <p>Best regards,<br>
                <strong>Local Supports Local Foundation Team</strong></p>
            </div>
            <div class="footer">
                <p>&copy; 2025 Local Supports Local Foundation. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    return send_email(realtor.email, subject, html_content)


def send_realtor_approval_email(realtor):
    """
    Send approval notification email to realtor.
    """
    subject = "Your Local Supports Local Account Has Been Approved!"
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background-color: #00305B; color: white; padding: 30px; text-align: center; }}
            .content {{ padding: 30px; background-color: #f9f9f9; }}
            .success-badge {{ 
                background-color: #4CAF50; 
                color: white; 
                padding: 10px 20px; 
                border-radius: 20px;
                display: inline-block;
                margin: 20px 0;
            }}
            .button {{ 
                display: inline-block; 
                padding: 12px 30px; 
                background-color: #FEBC42; 
                color: #00305B; 
                text-decoration: none; 
                border-radius: 5px;
                font-weight: bold;
                margin: 20px 0;
            }}
            .footer {{ padding: 20px; text-align: center; color: #666; font-size: 12px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎉 You're Approved!</h1>
            </div>
            <div class="content">
                <div class="success-badge">✓ Account Approved</div>
                
                <h2>Hi {realtor.first_name},</h2>
                <p>Great news! Your Local Supports Local Foundation realtor account has been approved.</p>
                
                <p><strong>You now have full access to:</strong></p>
                <ul>
                    <li>Submit grant applications on behalf of community members</li>
                    <li>View all grant applications in the dashboard</li>
                    <li>Track application statuses</li>
                    <li>Access foundation resources and updates</li>
                </ul>
                
                <a href="{current_app.config.get('FRONTEND_URL', 'http://localhost:3000')}/dashboard" class="button">
                    Access Your Dashboard
                </a>
                
                <p>Thank you for being part of our mission to support our local community!</p>
                
                <p>Best regards,<br>
                <strong>Local Supports Local Foundation Team</strong></p>
            </div>
            <div class="footer">
                <p>&copy; 2025 Local Supports Local Foundation. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    return send_email(realtor.email, subject, html_content)


def send_application_confirmation_email(application):
    """
    Send confirmation email to grant applicant.
    """
    subject = "Your Grant Application Has Been Received"
    
    applicant_name = application.applicant_name
    applicant_email = application.applicant_email
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background-color: #00305B; color: white; padding: 30px; text-align: center; }}
            .content {{ padding: 30px; background-color: #f9f9f9; }}
            .info-box {{ 
                background-color: #e3f2fd; 
                border-left: 4px solid #00305B; 
                padding: 15px; 
                margin: 20px 0;
            }}
            .footer {{ padding: 20px; text-align: center; color: #666; font-size: 12px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Application Received!</h1>
            </div>
            <div class="content">
                <h2>Hi {applicant_name},</h2>
                <p>Thank you for applying for a grant through Local Supports Local Foundation.</p>
                
                <div class="info-box">
                    <strong>Application ID:</strong> {application.id}<br>
                    <strong>Date Submitted:</strong> {application.created_at.strftime('%B %d, %Y')}<br>
                    <strong>Status:</strong> Pending Review
                </div>
                
                <p><strong>What happens next:</strong></p>
                <ol>
                    <li>Our team will review your application within 5-7 business days</li>
                    <li>We may contact you if additional information is needed</li>
                    <li>You'll receive an email notification with our decision</li>
                </ol>
                
                <p>Please save your Application ID for your records: <strong>{application.id}</strong></p>
                
                <p>If you have any questions about your application, please don't hesitate to reach out.</p>
                
                <p>Best regards,<br>
                <strong>Local Supports Local Foundation Team</strong></p>
            </div>
            <div class="footer">
                <p>&copy; 2025 Local Supports Local Foundation. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    return send_email(applicant_email, subject, html_content)


def send_new_application_notification(application, recipients):
    """
    Send notification to admins/realtors about new grant application.
    
    Args:
        application: GrantApplication object
        recipients: List of email addresses to notify
    """
    subject = f"New Grant Application Received - {application.applicant_name}"
    
    application_url = f"{current_app.config.get('FRONTEND_URL', 'http://localhost:3000')}/grant-applications/{application.id}"
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background-color: #00305B; color: white; padding: 30px; text-align: center; }}
            .content {{ padding: 30px; background-color: #f9f9f9; }}
            .info-box {{ 
                background-color: #fff; 
                border: 2px solid #FEBC42; 
                padding: 20px; 
                margin: 20px 0;
                border-radius: 5px;
            }}
            .button {{ 
                display: inline-block; 
                padding: 12px 30px; 
                background-color: #FEBC42; 
                color: #00305B; 
                text-decoration: none; 
                border-radius: 5px;
                font-weight: bold;
                margin: 20px 0;
            }}
            .footer {{ padding: 20px; text-align: center; color: #666; font-size: 12px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>📋 New Grant Application</h1>
            </div>
            <div class="content">
                <h2>New Application Received</h2>
                <p>A new grant application has been submitted and is awaiting review.</p>
                
                <div class="info-box">
                    <strong>Application ID:</strong> {application.id}<br>
                    <strong>Applicant Name:</strong> {application.applicant_name}<br>
                    <strong>Applicant Email:</strong> {application.applicant_email}<br>
                    <strong>Application Type:</strong> {application.application_type.replace('_', ' ').title()}<br>
                    <strong>Date Submitted:</strong> {application.created_at.strftime('%B %d, %Y at %I:%M %p')}<br>
                    <strong>Status:</strong> Pending Review
                </div>
                
                <a href="{application_url}" class="button">
                    View Application Details
                </a>
                
                <p>Please log in to the admin dashboard to review this application.</p>
            </div>
            <div class="footer">
                <p>&copy; 2025 Local Supports Local Foundation. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    success = True
    for recipient in recipients:
        if not send_email(recipient, subject, html_content):
            success = False
    
    return success


def send_admin_notification_new_realtor(realtor):
    """
    Send notification to admins about new realtor registration.
    """
    subject = f"New Realtor Registration - {realtor.first_name} {realtor.last_name}"
    
    # Get all admin emails
    from models.realtor import Realtor
    admins = Realtor.query.filter_by(is_admin=True).all()
    admin_emails = [admin.email for admin in admins]
    
    if not admin_emails:
        current_app.logger.warning("No admin users found to send notification")
        return False
    
    dashboard_url = f"{current_app.config.get('FRONTEND_URL', 'http://localhost:3000')}/admin"
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background-color: #00305B; color: white; padding: 30px; text-align: center; }}
            .content {{ padding: 30px; background-color: #f9f9f9; }}
            .info-box {{ 
                background-color: #fff; 
                border: 2px solid #FEBC42; 
                padding: 20px; 
                margin: 20px 0;
                border-radius: 5px;
            }}
            .button {{ 
                display: inline-block; 
                padding: 12px 30px; 
                background-color: #FEBC42; 
                color: #00305B; 
                text-decoration: none; 
                border-radius: 5px;
                font-weight: bold;
                margin: 20px 0;
            }}
            .footer {{ padding: 20px; text-align: center; color: #666; font-size: 12px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>👤 New Realtor Registration</h1>
            </div>
            <div class="content">
                <h2>Approval Required</h2>
                <p>A new realtor has registered and is awaiting approval to access the platform.</p>
                
                <div class="info-box">
                    <strong>Name:</strong> {realtor.first_name} {realtor.last_name}<br>
                    <strong>Email:</strong> {realtor.email}<br>
                    <strong>Phone:</strong> {realtor.phone or 'Not provided'}<br>
                    <strong>Brokerage:</strong> {realtor.brokerage or 'Not provided'}<br>
                    <strong>License #:</strong> {realtor.license_number or 'Not provided'}<br>
                    <strong>Registration Date:</strong> {realtor.created_at.strftime('%B %d, %Y at %I:%M %p')}
                </div>
                
                <a href="{dashboard_url}" class="button">
                    Review & Approve
                </a>
                
                <p>Please log in to the admin dashboard to approve or deny this registration.</p>
            </div>
            <div class="footer">
                <p>&copy; 2025 Local Supports Local Foundation. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    success = True
    for admin_email in admin_emails:
        if not send_email(admin_email, subject, html_content):
            success = False
    
    return success
