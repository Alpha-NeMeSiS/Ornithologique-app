## Ornitho-App

Ornitho-App est une application web de gestion et de reconnaissance d’espèces d’oiseaux.
Elle permet de consulter une base d’espèces, d’ajouter des informations et des images, puis d’utiliser un modèle d’intelligence artificielle pour identifier automatiquement une espèce à partir d’une image.

### Stack technique

* **Frontend** : React
* **API REST** : Flask
* **Backend IA** : modèle pré-entraîné via Hugging Face

---

## API Flask (version simple)

L’API est dans le dossier `Api/` et s’appuie sur les tables du schéma SQL (`TAXONOMIE`, `ESPECE`, `PAYS`, `IMAGE`, etc.).

### Lancer l’API

```bash
cd Api
python3 init_db.py
python3 run.py
```

### Endpoints disponibles

- `GET /` : test de vie de l’API.
- `GET /api/species` : liste des espèces.
- `GET /api/species/<id>` : détail d’une espèce.
- `POST /api/species` : ajout d’une espèce (payload JSON minimal : `nom_commun`, `nom_scientifique`, `id_taxonomie`).

### Exemple de payload POST

```json
{
  "nom_commun": "Mésange charbonnière",
  "nom_scientifique": "Parus major",
  "id_taxonomie": 1
}
```
