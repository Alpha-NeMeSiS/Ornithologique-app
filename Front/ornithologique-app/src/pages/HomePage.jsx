import { featuredBirds } from '../data/mockData'

function HomePage() {
  return (
    <>
      <section className="hero-section page-container">
        <div>
          <span className="badge">Observation IA</span>
          <h1>
            Bienvenue sur <span>Ornitho-App</span>
          </h1>
          <p>
            Découvrez, identifiez et partagez vos observations ornithologiques
            avec notre communauté de passionnés.
          </p>
          <div className="actions-row">
            <button type="button" className="btn-primary">
              Explorer les espèces
            </button>
            <button type="button" className="btn-light">
              Ajouter une espèce
            </button>
          </div>
          <button type="button" className="btn-dark">
            ✨ Détection IA
          </button>
        </div>
        <div className="hero-image">
          <img
            src="https://images.unsplash.com/photo-1489493887464-892be6d1daae?auto=format&fit=crop&w=900&q=80"
            alt="Oiseau coloré"
          />
        </div>
      </section>

      <section className="stats-section page-container">
        <article>
          <h2>150</h2>
          <p>Espèces répertoriées</p>
        </article>
        <article>
          <h2>1200</h2>
          <p>Photos partagées</p>
        </article>
        <article>
          <h2>85</h2>
          <p>Identifications IA</p>
        </article>
      </section>

      <section className="featured-section page-container">
        <div className="section-header">
          <div>
            <h2>Oiseaux en vedette</h2>
            <p>Découvrez les espèces les plus observées.</p>
          </div>
          <button type="button" className="link-btn">
            Tout voir →
          </button>
        </div>

        <div className="featured-grid">
          {featuredBirds.map((bird) => (
            <article key={bird.name} className="bird-card">
              <img src={bird.image} alt={bird.name} />
              <h3>{bird.name}</h3>
              <p>{bird.latin}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}

export default HomePage
