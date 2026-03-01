import { tableSpecies } from '../data/mockData'

function statusClass(status) {
  if (status === 'Stable' || status === 'Common') return 'status-green'
  if (status === 'Vulnerable') return 'status-orange'
  if (status === 'Protected') return 'status-purple'
  return 'status-blue'
}

function TablePage() {
  return (
    <section className="page-container standard-page">
      <div className="table-header">
        <div>
          <h1>Bird Species Database</h1>
          <p className="page-subtitle">Manage and filter ornithological data records.</p>
        </div>
        <button type="button" className="btn-primary">
          + Add New Species
        </button>
      </div>

      <div className="filters-row">
        <button type="button" className="pill">Family: All Families</button>
        <button type="button" className="pill">Size: Any Size</button>
        <button type="button" className="pill">Status: All Status</button>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Family</th>
              <th>Size</th>
              <th>Weight</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {tableSpecies.map((row) => (
              <tr key={row.name}>
                <td>{row.name}</td>
                <td>{row.family}</td>
                <td>{row.size}</td>
                <td>{row.weight}</td>
                <td>
                  <span className={`status-chip ${statusClass(row.status)}`}>
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="table-footer">
        <p>Showing 1-5 of 245 species</p>
        <button type="button" className="btn-dark">
          Exporter CSV
        </button>
      </div>
    </section>
  )
}

export default TablePage
