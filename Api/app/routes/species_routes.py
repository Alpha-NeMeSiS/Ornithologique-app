import os

from flask import Blueprint, current_app, jsonify, request
from werkzeug.utils import secure_filename

from ..extensions import db
from ..models import Auteur, Espece, Image, Taxonomie


species_bp = Blueprint('species', __name__, url_prefix='/api/species')

ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png'}


@species_bp.get('')
def get_species_list():
    try:
        search = request.args.get('search', type=str)
        family = request.args.get('family', type=str)

        query = Espece.query

        if search:
            query = query.filter(Espece.nom_commun.ilike(f'%{search}%'))

        if family and family != 'all':
            query = query.join(Taxonomie).filter(Taxonomie.famille == family)

        species = query.order_by(Espece.id_espece.asc()).all()
        return jsonify([item.to_dict() for item in species]), 200
    except Exception as error:
        print('API ERROR /api/species:', error)
        return jsonify({'message': 'Erreur base de données sur la liste des espèces.', 'detail': str(error)}), 500


@species_bp.get('/<int:species_id>')
def get_species_detail(species_id):
    try:
        species = Espece.query.get(species_id)
    except Exception as error:
        print('API ERROR /api/species/<id>:', error)
        return jsonify({'message': 'Erreur base de données sur le détail espèce.', 'detail': str(error)}), 500

    if species is None:
        return jsonify({'message': 'Espèce introuvable'}), 404

    species_data = species.to_dict()
    species_data['images'] = [
        {'chemin_image': image.chemin_image}
        for image in Image.query.filter_by(id_espece=species_id).order_by(Image.id_image.asc()).all()
    ]

    return jsonify(species_data), 200


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
        print('API ERROR POST /api/species:', error)
        return jsonify({'message': "Erreur base de données lors de l'ajout de l'espèce.", 'detail': str(error)}), 500


def is_allowed_file(filename):
    if '.' not in filename:
        return False
    extension = filename.rsplit('.', 1)[1].lower()
    return extension in ALLOWED_EXTENSIONS


@species_bp.post('/<int:species_id>/image')
def upload_species_image(species_id):
    if 'image' not in request.files:
        return jsonify({'message': 'Aucun fichier image envoyé.'}), 400

    file = request.files['image']

    if not file.filename:
        return jsonify({'message': 'Nom de fichier vide.'}), 400

    if not is_allowed_file(file.filename):
        return jsonify({'message': 'Format non autorisé. Utilisez jpg, jpeg ou png.'}), 400

    try:
        species = Espece.query.get(species_id)
        if species is None:
            return jsonify({'message': 'Espèce introuvable'}), 404

        author = Auteur.query.order_by(Auteur.id_auteur.asc()).first()
        if author is None:
            author = Auteur(nom_auteur='Système', prenom_auteur='Upload')
            db.session.add(author)
            db.session.flush()

        filename = secure_filename(file.filename)
        unique_filename = f'{species_id}_{int.from_bytes(os.urandom(4), "big")}_{filename}'

        upload_folder = os.path.join(current_app.static_folder, 'uploads')
        os.makedirs(upload_folder, exist_ok=True)

        file_path = os.path.join(upload_folder, unique_filename)
        file.save(file_path)

        image = Image(
            chemin_image=f'/static/uploads/{unique_filename}',
            description_image=request.form.get('description_image'),
            id_espece=species_id,
            id_auteur=author.id_auteur,
        )

        db.session.add(image)
        db.session.commit()
        return jsonify(image.to_dict()), 201
    except Exception as error:
        db.session.rollback()
        print('API ERROR POST /api/species/<id>/image:', error)
        return jsonify({'message': "Erreur lors de l'upload de l'image.", 'detail': str(error)}), 500
