<script setup lang="ts">
import FilterBar from './components/FilterBar.vue'
import Card from './components/Card.vue'
import Map from './components/Map.vue'
import IconSearch from './components/icons/IconSearch.vue'
import IconAngle from './components/icons/IconAngle.vue'
import type { FuelStation } from './types'
import { computed, ref, watch, useTemplateRef, nextTick } from 'vue'

const fuelStations = ref<FuelStation[]>([] as FuelStation[])
const activeStation = ref<FuelStation | null>(null)
const heighlightedStations = ref<FuelStation[]>([])
const search = ref<string>('')
const sortAsc = ref<boolean>(true)
const stations = useTemplateRef('stations')
const listToggled = ref<boolean>(false)

const filteredStations = computed((): FuelStation[] => {
  const searchedStations = search.value.length
    ? fuelStations.value.filter((station) =>
        station.adresse.toLowerCase().includes(search.value.toLowerCase())
      )
    : fuelStations.value
  const sortedStations = sortAsc.value
    ? searchedStations.sort((a, b) => a.adresse.localeCompare(b.adresse))
    : searchedStations.sort((a, b) => b.adresse.localeCompare(a.adresse))
  return sortedStations
})

const getFuelData = async () => {
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
    const sortedByID = mappedData.sort((a: FuelStation, b: FuelStation) => a.objectid - b.objectid)
    fuelStations.value = sortedByID
  } catch (error) {
    throw new Error('Failed to fetch data')
  }
}


getFuelData()

watch(search, () => {
  if (filteredStations.value.length) {
    setHeighlightedStations(filteredStations.value)
  }
})

const setSortMode = (mode: boolean) => {
  sortAsc.value = mode
}

const setSearch = (newSearch: string) => {
  search.value = newSearch
}

const setHeighlightedStations = (stations: FuelStation[]) => {
  heighlightedStations.value = []
  activeStation.value = null
  stations.forEach((station: FuelStation) => {
    heighlightedStations.value.push(station)
  })
}
const setActiveStation = (station: FuelStation) => {
  if (!filteredStations.value.find((st) => station.objectid === st.objectid)) {
    search.value = ''
  }
  nextTick(() => {
    if (station) {
      listToggled.value = true
      activeStation.value = station
      const stationElement = stations.value?.$el.querySelector(`#station-${station.objectid}`)
      if (stationElement) {
        stationElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  })
}
</script>

<template>
  <main class="main">
    <div class="stations" :class="{ 'stations--toggled': listToggled }">
      <button class="stations__toggle" @click="listToggled = !listToggled">
        <IconAngle
          class="stations__toggle-icon"
          :class="{ 'stations__toggle-icon--turned': !listToggled }"
        />
      </button>
      <FilterBar @sortClicked="setSortMode" @searchChanged="setSearch" :parent-search="search" />
      <transition-group
        v-if="filteredStations.length"
        ref="stations"
        name="fade"
        tag="ul"
        class="stations__list"
      >
        <card
          :key="`station-${item.objectid}`"
          v-for="item in filteredStations"
          :id="`station-${item.objectid}`"
          :station="item"
          :isActive="activeStation !== null && activeStation.objectid === item.objectid"
          @showOnMap="setActiveStation"
        />
      </transition-group>
      <div v-else class="stations__empty">
        <IconSearch class="stations__icon" />
        <p>Keine Tankstellen gefunden</p>
      </div>
    </div>
    <Map
      class="map"
      v-if="fuelStations.length"
      :fuelStations="fuelStations"
      :activeStation="activeStation"
      :heighlightedStations="heighlightedStations"
      @markerClicked="setActiveStation"
    />
  </main>
</template>

<style lang="scss">
* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  font-family: 'Roboto', sans-serif;
  height: 100vh;
  width: 100vw;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  transform: translate(0, 10px);
  opacity: 0;
}

.main {
  position: relative;
  height: 100vh;
  width: 100vw;
}

.map {
  position: absolute;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
}

.stations {
  position: absolute;
  z-index: 999;
  width: 100%;
  
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  bottom: 0;
  border-radius: 1rem;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  height: 100%;
  max-height: 68vh;
  max-width: 500px;
  transition: height 0.2s;
  @media (min-width: 500px) and (orientation: landscape) {
    left: 1rem;
    max-width: 370px;
    max-height: calc(100vh - 1rem);
  }
  @media (min-width: 768px) {
    top: 2rem;
    left: 2rem;
    height: calc(100vh - 4rem);
    max-height: 100vh;
    border-bottom-left-radius: 1rem;
    border-bottom-right-radius: 1rem;
  }

  &--toggled {
    @media (max-width: 767px) {
      height: 33vh;
    }
  }

  &__toggle {
    background: rgba(255, 255, 255, 0.8);
    border: none;
    outline: none;
    color: rgba(0, 0, 0, 0.2);
    padding: 1rem 0 0 0;

    @media (min-width: 768px) {
      display: none;
    }
  }

  &__toggle-icon {
    width: 2rem;
    height: auto;
    transition: transform 0.2s;
    &--turned {
      transform: rotate(180deg);
    }
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    margin: 0;
    overflow: auto;
    flex: 1;

    @media (min-width: 768px) {
      padding: 2rem;
    }
  }

  &__empty {
    margin-top: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    text-align: center;
    color: #777;
  }

  &__icon {
    width: 50px;
    height: auto;
  }
}
</style>
