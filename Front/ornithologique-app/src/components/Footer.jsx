import './Footer.css'

function Footer() {
  return (
    <footer className="main-footer">
      <div>
        <h3>🪶 Ornitho-App</h3>
        <p>Plateforme de référence pour les passionnés d&apos;oiseaux.</p>
      </div>
      <div>
        <h4>Navigation</h4>
         <Link to="/">
           Accueil
          </Link>
          <Link to="/species">
            Liste des espèces
          </Link>
      </div>
      <div>
        <h4>Outils</h4>
        <Link to="/detect">
          Détection IA
        </Link>
        <Link to="/add">
          Ajouter une observation
        </Link>
        <Link to="/table">
          Exporter CSV
        </Link>
      </div>
    </footer>
  )
}

export default Footer
