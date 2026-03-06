import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { buildImageUrl, getFallbackImage, getSpecies } from '../services/api'

function HomePage() {
  const [featuredBirds, setFeaturedBirds] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchFeaturedBirds() {
      try {
        const data = await getSpecies()
        setFeaturedBirds(data.slice(0, 4))
      } catch {
        setFeaturedBirds([])
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedBirds()
  }, [])

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
            <Link to="/species" className="btn-primary">
              Explorer les espèces
            </Link>
            <Link to="/add" className="btn-light">
              Ajouter une espèce
            </Link>
          </div>
          <Link to="/detect" className="btn-dark inline-link">
            ✨ Détection IA
          </Link>
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
          <h2>{featuredBirds.length}</h2>
          <p>Espèces en vedette</p>
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
          <Link to="/species" className="link-btn">
            Tout voir →
          </Link>
        </div>

        {loading && <p>Chargement des espèces...</p>}
        {!loading && featuredBirds.length === 0 && (
          <p className="info-message">Aucune espèce à afficher pour le moment.</p>
        )}

        {!loading && featuredBirds.length > 0 && (
          <div className="featured-grid">
            {featuredBirds.map((bird) => {
              const fallback = getFallbackImage()
              const mainImage = bird.images?.[0]?.chemin_image || fallback

              return (
                <article key={bird.id_espece} className="bird-card">
                  <img src={buildImageUrl(mainImage)} alt={bird.nom_commun} />
                  <h3>{bird.nom_commun}</h3>
                  <p>{bird.nom_scientifique}</p>
                </article>
              )
            })}
          </div>
        )}
      </section>
    </>
  )
}

export default HomePage
