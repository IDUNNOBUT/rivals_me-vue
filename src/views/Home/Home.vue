<template>
  <div class="home">
    <div class="home__first-column">
      <div class="block home__item">
        <h2 class="block__title">Hero hot list</h2>
        <TopList ref="topListRef" />
      </div>
      <div class="block home__item">
        <h2 class="block__title">Last month stat</h2>
        <MonthStat ref="monthStatRef" />
      </div>
    </div>
    <div class="block home__item home__item_big">
      <h2 class="block__title">Game History</h2>
      <GameHistory ref="gameHistoryRef" @game-updated="updateAllComponents" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import TopList from '../../components/TopList';
import MonthStat from '../../components/MonthStat';
import GameHistory from '../../components/GameHistory';

const topListRef = ref<any>(null);
const monthStatRef = ref<any>(null);
const gameHistoryRef = ref<any>(null);

const updateAllComponents = () => {
  if (topListRef.value?.reload) {
    topListRef.value.reload();
  }

  if (monthStatRef.value?.reload) {
    monthStatRef.value.reload();
  }
};
</script>

<style lang="scss">
.home {
  flex: 1;
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 2fr;
  grid-template-rows: 1fr 1fr;
  gap: 1rem;
  padding: .625rem 1.25rem;
  overflow: hidden;

  @media ((max-width: 850px) or (max-height: 500px)) and (orientation: landscape) {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 100% 100%;
    overflow-y: auto;
    height: auto;
    max-height: 100%;
  }

  @media (max-width: 650px) and (orientation: portrait) {
    grid-template-columns: 100% 100%;
    grid-template-rows: 100%;
    column-gap: 1.25rem;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    height: 100%;
    padding: .5rem;
    scrollbar-width: none;
    -ms-overflow-style: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  &__item {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;
    min-height: 0;

    @media (max-width: 650px) and (orientation: portrait) {
      scroll-snap-align: center;
      height: 100%;
    }

    @media ((max-width: 850px) or (max-height: 500px)) and (orientation: landscape) {
      min-height: 0;
    }

    &_big {
      grid-row: span 2;
      height: 100%;
      overflow: hidden;

      @media (max-width: 650px) and (orientation: portrait) {
        grid-row: 1;
        grid-column: 2;
        height: 100%;
        display: flex;
        flex-direction: column;
      }

      @media ((max-width: 850px) or (max-height: 500px)) and (orientation: landscape) {
        grid-row: 2;
        grid-column: 1 / -1;
      }
    }
  }

  &__first-column {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    height: 100%;
    grid-row: 1 / -1;

    @media ((max-width: 850px) or (max-height: 500px)) and (orientation: landscape) {
      grid-row: 1;
      grid-column: 1 / -1;
      flex-direction: row;
    }

    @media (max-width: 650px) and (orientation: portrait) {
      grid-row: 1;
      grid-column: 1;
      flex-direction: column;
    }
  }
}
</style> 