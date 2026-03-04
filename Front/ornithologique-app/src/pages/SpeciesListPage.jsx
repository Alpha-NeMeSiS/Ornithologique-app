import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { speciesCards } from '../data/mockData'

function SpeciesListPage() {
  const [speciesList, setSpeciesList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchSpecies() {
      try {
        const response = await fetch('/api/species')
        if (!response.ok) {
          throw new Error('Impossible de charger les espèces pour le moment.')
        }

        const data = await response.json()
        setSpeciesList(data)
      } catch {
        setError('API indisponible. Affichage de données de démonstration.')
      } finally {
        setLoading(false)
      }
    }

    fetchSpecies()
  }, [])

  const cardsToDisplay =
    speciesList.length > 0
      ? speciesList.map((item) => ({
          id: item.id_espece,
          name: item.nom_commun,
          latin: item.nom_scientifique,
        }))
      : speciesCards.map((item, index) => ({ ...item, id: index + 1 }))

  return (
    <section className="page-container standard-page">
      <h1>Annuaire des espèces</h1>
      <p className="page-subtitle">
        Explorez et identifiez des espèces d&apos;oiseaux avec des photos haute
        définition.
      </p>

      {loading && <p>Chargement de la liste...</p>}
      {!loading && error && <p className="info-message">{error}</p>}

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
        <button type="button" className="pill">
          Menacés
        </button>
      </div>

      <div className="species-grid">
        {cardsToDisplay.map((bird, index) => (
          <article key={`${bird.name}-${bird.id}`} className="species-card">
            <div className="photo-placeholder">Photo {index + 1}</div>
            <h3>{bird.name}</h3>
            <p>{bird.latin}</p>
            <button
              type="button"
              className="btn-light full-width"
              onClick={() => navigate(`/species/${bird.id}`)}
            >
              Voir fiche
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}

export default SpeciesListPage
