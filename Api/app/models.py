from datetime import date

from .extensions import db


class Taxonomie(db.Model):
    __tablename__ = "TAXONOMIE"

    id_taxonomie = db.Column(db.Integer, primary_key=True)
    ordre = db.Column(db.String(100), nullable=False)
    famille = db.Column(db.String(100), nullable=False)
    genre = db.Column(db.String(100), nullable=False)


class Auteur(db.Model):
    __tablename__ = "AUTEUR"

    id_auteur = db.Column(db.Integer, primary_key=True)
    nom_auteur = db.Column(db.String(100), nullable=False)
    prenom_auteur = db.Column(db.String(100))


class Pays(db.Model):
    __tablename__ = "PAYS"

    id_pays = db.Column(db.Integer, primary_key=True)
    nom_pays = db.Column(db.String(100), nullable=False, unique=True)
    code_iso = db.Column(db.String(3), unique=True)


class EspecePays(db.Model):
    __tablename__ = "ESPECE_PAYS"

    id_espece = db.Column(db.Integer, db.ForeignKey("ESPECE.id_espece"), primary_key=True)
    id_pays = db.Column(db.Integer, db.ForeignKey("PAYS.id_pays"), primary_key=True)


class Espece(db.Model):
    __tablename__ = "ESPECE"

    id_espece = db.Column(db.Integer, primary_key=True)
    nom_commun = db.Column(db.String(150), nullable=False)
    nom_scientifique = db.Column(db.String(150), nullable=False, unique=True)
    description = db.Column(db.String(1000))
    taille_cm = db.Column(db.Float)
    poids_min_g = db.Column(db.Integer)
    poids_max_g = db.Column(db.Integer)
    longevite_ans = db.Column(db.Integer)
    nombre_individus = db.Column(db.Integer)
    id_taxonomie = db.Column(db.Integer, db.ForeignKey("TAXONOMIE.id_taxonomie"), nullable=False)

    taxonomie = db.relationship("Taxonomie", backref="especes")
    images = db.relationship("Image", backref="espece", lazy=True)
    pays = db.relationship("Pays", secondary="ESPECE_PAYS", lazy="subquery")

    def to_dict(self):
        return {
            "id_espece": self.id_espece,
            "nom_commun": self.nom_commun,
            "nom_scientifique": self.nom_scientifique,
            "description": self.description,
            "taille_cm": self.taille_cm,
            "poids_min_g": self.poids_min_g,
            "poids_max_g": self.poids_max_g,
            "longevite_ans": self.longevite_ans,
            "nombre_individus": self.nombre_individus,
            "taxonomie": {
                "id_taxonomie": self.taxonomie.id_taxonomie,
                "ordre": self.taxonomie.ordre,
                "famille": self.taxonomie.famille,
                "genre": self.taxonomie.genre,
            }
            if self.taxonomie
            else None,
            "pays": [
                {"id_pays": p.id_pays, "nom_pays": p.nom_pays, "code_iso": p.code_iso}
                for p in self.pays
            ],
            "images": [img.to_dict() for img in self.images],
        }


class Image(db.Model):
    __tablename__ = "IMAGE"

    id_image = db.Column(db.Integer, primary_key=True)
    chemin_image = db.Column(db.String(255), nullable=False)
    date_ajout = db.Column(db.Date, default=date.today)
    description_image = db.Column(db.String(255))
    id_espece = db.Column(db.Integer, db.ForeignKey("ESPECE.id_espece"), nullable=False)
    id_auteur = db.Column(db.Integer, db.ForeignKey("AUTEUR.id_auteur"), nullable=False)

    auteur = db.relationship("Auteur", backref="images")

    def to_dict(self):
        return {
            "id_image": self.id_image,
            "chemin_image": self.chemin_image,
            "date_ajout": self.date_ajout.isoformat() if self.date_ajout else None,
            "description_image": self.description_image,
            "auteur": {
                "id_auteur": self.auteur.id_auteur,
                "nom_auteur": self.auteur.nom_auteur,
                "prenom_auteur": self.auteur.prenom_auteur,
            }
            if self.auteur
            else None,
        }
