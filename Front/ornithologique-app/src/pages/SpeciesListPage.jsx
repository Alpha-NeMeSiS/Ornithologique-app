import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getSpecies } from '../services/api'

function SpeciesListPage() {
  const [speciesList, setSpeciesList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [family, setFamily] = useState('all')
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchSpeciesList() {
      setLoading(true)
      setError('')

      try {
        const data = await getSpecies({ search, family })
        setSpeciesList(data)
      } catch (fetchError) {
        setError(fetchError.message)
      } finally {
        setLoading(false)
      }
    }

    fetchSpeciesList()
  }, [search, family])

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
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      <div className="filters-row">
        <button
          type="button"
          className={`pill ${family === 'all' ? 'active' : ''}`}
          onClick={() => setFamily('all')}
        >
          Tous les oiseaux
        </button>
        <button
          type="button"
          className={`pill ${family === 'Passereaux' ? 'active' : ''}`}
          onClick={() => setFamily('Passereaux')}
        >
          Passereaux
        </button>
        <button
          type="button"
          className={`pill ${family === 'Rapaces' ? 'active' : ''}`}
          onClick={() => setFamily('Rapaces')}
        >
          Rapaces
        </button>
        <button
          type="button"
          className={`pill ${family === "Oiseaux d'eau" ? 'active' : ''}`}
          onClick={() => setFamily("Oiseaux d'eau")}
        >
          Oiseaux d&apos;eau
        </button>
      </div>

      {loading && <p>Chargement de la liste...</p>}
      {!loading && error && <p className="info-message">{error}</p>}
      {!loading && !error && speciesList.length === 0 && (
        <p className="info-message">Aucune espèce trouvée pour cette recherche.</p>
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
