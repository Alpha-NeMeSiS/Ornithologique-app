import { useEffect, useState } from 'react'
import { getSpecies } from '../services/api'

function TablePage() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchRows() {
      try {
        const data = await getSpecies()
        setRows(data)
      } catch (fetchError) {
        setError(fetchError.message)
      } finally {
        setLoading(false)
      }
    }

    fetchRows()
  }, [])

  return (
    <section className="page-container standard-page">
      <div className="table-header">
        <div>
          <h1>Bird Species Database</h1>
          <p className="page-subtitle">Manage and filter ornithological data records.</p>
        </div>
      </div>

      {loading && <p>Chargement du tableau...</p>}
      {!loading && error && <p className="info-message">{error}</p>}
      {!loading && !error && rows.length === 0 && (
        <p className="info-message">Aucune donnée disponible.</p>
      )}

      {!loading && !error && rows.length > 0 && (
        <div className="table-wrapper">
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Nom scientifique</th>
                  <th>Famille</th>
                  <th>Taille</th>
                  <th>Poids</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id_espece}>
                    <td>{row.nom_commun}</td>
                    <td>{row.nom_scientifique}</td>
                    <td>{row.taxonomie?.famille || '-'}</td>
                    <td>{row.taille_cm ? `${row.taille_cm} cm` : '-'}</td>
                    <td>
                      {row.poids_min_g && row.poids_max_g
                        ? `${row.poids_min_g} - ${row.poids_max_g} g`
                        : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  )
}

export default TablePage
