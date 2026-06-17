import os
from datetime import timedelta

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

class Config:
    SQLALCHEMY_DATABASE_URI = f"sqlite:///{os.path.join(BASE_DIR, 'instance', 'ecommerce.db')}"
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Load JWT secret from environment. Required in production.
    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY")
    if not JWT_SECRET_KEY:
        # If running in production, fail fast to avoid using a weak default.
        if os.environ.get("FLASK_ENV") == "production" or os.environ.get("ENV") == "production":
            raise RuntimeError("JWT_SECRET_KEY environment variable is required in production")
        # Fallback for development/testing only
        JWT_SECRET_KEY = "change-this-in-development"

    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=2)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)

    