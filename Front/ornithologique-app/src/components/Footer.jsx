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
         <Link to="/"
           <p>Accueil</p>
          </Link>
          <Link to="/species"
            <p>Liste des espèces</p>
      </div>
      <div>
        <h4>Outils</h4>
        <Link to="/detect"
          <p>Détection IA</p>
        </Link>
        <Link to="/add"
          <p>Ajouter une observation</p>
        </Link>
        <Link to="/table"
          <p>Exporter CSV</p>
        </Link>
      </div>
    </footer>
  )
}

export default Footer
