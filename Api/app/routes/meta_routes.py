from datetime import date
import csv
import io

from flask import Blueprint, Response, jsonify, request
from ..extensions import db
from ..models import Espece, Image, Pays, Taxonomie


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
    except Exception as error:
        print("API ERROR /api/taxonomies:", error)
        return jsonify({'message': 'Erreur base de données sur les taxonomies.', 'detail': str(error)}), 500


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
    except Exception as error:
        print("API ERROR /api/countries:", error)
        return jsonify({'message': 'Erreur base de données sur les pays.', 'detail': str(error)}), 500


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
    except Exception as error:
        db.session.rollback()
        print("API ERROR POST /api/images:", error)
        return jsonify({'message': "Erreur base de données lors de l'ajout de l'image.", 'detail': str(error)}), 500


@meta_bp.get('/export/csv')
def export_species_csv():
    try:
        species = Espece.query.order_by(Espece.id_espece.asc()).all()

        output = io.StringIO()
        writer = csv.writer(output)

        writer.writerow([
            'id_espece',
            'nom_commun',
            'nom_scientifique',
            'taille_cm',
            'poids_min_g',
            'poids_max_g',
        ])

        for item in species:
            writer.writerow([
                item.id_espece,
                item.nom_commun,
                item.nom_scientifique,
                item.taille_cm,
                item.poids_min_g,
                item.poids_max_g,
            ])

        return Response(
            output.getvalue(),
            mimetype='text/csv',
            headers={'Content-Disposition': 'attachment; filename=especes.csv'},
        )
    except Exception as error:
        print('API ERROR /api/export/csv:', error)
        return jsonify({'message': "Erreur lors de l'export CSV.", 'detail': str(error)}), 500
