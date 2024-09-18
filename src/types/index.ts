export interface GeoData {
  x: number
  y: number
}

export interface FuelStation {
  objectid: number
  adresse: string
  geometry: GeoData
  marker: L.Marker | any
}
