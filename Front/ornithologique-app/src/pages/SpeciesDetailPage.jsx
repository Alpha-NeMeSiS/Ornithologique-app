import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getSpeciesById, uploadSpeciesImage } from '../services/api'

function formatWeight(minWeight, maxWeight) {
  if (!minWeight && !maxWeight) return 'Non renseigné'
  if (!minWeight) return `${maxWeight} g max`
  if (!maxWeight) return `${minWeight} g min`
  return `${minWeight} g - ${maxWeight} g`
}

function SpeciesDetailPage() {
  const { id } = useParams()
  const [species, setSpecies] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notFound, setNotFound] = useState(false)
  const [image, setImage] = useState(null)
  const [uploadLoading, setUploadLoading] = useState(false)
  const [uploadMessage, setUploadMessage] = useState('')

  const fetchSpeciesDetail = useCallback(async () => {
    setLoading(true)
    setError('')
    setNotFound(false)

    try {
      const data = await getSpeciesById(id)
      setSpecies(data)
    } catch (fetchError) {
      if (fetchError.message.toLowerCase().includes('introuvable')) {
        setNotFound(true)
      } else {
        setError(fetchError.message)
      }
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchSpeciesDetail()
  }, [fetchSpeciesDetail])

  async function handleUploadImage() {
    if (!image) {
      setUploadMessage('Veuillez sélectionner une image.')
      return
    }

    setUploadLoading(true)
    setUploadMessage('')

    try {
      await uploadSpeciesImage(id, image)
      setImage(null)
      setUploadMessage('Image ajoutée avec succès.')
      await fetchSpeciesDetail()
    } catch (uploadError) {
      setUploadMessage(uploadError.message)
    } finally {
      setUploadLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="page-container standard-page">
        <h1>Chargement...</h1>
      </section>
    )
  }

  if (notFound) {
    return (
      <section className="page-container standard-page">
        <h1>Espèce introuvable</h1>
        <p className="page-subtitle">La fiche demandée n&apos;existe pas (404).</p>
        <Link to="/species" className="btn-light detail-back-link">
          Retour à la liste
        </Link>
      </section>
    )
  }

  if (error || !species) {
    return (
      <section className="page-container standard-page">
        <h1>Erreur</h1>
        <p className="page-subtitle">{error || 'Une erreur est survenue.'}</p>
      </section>
    )
  }

  const countries = species.pays || []

  return (
    <section className="page-container standard-page species-detail-page">
      <div className="detail-hero">
        {species.images?.[0]?.chemin_image && (
          <img
            src={`${species.images?.[0]?.chemin_image}`}
            alt={species.nom_commun}
          />
        )}
        <div className="overlay">
          <h1>{species.nom_commun}</h1>
          <p>{species.nom_scientifique}</p>
        </div>
      </div>

      <div className="detail-layout">
        <div>
          <h2>Description</h2>
          <p>{species.description || 'Description non renseignée.'}</p>

          <h2>Caractéristiques</h2>
          <div className="stats-section compact">
            <article>
              <h3>{species.taille_cm ? `${species.taille_cm} cm` : 'Non renseigné'}</h3>
              <p>Taille</p>
            </article>
            <article>
              <h3>{formatWeight(species.poids_min_g, species.poids_max_g)}</h3>
              <p>Poids</p>
            </article>
            <article>
              <h3>{species.longevite_ans ? `${species.longevite_ans} ans` : 'Non renseigné'}</h3>
              <p>Longévité</p>
            </article>
            <article>
              <h3>{species.nombre_individus || 'Non renseigné'}</h3>
              <p>Population</p>
            </article>
          </div>

          <h2>Pays liés</h2>
          {countries.length > 0 ? (
            <ul className="countries-list">
              {countries.map((country) => (
                <li key={country.id_pays}>{country.nom_pays}</li>
              ))}
            </ul>
          ) : (
            <p>Aucun pays lié à cette espèce.</p>
          )}
        </div>

        <aside>
          <article className="side-card">
            <h3>Taxonomie</h3>
            <p>
              <strong>Ordre :</strong> {species.taxonomie?.ordre || 'Non renseigné'}
            </p>
            <p>
              <strong>Famille :</strong> {species.taxonomie?.famille || 'Non renseigné'}
            </p>
            <p>
              <strong>Genre :</strong> {species.taxonomie?.genre || 'Non renseigné'}
            </p>
          </article>

          <article className="side-card">
            <h3>Ajouter une image</h3>
            <input
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={(event) => setImage(event.target.files?.[0] || null)}
            />
            <button
              type="button"
              className="btn-primary full-width"
              onClick={handleUploadImage}
              disabled={uploadLoading}
            >
              {uploadLoading ? 'Upload...' : 'Ajouter une image'}
            </button>
            {uploadMessage && <p>{uploadMessage}</p>}
          </article>

          <Link to="/species" className="btn-light detail-back-link">
            ← Retour à la liste
          </Link>
        </aside>
      </div>
    </section>
  )
}

export default SpeciesDetailPage
