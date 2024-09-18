<template>
  <div class="filter-bar">
    <input
      type="text"
      class="filter-bar__input"
      placeholder="Nach Adresse suchen"
      v-model="search"
      @change="handleSearch()"
    />
    <button
      class="filter-bar__button"
      :class="{ 'filter-bar__button--desc': !sortAsc }"
      @click.prevent="handleSort()"
    >
      <IconArrow class="filter-bar__icon" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { defineEmits, ref, watch } from 'vue'
import IconArrow from './icons/IconArrow.vue'

const props = defineProps<{
  parentSearch: string
}>()

const sortAsc = ref<boolean>(true)
const search = ref<string>('')

const emit = defineEmits(['sortClicked', 'searchChanged'])

const handleSort = () => {
  sortAsc.value = !sortAsc.value
  emit('sortClicked', sortAsc.value)
}

const handleSearch = () => {
  emit('searchChanged', search.value)
}

watch(
  () => props.parentSearch,
  (newSearch) => {
    search.value = newSearch
  }
)
</script>

<style lang="scss" scoped>
.filter-bar {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.8);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);

  @media (min-width: 768px) {
    padding: 2rem;
  }

  &__button {
    background-color: #282f44;
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    height: 2.5rem;
    width: 2.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 0 0 auto;
    transition: transform 0.2s;

    &--desc {
      transform: rotate(180deg);
    }
  }

  &__icon {
    width: auto;
    height: 20px;
  }

  &__input {
    flex: 1;
    padding: 0.8rem 1rem;
    height: 2.5rem;
    width: 2.5rem;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 1.8rem;
    font-size: inherit;
    background: rgb(255, 255, 255);
  }
}
</style>
