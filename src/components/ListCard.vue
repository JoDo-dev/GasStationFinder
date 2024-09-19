<template>
  <li class="card" :class="{ 'card--active': isActive }">
    <div class="card__details">
      <div class="card__street">{{ street }}</div>
      <div class="card__city">{{ city }}</div>
    </div>
    <button class="card__button" @click.prevent="handleClick()">
      <IconPin class="card__icon" />
    </button>
  </li>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { FuelStation } from '../types'
import IconPin from './icons/IconPin.vue'

const props = defineProps<{
  station: FuelStation
  isActive: boolean
}>()

const emit = defineEmits(['showOnMap'])

const street = computed(() => {
  return props.station.adresse.split('(')[0]
})

const city = computed(() => {
  return props.station.adresse.split('(')[1].replace(')', '')
})

const handleClick = () => {
  emit('showOnMap', props.station)
}
</script>

<style lang="scss" scoped>
.card {
  list-style-type: none;
  box-shadow: 0px 5px 20px -10px #282f44;
  border-radius: 1rem;
  padding: 1rem;
  margin: 0;
  display: flex;
  justify-content: space-between;
  border: 3px solid transparent;
  background-color: rgba(255, 255, 255, 0.7);
  transition: all 0.2s;

  &--active {
    border-color: #282f44;
  }

  &__street {
    font-weight: bold;
  }

  &__button {
    background-color: #282f44;
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    height: 2rem;
    width: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__icon {
    width: 100%;
    height: auto;
  }
}
</style>
