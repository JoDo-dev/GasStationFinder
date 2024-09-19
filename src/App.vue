<script setup lang="ts">
import FilterBar from './components/FilterBar.vue'
import Card from './components/ListCard.vue'
import Map from './components/FuelMap.vue'
import IconSearch from './components/icons/IconSearch.vue'
import IconAngle from './components/icons/IconAngle.vue'
import type { FuelStation } from './types'
import { ref, useTemplateRef, nextTick } from 'vue'
import { getters, actions } from './store'

const stations = useTemplateRef('stations')
const listToggled = ref<boolean>(false)

const { requestFuelData, setSearch, setActiveStation } = actions
const { filteredAndSortedFuelStations, getFuelStations, getActiveStation } = getters

requestFuelData()

const setActiveMarker = (station: FuelStation) => {
  if (!filteredAndSortedFuelStations.value.find((st) => station.objectid === st.objectid)) {
    setSearch('')
  }
  nextTick(() => {
    if (station) {
      listToggled.value = true
      setActiveStation(station)
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
      <FilterBar />
      <transition-group
        v-if="filteredAndSortedFuelStations.length"
        ref="stations"
        name="fade"
        tag="ul"
        class="stations__list"
      >
        <card
          :key="`station-${item.objectid}`"
          v-for="item in filteredAndSortedFuelStations"
          :id="`station-${item.objectid}`"
          :station="item"
          :isActive="getActiveStation !== null && getActiveStation.objectid === item.objectid"
          @showOnMap="setActiveMarker"
        />
      </transition-group>
      <div v-else class="stations__empty">
        <IconSearch class="stations__icon" />
        <p>Keine Tankstellen gefunden</p>
      </div>
    </div>
    <Map
      class="map"
      v-if="getFuelStations.length"
      :fuelStations="getFuelStations"
      @markerClicked="setActiveMarker"
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
