from flask import Flask, jsonify

from .extensions import cors, db
from .routes.species_routes import species_bp


DEFAULT_SQLITE_URI = "sqlite:///ornitho.db"


def create_app():
    app = Flask(__name__)
    app.config["SQLALCHEMY_DATABASE_URI"] = DEFAULT_SQLITE_URI
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.init_app(app)
    cors.init_app(app)

    app.register_blueprint(species_bp)

    @app.get("/")
    def healthcheck():
        return jsonify({"message": "API Ornithologique en ligne"}), 200

    return app
