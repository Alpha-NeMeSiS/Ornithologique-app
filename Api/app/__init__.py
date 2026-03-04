from pathlib import Path

from flask import Flask, jsonify

from .extensions import cors, db
from .routes.meta_routes import meta_bp
from .routes.species_routes import species_bp
from .routes.meta_routes import meta_bp


BASE_DIR = Path(__file__).resolve().parents[1]
INSTANCE_DIR = BASE_DIR / 'instance'
DEFAULT_SQLITE_URI = f"sqlite:///{(INSTANCE_DIR / 'ornitho.db').as_posix()}"


def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = DEFAULT_SQLITE_URI
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    INSTANCE_DIR.mkdir(parents=True, exist_ok=True)

    db.init_app(app)
    cors.init_app(app)

    app.register_blueprint(species_bp)
    app.register_blueprint(meta_bp)

    with app.app_context():
        db.create_all()

    @app.get('/')
    def healthcheck():
        return jsonify({'message': 'API Ornithologique en ligne'}), 200

    @app.get('/api/health')
    def api_healthcheck():
        return jsonify({'message': 'API OK'}), 200

    return app
