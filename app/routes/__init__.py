from flask import Blueprint
from .version import version_bp
from .login import login_bp
from .static_users import static_users_bp
from .logout import logout_bp
from .create_account import create_account_bp
from .secure_data import secure_data_bp

def register_routes(app, conn, token_secret, token_expiration, auth):
    # Store these resources in the app's config or context if needed
    app.config['DB_CONNECTION'] = conn
    app.config['TOKEN_SECRET'] = token_secret
    app.config['TOKEN_EXPIRATION'] = token_expiration
    app.config['AUTH'] = auth
    
    # Register blueprints
    app.register_blueprint(version_bp)
    app.register_blueprint(login_bp)
    app.register_blueprint(static_users_bp)
    app.register_blueprint(logout_bp)
    app.register_blueprint(create_account_bp)
    app.register_blueprint(secure_data_bp)
