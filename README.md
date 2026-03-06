# Ornithologique App

## Présentation

Ornithologique App est une application web permettant de consulter et gérer une base de données d'espèces d'oiseaux.

L'utilisateur peut :
- consulter un annuaire des espèces
- afficher la fiche détaillée d'un oiseau
- ajouter une nouvelle espèce
- ajouter des images aux espèces
- filtrer et rechercher des espèces
- exporter les données en CSV

Le projet est composé de :
- un **frontend React**
- une **API REST Flask**
- une **base de données PostgreSQL**

---

# Technologies utilisées

Frontend :
- React
- CSS

Backend :
- Python
- Flask
- SQLAlchemy

Base de données :
- PostgreSQL

---

# Structure du projet
Ornithologique-app
│
├── api/ # Backend Flask
├── front/ # Application React
├── database/
│ └── script.sql
├── README.md
---

# Installation et lancement

## 1 - Base de données

Installer PostgreSQL puis créer une base :
ornitho_db

Importer ensuite le script SQL :
psql -U postgres -d ornitho_db -f script.sql

---

## 2 - Lancer le backend

Se placer dans le dossier :
api

Créer l'environnement virtuel :
python -m venv .venv

Activer l'environnement :
Windows :
.venv\Scripts\activate

Installer les dépendances :
pip install -r requirements.txt

Lancer l'API :
flask run

Le backend sera disponible sur :
http://localhost:5000

---

## 3 - Lancer le frontend
Se placer dans le dossier :
front

Installer les dépendances :
npm install

Lancer l'application :
npm run dev

Le site sera disponible sur :
http://localhost:5173

---

# Fonctionnalités

- consultation des espèces
- recherche et filtrage
- ajout d'espèces
- ajout d'images
- fiche détaillée
- export CSV
