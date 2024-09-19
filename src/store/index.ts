import type { FuelStation } from '@/types'
import { computed, reactive } from 'vue'

interface StoreState {
  fuelStations: FuelStation[]
  search: string
  sortAZ: boolean
  activeStation: FuelStation | null
}

export const state = reactive<StoreState>({
  fuelStations: [],
  search: '',
  sortAZ: true,
  activeStation: null
})

export const getters = {
  getFuelStations: computed(() => {
    return state.fuelStations
  }),
  getSearch: computed(() => {
    return state.search
  }),
  getSortAZ: computed(() => {
    return state.sortAZ
  }),
  getActiveStation: computed(() => {
    return state.activeStation
  }),
  filteredAndSortedFuelStations: computed(() => {
    const filtered = state.fuelStations.filter((station: FuelStation) => {
      return station.adresse.toLowerCase().includes(state.search.toLowerCase())
    })
    const sortedAndFiltered = filtered.sort((a, b) => {
      return state.sortAZ ? a.adresse.localeCompare(b.adresse) : b.adresse.localeCompare(a.adresse)
    })
    return sortedAndFiltered
  })
}

export const actions = {
  requestFuelData: async () => {
    try {
      const response = await fetch(
        'https://geoportal.stadt-koeln.de/arcgis/rest/services/verkehr/gefahrgutstrecken/MapServer/0/query?where=objectid+is+not+null&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&distance=&units=esriSRUnit_Foot&relationParam=&outFields=*&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=4326&havingClause=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&historicMoment=&returnDistinctValues=false&resultOffset=&resultRecordCount=&returnExtentOnly=false&datumTransformation=&parameterValues=&rangeValues=&quantizationParameters=&featureEncoding=esriDefault&f=pjson'
      )
      const data = await response.json()
      const mappedData = data.features.map(
        (feature: any) =>
          ({
            ...feature.attributes,
            geometry: feature.geometry
          }) as FuelStation[]
      )
      state.fuelStations = mappedData
    } catch (error) {
      throw new Error('Failed to fetch data')
    }
  },
  setSearch(search: string) {
    state.search = search
  },
  setSortAZ(mode: boolean) {
    state.sortAZ = mode
  },
  setActiveStation(station: FuelStation | null) {
    state.activeStation = station
  }
}
