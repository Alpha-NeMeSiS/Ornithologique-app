import os
from urllib.parse import quote_plus

from flask import Flask, jsonify
from sqlalchemy import inspect, text
from sqlalchemy.exc import SQLAlchemyError

from .extensions import cors, db
from .routes.meta_routes import meta_bp
from .routes.species_routes import species_bp
from .routes.meta_routes import meta_bp


def build_database_uri():
    database_url = os.getenv('DATABASE_URL')
    if database_url:
        return database_url

    db_user = os.getenv('DB_USER', 'postgres')
    db_password = os.getenv('DB_PASSWORD', 'postgres')
    db_host = os.getenv('DB_HOST', 'localhost')
    db_port = os.getenv('DB_PORT', '5433')
    db_name = os.getenv('DB_NAME', 'ornithologique DB')

    encoded_password = quote_plus(db_password)
    encoded_db_name = quote_plus(db_name)

    return f'postgresql+psycopg2://{db_user}:{encoded_password}@{db_host}:{db_port}/{encoded_db_name}'


DEFAULT_DATABASE_URI = build_database_uri()


def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = DEFAULT_DATABASE_URI
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)
    cors.init_app(app)

    app.register_blueprint(species_bp)
    app.register_blueprint(meta_bp)

    @app.get('/')
    def healthcheck():
        return jsonify({'message': 'API Ornithologique en ligne'}), 200

    @app.get('/api/health')
    def api_healthcheck():
        try:
            db.session.execute(text('SELECT 1'))
            inspector = inspect(db.engine)
            tables = inspector.get_table_names()

            return (
                jsonify(
                    {
                        'message': 'API OK',
                        'database': 'connected',
                        'db_host': os.getenv('DB_HOST', 'localhost'),
                        'db_port': os.getenv('DB_PORT', '5433'),
                        'db_name': os.getenv('DB_NAME', 'ornithologique DB'),
                        'tables_count': len(tables),
                    }
                ),
                200,
            )
        except SQLAlchemyError as error:
            return (
                jsonify(
                    {
                        'message': 'Connexion base impossible',
                        'error': str(error),
                        'db_host': os.getenv('DB_HOST', 'localhost'),
                        'db_port': os.getenv('DB_PORT', '5433'),
                        'db_name': os.getenv('DB_NAME', 'ornithologique DB'),
                    }
                ),
                500,
            )

    return app
