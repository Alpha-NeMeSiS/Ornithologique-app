import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getSpecies } from '../services/api'

function SpeciesListPage() {
  const [speciesList, setSpeciesList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchSpeciesList() {
      try {
        const data = await getSpecies()
        setSpeciesList(data)
      } catch (fetchError) {
        setError(fetchError.message)
      } finally {
        setLoading(false)
      }
    }

    fetchSpeciesList()
  }, [])

  return (
    <section className="page-container standard-page">
      <h1>Annuaire des espèces</h1>
      <p className="page-subtitle">
        Explorez et identifiez des espèces d&apos;oiseaux avec des photos haute
        définition.
      </p>

      <input
        type="text"
        className="search-input"
        placeholder="Rechercher par nom commun ou scientifique"
      />

      <div className="filters-row">
        <button type="button" className="pill active">
          Tous les oiseaux
        </button>
        <button type="button" className="pill">
          Passereaux
        </button>
        <button type="button" className="pill">
          Rapaces
        </button>
        <button type="button" className="pill">
          Oiseaux d&apos;eau
        </button>
      </div>

      {loading && <p>Chargement de la liste...</p>}
      {!loading && error && <p className="info-message">{error}</p>}
      {!loading && !error && speciesList.length === 0 && (
        <p className="info-message">Aucune espèce enregistrée pour le moment.</p>
      )}

      {!loading && !error && speciesList.length > 0 && (
        <div className="species-grid">
          {speciesList.map((bird, index) => (
            <article key={bird.id_espece} className="species-card">
              <div className="photo-placeholder">Photo {index + 1}</div>
              <h3>{bird.nom_commun}</h3>
              <p>{bird.nom_scientifique}</p>
              <button
                type="button"
                className="btn-light full-width"
                onClick={() => navigate(`/species/${bird.id_espece}`)}
              >
                Voir fiche
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default SpeciesListPage
