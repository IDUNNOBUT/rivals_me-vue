<template>
  <div :class="['filter', className]">
    <DateInput
      caption="Date"
      captionPosition="top"
      class="filter__item"
      :modelValue="filter.date"
      @update:modelValue="value => setFilter({ ...filter, date: value })"
    />
    <Selector
      caption="Game mode"
      captionPosition="top"
      class="filter__item"
      :modelValue="filter.ranked"
      @update:modelValue="value => setFilter({ ...filter, ranked: value.id })"
      :data="gameModes"
    />
    <Selector
      caption="Result"
      captionPosition="top"
      class="filter__item"
      :modelValue="filter.win"
      @update:modelValue="value => setFilter({ ...filter, win: value.id })"
      :data="results"
    />
    <Selector
      caption="Hero"
      captionPosition="top"
      class="filter__item"
      :modelValue="filter.hero"
      @update:modelValue="value => setFilter({ ...filter, hero: value.id })"
      :data="heroes || []"
    />
    <Selector
      caption="Map"
      captionPosition="top"
      class="filter__item"
      :modelValue="filter.map"
      @update:modelValue="value => setFilter({ ...filter, map: value.id })"
      :data="maps || []"
    />
    <Button
      class="filter__button"
      variant="secondary"
      :icon="true"
      @click="filterChanged(filter)"
    >
      <SearchLogo />
    </Button>
    <Button
      v-if="Object.values(filter).some(value => value !== undefined && value !== '')"
      class="filter__button"
      variant="secondary"
      :icon="true"
      @click="() => { setFilter({}); filterChanged({}); }"
    >
      <CrossLogo />
    </Button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Button from '../../Button/Button.vue';
import DateInput from '../../DateInput/DateInput.vue';
import Selector from '../../Selector/Selector.vue';
import { mapApi } from '../../../api/Maps';
import { heroApi } from '../../../api/Heroes';
import type { MapDto } from '../../../DTO/Map.dto';
import type { HeroDto } from '../../../DTO/Hero.dto';
import type { GameFilterDto } from '../../../DTO/Game.dto';
import { SearchLogo, CrossLogo } from '../../../assets';

interface Props {
  className?: string;
  initialFilter: GameFilterDto;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: 'filterChanged', filter: GameFilterDto): void;
}>();

const filter = ref<GameFilterDto>(props.initialFilter || {});
const maps = ref<MapDto[]>([]);
const heroes = ref<HeroDto[]>([]);

const gameModes = [
  { id: true, name: "Ranked" },
  { id: false, name: "QP" }
];

const results = [
  { id: true, name: "Win" },
  { id: false, name: "Lose" }
];

function setFilter(newFilter: GameFilterDto) {
  filter.value = newFilter;
}

function filterChanged(newFilter: GameFilterDto) {
  emit('filterChanged', newFilter);
}

onMounted(async () => {
  try {
    maps.value = await mapApi.getMaps();
    heroes.value = await heroApi.getHeroes();
  } catch (error) {
    console.error('Failed to load filter data:', error);
  }
});
</script>

<style lang="scss">
.filter {
  display: flex;
  gap: .625rem;
  align-items: start;
  flex-wrap: wrap;
  justify-content: flex-end;

  &__button {
    align-self: center;
  }
}
</style>