import { Loader } from '@googlemaps/js-api-loader'

let loaderInstance: Loader | null = null
let loadPromise: Promise<void> | null = null

export async function loadGoogleMaps() {
  // Return existing promise if already loading
  if (loadPromise) {
    return loadPromise
  }

  // Create loader only once
  if (!loaderInstance) {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    if (!apiKey) {
      throw new Error('Google Maps API key not found')
    }

    loaderInstance = new Loader({
      apiKey,
      version: 'weekly',
      libraries: ['places', 'geometry'] // Include all libraries needed
    })
  }

  // Create and store the promise
  loadPromise = loaderInstance.load()
  return loadPromise
}