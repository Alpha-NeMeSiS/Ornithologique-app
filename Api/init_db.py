from datetime import date

from app import create_app
from app.extensions import db
from app.models import Auteur, Espece, Image, Pays, Taxonomie


def seed_data():
    if Taxonomie.query.first():
        return

    taxonomies = [
        Taxonomie(ordre="Passeriformes", famille="Turdidae", genre="Turdus"),
        Taxonomie(ordre="Passeriformes", famille="Passeridae", genre="Passer"),
        Taxonomie(ordre="Passeriformes", famille="Muscicapidae", genre="Erithacus"),
    ]
    db.session.add_all(taxonomies)

    auteurs = [
        Auteur(nom_auteur="Sharp", prenom_auteur="Charles J."),
        Auteur(nom_auteur="Friel", prenom_auteur="David"),
    ]
    db.session.add_all(auteurs)

    pays = [
        Pays(nom_pays="Royaume-Uni", code_iso="GBR"),
        Pays(nom_pays="France", code_iso="FRA"),
    ]
    db.session.add_all(pays)
    db.session.flush()

    species = [
        Espece(
            nom_commun="Merle noir",
            nom_scientifique="Turdus merula",
            description="Passereau commun des jardins.",
            taille_cm=24.5,
            poids_min_g=80,
            poids_max_g=100,
            longevite_ans=3,
            id_taxonomie=taxonomies[0].id_taxonomie,
            pays=pays,
        ),
        Espece(
            nom_commun="Moineau domestique",
            nom_scientifique="Passer domesticus",
            description="Petit passereau urbain.",
            taille_cm=14.5,
            poids_min_g=24,
            poids_max_g=38,
            longevite_ans=3,
            id_taxonomie=taxonomies[1].id_taxonomie,
            pays=pays,
        ),
    ]
    db.session.add_all(species)
    db.session.flush()

    images = [
        Image(
            chemin_image="https://commons.wikimedia.org/wiki/File%3ACommon_Blackbird_%28turdus_merula%29.jpg",
            date_ajout=date(2014, 3, 29),
            description_image="Photo d'un merle noir adulte mâle.",
            id_espece=species[0].id_espece,
            id_auteur=auteurs[0].id_auteur,
        )
    ]
    db.session.add_all(images)

    db.session.commit()


if __name__ == "__main__":
    app = create_app()
    with app.app_context():
        db.create_all()
        seed_data()
        print("Base SQLite initialisée avec des données de démo.")
