import { NavLink } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
  const links = [
    { to: '/', label: 'Accueil' },
    { to: '/species', label: 'Espèces' },
    { to: '/add', label: 'Ajouter' },
    { to: '/table', label: 'Tableau' },
    { to: '/detect', label: 'Détection IA' },
  ]

  return (
    <header className="main-navbar">
      <div className="brand">🪶 Ornitho-App</div>
      <nav>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => (isActive ? 'active' : '')}
            end={link.to === '/'}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
      <button type="button" className="login-btn">
        Connexion
      </button>
    </header>
  )
}

export default Navbar
