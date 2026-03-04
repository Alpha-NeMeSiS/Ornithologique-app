from datetime import date

from flask import Blueprint, jsonify, request
from sqlalchemy.exc import SQLAlchemyError

from ..extensions import db
from ..models import Image, Pays, Taxonomie


meta_bp = Blueprint('meta', __name__, url_prefix='/api')


@meta_bp.get('/taxonomies')
def get_taxonomies():
    try:
        taxonomies = Taxonomie.query.order_by(Taxonomie.id_taxonomie.asc()).all()
        data = [
            {
                'id_taxonomie': taxonomy.id_taxonomie,
                'ordre': taxonomy.ordre,
                'famille': taxonomy.famille,
                'genre': taxonomy.genre,
            }
            for taxonomy in taxonomies
        ]
        return jsonify(data), 200
    except SQLAlchemyError:
        return jsonify({'message': 'Erreur base de données sur les taxonomies.'}), 500


@meta_bp.get('/countries')
def get_countries():
    try:
        countries = Pays.query.order_by(Pays.nom_pays.asc()).all()
        data = [
            {
                'id_pays': country.id_pays,
                'nom_pays': country.nom_pays,
                'code_iso': country.code_iso,
            }
            for country in countries
        ]
        return jsonify(data), 200
    except SQLAlchemyError:
        return jsonify({'message': 'Erreur base de données sur les pays.'}), 500


@meta_bp.post('/images')
def create_image():
    data = request.get_json(silent=True) or {}

    required_fields = ['chemin_image', 'id_espece', 'id_auteur']
    missing = [field for field in required_fields if not data.get(field)]
    if missing:
        return jsonify({'message': f"Champs manquants: {', '.join(missing)}"}), 400

    try:
        image = Image(
            chemin_image=data['chemin_image'],
            description_image=data.get('description_image'),
            id_espece=data['id_espece'],
            id_auteur=data['id_auteur'],
            date_ajout=date.today(),
        )

        db.session.add(image)
        db.session.commit()
        return jsonify(image.to_dict()), 201
    except SQLAlchemyError:
        db.session.rollback()
        return jsonify({'message': "Erreur base de données lors de l'ajout de l'image."}), 500
