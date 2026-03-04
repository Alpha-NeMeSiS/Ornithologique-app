import './Navbar.css'

function Navbar({ currentPage, onChangePage }) {
  const links = [
    { key: 'home', label: 'Accueil' },
    { key: 'list', label: 'Liste espèces' },
    { key: 'detail', label: 'Détail espèce' },
    { key: 'add', label: 'Ajouter' },
    { key: 'table', label: 'Tableau' },
    { key: 'detect', label: 'Détection IA' },
  ]

  return (
    <header className="main-navbar">
      <div className="brand">🪶 Ornitho-App</div>
      <nav>
        {links.map((link) => (
          <button
            key={link.key}
            type="button"
            className={currentPage === link.key ? 'active' : ''}
            onClick={() => onChangePage(link.key)}
          >
            {link.label}
          </button>
        ))}
      </nav>
      <button type="button" className="login-btn">
        Connexion
      </button>
    </header>
  )
}

export default Navbar
