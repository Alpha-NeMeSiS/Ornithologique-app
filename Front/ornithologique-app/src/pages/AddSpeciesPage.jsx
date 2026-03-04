import { useEffect, useState } from 'react'
import { createSpecies, getTaxonomies } from '../services/api'

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

function AddSpeciesPage() {
  const [formData, setFormData] = useState(initialForm)
  const [taxonomies, setTaxonomies] = useState([])
  const [loadingTaxonomies, setLoadingTaxonomies] = useState(true)
  const [loadingSubmit, setLoadingSubmit] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    async function fetchTaxonomies() {
      try {
        const data = await getTaxonomies()
        setTaxonomies(data)
      } catch (fetchError) {
        setError(fetchError.message)
      } finally {
        setLoadingTaxonomies(false)
      }
    }

    fetchTaxonomies()
  }, [])

  function handleChange(event) {
    const { name, value } = event.target
    setFormData((previousForm) => ({
      ...previousForm,
      [name]: value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSuccessMessage('')
    setLoadingSubmit(true)

    try {
      const payload = {
        nom_commun: formData.nom_commun,
        nom_scientifique: formData.nom_scientifique,
        description: formData.description || null,
        taille_cm: formData.taille_cm ? Number(formData.taille_cm) : null,
        poids_min_g: formData.poids_min_g ? Number(formData.poids_min_g) : null,
        poids_max_g: formData.poids_max_g ? Number(formData.poids_max_g) : null,
        longevite_ans: formData.longevite_ans ? Number(formData.longevite_ans) : null,
        nombre_individus: formData.nombre_individus ? Number(formData.nombre_individus) : null,
        id_taxonomie: Number(formData.id_taxonomie),
      }

      await createSpecies(payload)
      setSuccessMessage('Espèce ajoutée avec succès.')
      setFormData(initialForm)
    } catch (submitError) {
      setError(submitError.message)
    } finally {
      setLoadingSubmit(false)
    }
  }

  return (
    <section className="page-container standard-page">
      <h1>Nouvelle espèce</h1>
      <p className="page-subtitle">
        Enregistrez une nouvelle espèce dans la base partagée.
      </p>

      {error && <p className="info-message">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}

      <form className="form-card" onSubmit={handleSubmit}>
        <h2>Identification</h2>
        <div className="form-grid">
          <label>
            Nom commun
            <input
              type="text"
              name="nom_commun"
              value={formData.nom_commun}
              onChange={handleChange}
              placeholder="ex: Rouge-gorge familier"
              required
            />
          </label>
          <label>
            Nom scientifique
            <input
              type="text"
              name="nom_scientifique"
              value={formData.nom_scientifique}
              onChange={handleChange}
              placeholder="ex: Erithacus rubecula"
              required
            />
          </label>
        </div>

        <h2>Taxonomie</h2>
        <div className="form-grid">
          <label>
            Taxonomie
            <select
              name="id_taxonomie"
              value={formData.id_taxonomie}
              onChange={handleChange}
              required
            >
              <option value="">
                {loadingTaxonomies ? 'Chargement...' : 'Sélectionnez une taxonomie'}
              </option>
              {taxonomies.map((taxonomy) => (
                <option key={taxonomy.id_taxonomie} value={taxonomy.id_taxonomie}>
                  {taxonomy.ordre} / {taxonomy.famille} / {taxonomy.genre}
                </option>
              ))}
            </select>
          </label>
        </div>

        <h2>Caractéristiques</h2>
        <div className="form-grid">
          <label>
            Taille (cm)
            <input type="number" name="taille_cm" value={formData.taille_cm} onChange={handleChange} />
          </label>
          <label>
            Poids min (g)
            <input type="number" name="poids_min_g" value={formData.poids_min_g} onChange={handleChange} />
          </label>
          <label>
            Poids max (g)
            <input type="number" name="poids_max_g" value={formData.poids_max_g} onChange={handleChange} />
          </label>
          <label>
            Longévité (ans)
            <input type="number" name="longevite_ans" value={formData.longevite_ans} onChange={handleChange} />
          </label>
          <label>
            Population
            <input
              type="number"
              name="nombre_individus"
              value={formData.nombre_individus}
              onChange={handleChange}
            />
          </label>
        </div>

        <h2>Description</h2>
        <label>
          Description morphologique
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Décrivez le plumage, la taille, le chant..."
          />
        </label>

        <div className="form-actions">
          <button type="button" className="btn-light" onClick={() => setFormData(initialForm)}>
            Annuler
          </button>
          <button type="submit" className="btn-primary" disabled={loadingSubmit}>
            {loadingSubmit ? 'Envoi...' : 'Enregistrer l\'espèce'}
          </button>
        </div>
      </form>
    </section>
  )
}

export default AddSpeciesPage
