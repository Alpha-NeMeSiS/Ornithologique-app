const API_BASE_URL = '/api'
const API_SERVER_URL = 'http://localhost:5000'

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

export function getSpecies(filters = {}) {
  const params = new URLSearchParams()

  if (filters.search) {
    params.set('search', filters.search)
  }

  if (filters.family) {
    params.set('family', filters.family)
  }

  const query = params.toString()
  const path = query ? `/species?${query}` : '/species'

  return request(path)
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

export function uploadSpeciesImage(speciesId, file) {
  const formData = new FormData()
  formData.append('image', file)

  return request(`/species/${speciesId}/image`, {
    method: 'POST',
    body: formData,
  })
}

export function buildImageUrl(imagePath) {
  if (!imagePath) return ''
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath
  }

  return `${API_SERVER_URL}${imagePath}`
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
