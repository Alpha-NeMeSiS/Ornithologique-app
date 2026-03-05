from flask import Blueprint, jsonify, request
from ..extensions import db
from ..models import Espece, Taxonomie


species_bp = Blueprint('species', __name__, url_prefix='/api/species')


@species_bp.get('')
def get_species_list():
    try:
        species = Espece.query.order_by(Espece.id_espece.asc()).all()
        return jsonify([item.to_dict() for item in species]), 200
    except Exception as error:
        print("API ERROR /api/species:", error)
        return jsonify({'message': 'Erreur base de données sur la liste des espèces.', 'detail': str(error)}), 500


@species_bp.get('/<int:species_id>')
def get_species_detail(species_id):
    try:
        species = Espece.query.get(species_id)
    except Exception as error:
        print("API ERROR /api/species/<id>:", error)
        return jsonify({'message': 'Erreur base de données sur le détail espèce.', 'detail': str(error)}), 500

    if species is None:
        return jsonify({'message': 'Espèce introuvable'}), 404

    return jsonify(species.to_dict()), 200


@species_bp.post('')
def create_species():
    data = request.get_json(silent=True) or {}

    required_fields = ['nom_commun', 'nom_scientifique', 'id_taxonomie']
    missing = [field for field in required_fields if not data.get(field)]
    if missing:
        return jsonify({'message': f"Champs manquants: {', '.join(missing)}"}), 400

    try:
        taxonomy = Taxonomie.query.get(data['id_taxonomie'])
        if taxonomy is None:
            return jsonify({'message': 'Taxonomie introuvable'}), 400

        already_exists = Espece.query.filter_by(nom_scientifique=data['nom_scientifique']).first()
        if already_exists:
            return jsonify({'message': 'Le nom scientifique existe déjà'}), 409

        species = Espece(
            nom_commun=data['nom_commun'],
            nom_scientifique=data['nom_scientifique'],
            description=data.get('description'),
            taille_cm=data.get('taille_cm'),
            poids_min_g=data.get('poids_min_g'),
            poids_max_g=data.get('poids_max_g'),
            longevite_ans=data.get('longevite_ans'),
            nombre_individus=data.get('nombre_individus'),
            id_taxonomie=data['id_taxonomie'],
        )

        db.session.add(species)
        db.session.commit()
        return jsonify(species.to_dict()), 201
    except Exception as error:
        db.session.rollback()
        print("API ERROR POST /api/species:", error)
        return jsonify({'message': "Erreur base de données lors de l'ajout de l'espèce.", 'detail': str(error)}), 500
