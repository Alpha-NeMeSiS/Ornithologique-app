function DetectionPage() {
  return (
    <section className="page-container standard-page detection-layout">
      <div>
        <p className="small-title">Analyse intelligente</p>
        <h1>Identification d&apos;espèces par IA</h1>
        <p className="page-subtitle">
          Capturez ou importez une photo pour découvrir l&apos;identité de l&apos;oiseau.
        </p>

        <div className="upload-zone">
          <div className="upload-icon">⬆️</div>
          <h2>Zone de téléchargement</h2>
          <p>Glissez votre image ici ou cliquez pour choisir un fichier.</p>
          <button type="button" className="btn-light">
            Sélectionner une image
          </button>
        </div>

        <button type="button" className="btn-primary analyze-btn">
          Analyser l&apos;image
        </button>
      </div>

      <aside className="result-card">
        <img
          src="https://images.unsplash.com/photo-1462899006636-339e08d1844e?auto=format&fit=crop&w=900&q=80"
          alt="Résultat IA"
        />
        <h2>Moineau domestique</h2>
        <p className="latin-name">Passer domesticus</p>
        <p className="score">98.5% confiance</p>
        <button type="button" className="btn-dark full-width">
          Accéder à la fiche
        </button>
      </aside>
    </section>
  )
}

export default DetectionPage
