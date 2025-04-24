<template>
  <div :class="[props.className, 'top-list']">
    <div class="top-list__header-row font_oswald font_l font_white">
      <div class="top-list__header"></div>
      <div class="top-list__header"></div>
      <div class="top-list__header top-list__header_additional">Hero</div>
      <div class="top-list__header">Pick <span class="top-list__header_additional">Rate</span></div>
      <div class="top-list__header">Win <span class="top-list__header_additional">Rate</span></div>
    </div>
    <template v-if="isLoading">
      <Skeleton 
        v-for="index in 3" 
        :key="index" 
        grid 
        height="l"
      />
    </template>
    <template v-else>
      <div 
        v-for="(hero, index) in data" 
        :key="hero.id" 
        class="top-list__item"
      >
        <div class="top-list__item-index font_oswald font_xl">{{ index + 1 }}</div>
        <div class="top-list__item-image icon icon_l">
          <img
            height="64"
            width="64"
            :src="getHeroIconUrl(hero.name)"
            :alt="hero.name"
          />
        </div>
        <div class="top-list__item-hero">
          <div class="top-list__item-hero-name font_l">{{ hero.name }}</div>
          <div class="top-list__item-hero-role font_nunito">{{ hero.role }}</div>
        </div>
        <div class="top-list__item-pick-rate font_l">{{ hero.pickRate.toFixed(2) }}%</div>
        <div class="top-list__item-win-rate font_l">{{ hero.winRate.toFixed(2) }}%</div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, defineExpose } from 'vue';
import { gameApi } from '../../api/Games';
import type { HeroTopDto } from '../../DTO/TopList.dto';
import Skeleton from '../Skeleton/Skeleton.vue';

const API_URL = import.meta.env.VITE_API_URL;

interface Props {
  className?: string;
}

const props = withDefaults(defineProps<Props>(), {
  className: undefined
});

const data = ref<HeroTopDto[]>([]);
const isLoading = ref(true);

const getHeroIconUrl = (heroName: string) => {
  return `${API_URL}/public/heroes/${encodeURIComponent(heroName)}/icon/image.webp`;
};

const loadTop = async () => {
  isLoading.value = true;
  try {
    data.value = await gameApi.getHeroTop();
  } catch (error) {
    console.error('Failed to load top heroes:', error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  loadTop();
});

defineExpose({
  reload: loadTop
});
</script>

<style lang="scss">
.top-list {
  display: grid;
  grid-template-columns: auto 1fr 1fr 1fr 1fr;
  gap: .625rem;
  align-items: center;
  flex: 1;
  min-height: 0;

  @media (max-width: 850px) {
    grid-template-columns: auto 1fr 1fr 1fr;
  }

  @media (max-width: 850px) and (orientation: landscape) {
    max-height: 100%;
  }

  &__header-row {
    display: grid;
    grid-template-columns: subgrid;
    grid-column: 1 / -1;
    background-color: var(--secondary);
    border-radius: .625rem;
    padding: .5rem .625rem;
    text-transform: uppercase;
  }

  &__header {
    &_additional {
      @media (max-width: 850px) {
        display: none;
      }
    }
  }

  &__item {
    display: grid;
    grid-template-columns: subgrid;
    grid-column: 1 / -1;
    align-items: center;
    padding: 0 .625rem;

    &-hero {
      display: flex;
      flex-direction: column;
      gap: .25rem;

      @media (max-width: 850px) {
        display: none;
      }
    }
  }
}
</style> 