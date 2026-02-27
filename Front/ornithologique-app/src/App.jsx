import './App.css'

const featuredBirds = [
  {
    name: 'Martin-pêcheur',
    latin: 'Alcedo atthis',
    image:
      'https://images.unsplash.com/photo-1444464666168-49d633b86797?auto=format&fit=crop&w=700&q=80',
  },
  {
    name: 'Ara Macao',
    latin: 'Ara macao',
    image:
      'https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=700&q=80',
  },
  {
    name: 'Chouette effraie',
    latin: 'Tyto alba',
    image:
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=700&q=80',
  },
  {
    name: 'Mésange bleue',
    latin: 'Cyanistes caeruleus',
    image:
      'https://images.unsplash.com/photo-1501706362039-c06b2d715385?auto=format&fit=crop&w=700&q=80',
  },
]

function App() {
  return (
    <div className="page">
      <header className="topbar">
        <div className="brand">🪶 Ornitho-App</div>
        <nav>
          <a href="#">Accueil</a>
          <a href="#">Liste</a>
          <a href="#">Ajouter</a>
          <a href="#">Tableau</a>
          <a href="#">IA Détection</a>
        </nav>
        <button type="button" className="login-btn">
          Connexion
        </button>
      </header>

      <section className="hero">
        <div>
          <span className="badge">Observation IA</span>
          <h1>
            Bienvenue sur <span>Ornitho-App</span>
          </h1>
          <p>
            Découvrez, identifiez et partagez vos observations ornithologiques
            avec notre communauté de passionnés.
          </p>
          <div className="hero-actions">
            <button type="button" className="primary-btn">
              Explorer les espèces
            </button>
            <button type="button" className="ghost-btn">
              Ajouter une espèce
            </button>
          </div>
          <button type="button" className="ia-btn">
            ✨ Détection IA
          </button>
        </div>

        <div className="hero-image">
          <img
            src="https://images.unsplash.com/photo-1444464666168-49d633b86797?auto=format&fit=crop&w=900&q=80"
            alt="Oiseau coloré"
          />
        </div>
      </section>

      <section className="stats">
        <article>
          <p className="icon">💚</p>
          <h2>150</h2>
          <p>Espèces répertoriées</p>
        </article>
        <article>
          <p className="icon">🖼️</p>
          <h2>1200</h2>
          <p>Photos partagées</p>
        </article>
        <article>
          <p className="icon">🎯</p>
          <h2>85</h2>
          <p>Identifications IA</p>
        </article>
      </section>

      <section className="featured">
        <div className="featured-header">
          <div>
            <h2>Oiseaux en vedette</h2>
            <p>Découvrez les espèces les plus observées ce mois-ci.</p>
          </div>
          <a href="#">Tout voir →</a>
        </div>

        <div className="cards">
          {featuredBirds.map((bird) => (
            <article key={bird.name} className="bird-card">
              <img src={bird.image} alt={bird.name} />
              <h3>{bird.name}</h3>
              <p>{bird.latin}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="footer">
        <div>
          <h3>🪶 Ornitho-App</h3>
          <p>La plateforme de référence pour les amateurs d&apos;oiseaux.</p>
        </div>
        <div>
          <h4>Navigation</h4>
          <p>Accueil</p>
          <p>Liste des espèces</p>
          <p>Carte interactive</p>
        </div>
        <div>
          <h4>Outils</h4>
          <p>Détection IA</p>
          <p>Ajouter une observation</p>
          <p>Tableau de bord</p>
        </div>
      </footer>
    </div>
  )
}

export default App
