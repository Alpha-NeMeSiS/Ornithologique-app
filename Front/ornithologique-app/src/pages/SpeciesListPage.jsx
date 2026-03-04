import { speciesCards } from '../data/mockData'

function SpeciesListPage() {
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
        <button type="button" className="pill">
          Menacés
        </button>
      </div>

      <div className="species-grid">
        {speciesCards.map((bird, index) => (
          <article key={bird.name} className="species-card">
            <div className="photo-placeholder">Photo {index + 1}</div>
            <h3>{bird.name}</h3>
            <p>{bird.latin}</p>
            <button type="button" className="btn-light full-width">
              Voir fiche
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}

export default SpeciesListPage
