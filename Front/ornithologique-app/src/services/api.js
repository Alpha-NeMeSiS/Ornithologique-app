const API_BASE_URL = '/api'

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, options)

  let data = null
  try {
    data = await response.json()
  } catch {
    data = null
  }

  if (!response.ok) {
    const message = data?.message || 'Erreur API'
    throw new Error(message)
  }

  return data
}

export function getSpecies() {
  return request('/species')
}

export function getSpeciesById(id) {
  return request(`/species/${id}`)
}

export function createSpecies(speciesData) {
  return request('/species', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(speciesData),
  })
}

export function getTaxonomies() {
  return request('/taxonomies')
}

export function getCountries() {
  return request('/countries')
}

export function createImage(imageData) {
  return request('/images', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(imageData),
  })
}
