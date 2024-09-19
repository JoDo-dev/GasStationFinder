<template>
  <div ref="map" class="map"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import type { FuelStation } from '../types'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { actions, getters } from '../store'

const props = defineProps<{
  fuelStations: FuelStation[]
  activeStation: FuelStation | null
  highlightedStations: FuelStation[]
}>()

const emit = defineEmits(['markerClicked'])

const map = ref<string | HTMLElement>()
const lMap = ref<L.Map>()
const highlightedStations = ref<FuelStation[]>([])

const { getSearch, filteredAndSortedFuelStations, getFuelStations, getActiveStation } = getters
const { setActiveStation } = actions

const initMap = () => {
  if (!map.value) return
  lMap.value = L.map(map.value, {
    center: [50.938056, 6.956944],
    zoomControl: false,
    zoom: 13
  })
}

const addTileLayer = () => {
  if (!lMap.value) return
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(lMap.value)
}

const addMarkers = () => {
  props.fuelStations.map((station) => {
    if (!lMap.value) return
    const { geometry } = station
    const marker = L.marker([geometry.y, geometry.x]).addTo(lMap.value)
    marker.getElement()?.classList.add('map__marker')
    marker.on('click', () => emit('markerClicked', station))
    station.marker = marker
  })
}

const setActiveMarker = (station: FuelStation) => {
  if (!lMap.value) return
  const { marker, geometry } = station
  lMap.value.setView([geometry.y, geometry.x], 15)
  getFuelStations.value.forEach(({ marker }) => {
    if (!marker) return
    marker.getElement()?.classList.remove('map__marker--active')
    marker.setOpacity(0.6)
  })
  if (!marker) return
  marker.getElement()?.classList.add('map__marker--active')
  marker.setOpacity(1)
}

onMounted(() => {
  initMap()
  addTileLayer()
  addMarkers()
})

watch(
  getActiveStation,
  (station) => {
    if (!station || !lMap.value) return
    setActiveMarker(station)
  }
)

watch(
  highlightedStations,
  (stations) => {
    if (!lMap.value) return
    props.fuelStations.forEach(({ marker }) => {
      if (!marker) return
      marker.getElement()?.classList.remove('map__marker--active')
      marker.setOpacity(0.4)
    })
    stations.forEach((station) => {
      if (!station.marker) return
      station.marker.setOpacity(1)
    })
  }
)

watch(getSearch, () => {
  if (filteredAndSortedFuelStations.value.length) {
    setHighlightedStations(filteredAndSortedFuelStations.value)
  }
});

const setHighlightedStations = (stations: FuelStation[]) => {
  highlightedStations.value = []
  setActiveStation(null)
  stations.forEach((station: FuelStation) => {
    highlightedStations.value.push(station)
  })
}
</script>

<style lang="scss">
.map {
  height: 100vh;
  width: 100vw;

  &__marker {
    transition: opacity filter 0.5s;

    &--active {
      filter: hue-rotate(130deg);
    }
  }
}
</style>
