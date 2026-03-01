function SpeciesDetailPage() {
  return (
    <section className="page-container standard-page">
      <div className="detail-hero">
        <img
          src="https://images.unsplash.com/photo-1465101162946-4377e57745c3?auto=format&fit=crop&w=1200&q=80"
          alt="Héron"
        />
        <div className="overlay">
          <span className="danger-badge">Statut critique</span>
          <h1>Héron cendré (Ardea cinerea)</h1>
        </div>
      </div>

      <div className="detail-layout">
        <div>
          <h2>Description</h2>
          <p>
            Le héron cendré est une espèce d&apos;oiseau de la famille des Ardéidés.
            On le trouve surtout près des lacs, rivières et étangs.
          </p>

          <h2>Caractéristiques</h2>
          <div className="stats-section compact">
            <article>
              <h3>84 - 102 cm</h3>
              <p>Taille</p>
            </article>
            <article>
              <h3>155 - 175 cm</h3>
              <p>Envergure</p>
            </article>
            <article>
              <h3>1.0 - 2.1 kg</h3>
              <p>Poids</p>
            </article>
          </div>

          <h2>Répartition géographique</h2>
          <div className="map-placeholder">Carte de répartition</div>
        </div>

        <aside>
          <article className="side-card">
            <h3>Taxonomie</h3>
            <p>
              <strong>Ordre :</strong> Pelecaniformes
            </p>
            <p>
              <strong>Famille :</strong> Ardeidae
            </p>
            <p>
              <strong>Genre :</strong> Ardea
            </p>
          </article>

          <article className="side-card">
            <h3>Statut de conservation</h3>
            <span className="status-red">EN</span>
            <p>En danger</p>
          </article>
        </aside>
      </div>
    </section>
  )
}

export default SpeciesDetailPage
