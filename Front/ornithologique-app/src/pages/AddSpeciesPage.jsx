function AddSpeciesPage() {
  return (
    <section className="page-container standard-page">
      <h1>Nouvelle espèce</h1>
      <p className="page-subtitle">
        Enregistrez une nouvelle espèce dans la base partagée.
      </p>

      <form className="form-card">
        <h2>Identification</h2>
        <div className="form-grid">
          <label>
            Nom commun
            <input type="text" placeholder="ex: Rouge-gorge familier" />
          </label>
          <label>
            Nom scientifique
            <input type="text" placeholder="ex: Erithacus rubecula" />
          </label>
        </div>

        <h2>Classification & habitat</h2>
        <div className="form-grid">
          <label>
            Famille
            <select>
              <option>Sélectionnez une famille</option>
              <option>Falconidae</option>
              <option>Corvidae</option>
            </select>
          </label>
          <label>
            Statut de conservation
            <select>
              <option>Préoccupation mineure</option>
              <option>Vulnérable</option>
              <option>En danger</option>
            </select>
          </label>
        </div>

        <h2>Description détaillée</h2>
        <label>
          Description morphologique
          <textarea placeholder="Décrivez le plumage, la taille, le chant..." />
        </label>

        <label>
          Photo de référence
          <div className="upload-box">Cliquez ou glissez une image ici</div>
        </label>

        <div className="form-actions">
          <button type="button" className="btn-light">
            Annuler
          </button>
          <button type="button" className="btn-primary">
            Enregistrer l&apos;espèce
          </button>
        </div>
      </form>
    </section>
  )
}

export default AddSpeciesPage
