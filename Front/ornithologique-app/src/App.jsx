import { useEffect, useMemo, useState } from 'react'
import './App.css'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000'

const views = {
  home: 'Accueil',
  list: 'Liste des espèces',
  add: 'Ajouter une espèce',
  detect: 'Détection IA',
  export: 'Export base de données',
}

const initialForm = {
  nom_commun: '',
  nom_scientifique: '',
  description: '',
  taille_cm: '',
  poids_min_g: '',
  poids_max_g: '',
  longevite_ans: '',
  nombre_individus: '',
  id_taxonomie: '',
}

function App() {
  const [activeView, setActiveView] = useState('home')
  const [species, setSpecies] = useState([])
  const [selectedSpeciesId, setSelectedSpeciesId] = useState(null)
  const [selectedSpecies, setSelectedSpecies] = useState(null)
  const [isLoadingList, setIsLoadingList] = useState(false)
  const [isLoadingDetail, setIsLoadingDetail] = useState(false)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [formData, setFormData] = useState(initialForm)
  const [submitMessage, setSubmitMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [detectResult, setDetectResult] = useState('')
  const [isDetecting, setIsDetecting] = useState(false)
  const [exportResult, setExportResult] = useState('')
  const [isExporting, setIsExporting] = useState(false)

  useEffect(() => {
    fetchSpecies()
  }, [])

  useEffect(() => {
    if (!selectedSpeciesId) return

    const loadSpeciesDetail = async () => {
      setIsLoadingDetail(true)
      setError('')

      try {
        const response = await fetch(`${API_BASE_URL}/api/species/${selectedSpeciesId}`)
        if (!response.ok) {
          throw new Error('Impossible de récupérer le détail de cette espèce.')
        }

        const payload = await response.json()
        setSelectedSpecies(payload)
      } catch (fetchError) {
        setError(fetchError.message)
      } finally {
        setIsLoadingDetail(false)
      }
    }

    loadSpeciesDetail()
  }, [selectedSpeciesId])

  const fetchSpecies = async () => {
    setIsLoadingList(true)
    setError('')

    try {
      const response = await fetch(`${API_BASE_URL}/api/species`)
      if (!response.ok) {
        throw new Error('Impossible de charger les espèces depuis l’API Flask.')
      }

      const payload = await response.json()
      setSpecies(payload)
    } catch (fetchError) {
      setError(fetchError.message)
    } finally {
      setIsLoadingList(false)
    }
  }

  const filteredSpecies = useMemo(() => {
    const lowerQuery = query.trim().toLowerCase()
    if (!lowerQuery) return species

    return species.filter((item) => {
      return (
        item.nom_commun?.toLowerCase().includes(lowerQuery) ||
        item.nom_scientifique?.toLowerCase().includes(lowerQuery) ||
        item.taxonomie?.famille?.toLowerCase().includes(lowerQuery)
      )
    })
  }, [query, species])

  const taxonomyOptions = useMemo(() => {
    const map = new Map()
    species.forEach((item) => {
      if (!item.taxonomie?.id_taxonomie) return
      if (!map.has(item.taxonomie.id_taxonomie)) {
        map.set(item.taxonomie.id_taxonomie, item.taxonomie)
      }
    })
    return [...map.values()]
  }, [species])

  const openSpeciesDetail = (id) => {
    setSelectedSpeciesId(id)
    setSelectedSpecies(null)
    setActiveView('list')
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleCreateSpecies = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage('')

    const payload = {
      ...formData,
      taille_cm: formData.taille_cm ? Number(formData.taille_cm) : null,
      poids_min_g: formData.poids_min_g ? Number(formData.poids_min_g) : null,
      poids_max_g: formData.poids_max_g ? Number(formData.poids_max_g) : null,
      longevite_ans: formData.longevite_ans ? Number(formData.longevite_ans) : null,
      nombre_individus: formData.nombre_individus ? Number(formData.nombre_individus) : null,
      id_taxonomie: Number(formData.id_taxonomie),
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/species`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const responsePayload = await response.json()
      if (!response.ok) {
        throw new Error(responsePayload.message ?? 'Échec lors de la création de l’espèce.')
      }

      setSubmitMessage(`Espèce créée : ${responsePayload.nom_commun}`)
      setFormData(initialForm)
      await fetchSpecies()
      setActiveView('list')
      setSelectedSpeciesId(responsePayload.id_espece)
    } catch (submitError) {
      setSubmitMessage(submitError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDetectSpecies = async (event) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const imageFile = form.get('photo')

    if (!(imageFile instanceof File) || imageFile.size === 0) {
      setDetectResult('Veuillez sélectionner une image avant de lancer la détection.')
      return
    }

    const body = new FormData()
    body.append('photo', imageFile)

    setIsDetecting(true)
    setDetectResult('')

    try {
      const response = await fetch(`${API_BASE_URL}/api/detection`, {
        method: 'POST',
        body,
      })
      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload.message ?? 'Erreur de détection IA côté API.')
      }

      setDetectResult(`Espèce détectée : ${payload.espece ?? 'résultat indisponible'}`)
    } catch (detectError) {
      setDetectResult(detectError.message)
    } finally {
      setIsDetecting(false)
    }
  }

  const handleExport = async () => {
    setIsExporting(true)
    setExportResult('')

    try {
      const response = await fetch(`${API_BASE_URL}/api/export`, {
        method: 'POST',
      })
      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload.message ?? 'Erreur d’export de la base.')
      }

      setExportResult(payload.message ?? 'Export réalisé avec succès.')
    } catch (exportError) {
      setExportResult(exportError.message)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Ornithologique</p>
          <h1>Gestion des espèces d’oiseaux</h1>
        </div>
        <p className="api-target">API: {API_BASE_URL}</p>
      </header>

      <nav className="nav-grid">
        {Object.entries(views).map(([key, label]) => (
          <button
            key={key}
            className={`nav-btn ${activeView === key ? 'is-active' : ''}`}
            onClick={() => setActiveView(key)}
            type="button"
          >
            {label}
          </button>
        ))}
      </nav>

      {error && <p className="feedback error">{error}</p>}

      {activeView === 'home' && (
        <section className="panel">
          <h2>Accueil</h2>
          <p>
            Cette interface React consomme l’API Flask pour lire, créer et consulter les espèces
            enregistrées en base PostgreSQL.
          </p>
          <div className="stats-grid">
            <article>
              <strong>{species.length}</strong>
              <span>espèces référencées</span>
            </article>
            <article>
              <strong>{taxonomyOptions.length}</strong>
              <span>taxonomies détectées</span>
            </article>
          </div>
        </section>
      )}

      {activeView === 'list' && (
        <section className="panel two-cols">
          <div>
            <h2>Liste des espèces</h2>
            <input
              className="search-input"
              placeholder="Rechercher nom commun, scientifique, famille"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            {isLoadingList ? (
              <p>Chargement de la liste...</p>
            ) : (
              <ul className="species-list">
                {filteredSpecies.map((item) => (
                  <li key={item.id_espece}>
                    <button type="button" onClick={() => openSpeciesDetail(item.id_espece)}>
                      <span>{item.nom_commun}</span>
                      <em>{item.nom_scientifique}</em>
                    </button>
                  </li>
                ))}
                {filteredSpecies.length === 0 && <li>Aucun résultat.</li>}
              </ul>
            )}
          </div>

          <div>
            <h3>Détail espèce</h3>
            {!selectedSpeciesId && <p>Sélectionnez une espèce pour afficher son détail.</p>}
            {isLoadingDetail && <p>Chargement du détail...</p>}
            {selectedSpecies && !isLoadingDetail && (
              <article className="species-card">
                <h4>{selectedSpecies.nom_commun}</h4>
                <p className="latin">{selectedSpecies.nom_scientifique}</p>
                <p>{selectedSpecies.description || 'Pas de description.'}</p>
                <dl>
                  <dt>Taille</dt>
                  <dd>{selectedSpecies.taille_cm ?? 'N/A'} cm</dd>
                  <dt>Poids</dt>
                  <dd>
                    {selectedSpecies.poids_min_g ?? 'N/A'} - {selectedSpecies.poids_max_g ?? 'N/A'} g
                  </dd>
                  <dt>Longévité</dt>
                  <dd>{selectedSpecies.longevite_ans ?? 'N/A'} ans</dd>
                  <dt>Population</dt>
                  <dd>{selectedSpecies.nombre_individus ?? 'N/A'}</dd>
                  <dt>Famille</dt>
                  <dd>{selectedSpecies.taxonomie?.famille ?? 'N/A'}</dd>
                </dl>
              </article>
            )}
          </div>
        </section>
      )}

      {activeView === 'add' && (
        <section className="panel">
          <h2>Ajouter une espèce</h2>
          <form className="species-form" onSubmit={handleCreateSpecies}>
            <label>
              Nom commun
              <input name="nom_commun" value={formData.nom_commun} onChange={handleInputChange} required />
            </label>
            <label>
              Nom scientifique
              <input
                name="nom_scientifique"
                value={formData.nom_scientifique}
                onChange={handleInputChange}
                required
              />
            </label>
            <label className="full-width">
              Description
              <textarea name="description" value={formData.description} onChange={handleInputChange} rows="3" />
            </label>
            <label>
              Taille (cm)
              <input name="taille_cm" type="number" step="0.1" value={formData.taille_cm} onChange={handleInputChange} />
            </label>
            <label>
              Poids min (g)
              <input name="poids_min_g" type="number" value={formData.poids_min_g} onChange={handleInputChange} />
            </label>
            <label>
              Poids max (g)
              <input name="poids_max_g" type="number" value={formData.poids_max_g} onChange={handleInputChange} />
            </label>
            <label>
              Longévité (ans)
              <input name="longevite_ans" type="number" value={formData.longevite_ans} onChange={handleInputChange} />
            </label>
            <label>
              Nombre d’individus
              <input
                name="nombre_individus"
                type="number"
                value={formData.nombre_individus}
                onChange={handleInputChange}
              />
            </label>
            <label>
              Taxonomie
              <select name="id_taxonomie" value={formData.id_taxonomie} onChange={handleInputChange} required>
                <option value="">Sélectionnez...</option>
                {taxonomyOptions.map((taxonomie) => (
                  <option key={taxonomie.id_taxonomie} value={taxonomie.id_taxonomie}>
                    #{taxonomie.id_taxonomie} · {taxonomie.ordre} / {taxonomie.famille} / {taxonomie.genre}
                  </option>
                ))}
              </select>
            </label>
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Création...' : 'Créer l’espèce'}
            </button>
          </form>
          {submitMessage && <p className="feedback">{submitMessage}</p>}
          {taxonomyOptions.length === 0 && (
            <p className="feedback warning">
              Aucune taxonomie détectée depuis l’API. Vérifiez les données en base PostgreSQL.
            </p>
          )}
        </section>
      )}

      {activeView === 'detect' && (
        <section className="panel">
          <h2>Détection IA</h2>
          <form className="stack" onSubmit={handleDetectSpecies}>
            <input name="photo" type="file" accept="image/*" />
            <button type="submit" disabled={isDetecting}>
              {isDetecting ? 'Analyse...' : 'Lancer la détection'}
            </button>
          </form>
          {detectResult && <p className="feedback">{detectResult}</p>}
        </section>
      )}

      {activeView === 'export' && (
        <section className="panel">
          <h2>Export base de données</h2>
          <p>Déclenche un export via l’API Flask (qui gère ensuite PostgreSQL).</p>
          <button type="button" onClick={handleExport} disabled={isExporting}>
            {isExporting ? 'Export en cours...' : 'Exporter la base'}
          </button>
          {exportResult && <p className="feedback">{exportResult}</p>}
        </section>
      )}
    </div>
  )
}

export default App
