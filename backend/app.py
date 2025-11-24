from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from extensions import db, jwt
from config import config
import os

def create_app(config_name='development'):
    """Application factory pattern"""
    app = Flask(__name__)
    
    # Load configuration
    app.config.from_object(config[config_name])
    
    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    
    # Configure CORS - Allow all origins for demo
    CORS(app, 
         resources={r"/*": {"origins": "*"}},
         supports_credentials=True,
         allow_headers=["Content-Type", "Authorization"],
         methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])
    
    # Register blueprints
    from routes.auth import auth_bp
    from routes.realtors import realtors_bp
    from routes.transactions import transactions_bp
    from routes.donations import donations_bp
    from routes.notifications import notifications_bp
    from routes.grant_applications import grant_applications_bp
    from routes.admin import admin_bp
    from setup_admin import setup_bp
    
    app.register_blueprint(auth_bp)
    app.register_blueprint(realtors_bp)
    app.register_blueprint(transactions_bp)
    app.register_blueprint(donations_bp)
    app.register_blueprint(notifications_bp)
    app.register_blueprint(grant_applications_bp, url_prefix='/api/grant-applications')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    app.register_blueprint(setup_bp)
    
    # Serve uploaded files
    @app.route('/uploads/<path:filename>')
    def serve_upload(filename):
        upload_folder = app.config.get('UPLOAD_FOLDER', 'uploads')
        return send_from_directory(upload_folder, filename)
    
    # Health check endpoint
    @app.route('/api/health')
    def health():
        return jsonify({'status': 'healthy', 'service': 'Local Supports Local API'}), 200
    
    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Not found'}), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        db.session.rollback()
        return jsonify({'error': 'Internal server error'}), 500
    
    # JWT error handlers
    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return jsonify({'error': 'Token has expired'}), 401
    
    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return jsonify({'error': 'Invalid token'}), 401
    
    @jwt.unauthorized_loader
    def unauthorized_callback(error):
        return jsonify({'error': 'Missing authorization token'}), 401
    
    # Create database tables
    with app.app_context():
        db.create_all()
    
    return app

if __name__ == '__main__':
    app = create_app(os.getenv('FLASK_ENV', 'development'))
    app.run(debug=True, host='0.0.0.0', port=5000)


