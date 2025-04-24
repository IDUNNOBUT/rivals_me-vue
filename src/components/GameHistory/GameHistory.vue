<template>
  <div :class="[className, 'game-history']">
    <div :class="['game-history__toolbar', !userId ? 'game-history__toolbar_edit' : '']">
      <Button
        v-if="!userId"
        caption="Add game"
        mode="rightSkew"
        @click="openGameStack()"
      />
      <Filter
        class="game-history__filter"
        :initialFilter="filter"
        @filterChanged="handleFilterChange"
      />
    </div>
    <Pagination
      class="game-history__pagination"
      :pages="data?.meta?.pages || 0"
      :currentPage="page"
      @pageChanged="setPage"
    />
    <div class="game-history__content">
      <div class="game-history__header-row font_white font_oswald font_l">
        <div class="game-history__header">Date</div>
        <div class="game-history__header">Hero</div>
        <div class="game-history__header">Score</div>
        <div class="game-history__header">Result</div>
        <div class="game-history__header game-history__header_additional">Mode</div>
        <div class="game-history__header">Map</div>
      </div>
      <template v-if="isLoading">
        <Skeleton 
          v-for="index in 6" 
          :key="index" 
          grid 
          height="l"
        />
      </template>
      <template v-else>
        <div
          v-for="game in data?.data"
          :key="game.id"
          class="game-history__item"
        >
          <div class="game-history__item-date font_nunito">
            <div>{{ new Date(game.date).toLocaleDateString() }}</div>
            <div>{{ game.duration }} min</div>
          </div>
          <div class="game-history__item-hero">
            <div class="game-history__item-hero-image icon icon_l">
              <img
                width="64"
                height="64"
                :src="`${apiUrl}/public/heroes/${encodeURIComponent(game.hero.name)}/icon/image.webp`"
                :alt="game.hero.name"
              />
            </div>
            <div class="game-history__item-hero-info game-history__item_additional">
              <div class="game-history__item-hero-name font_l">{{ game.hero.name }}</div>
              <div class="game-history__item-hero-role font_nunito">{{ game.hero.role }}</div>
            </div>
          </div>
          <div class="game-history__item-score">
            <Score
              :modelValue="{
                kills: game.kills,
                deaths: game.deaths,
                assists: game.assists
              }"
              readonly
            />
          </div>
          <div class="game-history__item-result">
            <div
              :class="[
                'game-history__item-result-text font_oswald font_xl',
                game.win ? 'game-history__item-result-text_win font_success' : 'game-history__item-result-text_lose font_warning'
              ]"
            >
              {{ game.win ? 'Win' : 'Lose' }}
            </div>
            <div class="game-history__item_mobile">{{ game.ranked ? 'Comp' : 'QP' }}</div>
          </div>
          <div class="game-history__item-game-mode game-history__item_additional font_oswald font_xl">
            {{ game.ranked ? 'Comp' : 'QP' }}
          </div>
          <div class="game-history__item-map">
            <div
              class="game-history__item-map-image"
              :data-tooltip="game.map.name"
            >
              <img
                width="160"
                height="80"
                :src="`${apiUrl}/public/maps/${encodeURIComponent(game.map.name)}/image.webp`"
                :srcset="`
                  ${apiUrl}/public/maps/${encodeURIComponent(game.map.name)}/400w.webp 400w, 
                  ${apiUrl}/public/maps/${encodeURIComponent(game.map.name)}/600w.webp 600w, 
                  ${apiUrl}/public/maps/${encodeURIComponent(game.map.name)}/800w.webp 800w
                `"
                sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, 160px"
                :alt="game.map.name"
              />
            </div>
          </div>
          <div 
            v-if="!userId"
            class="game-history__item-actions"
          >
            <Button 
              variant="secondary" 
              :icon="true" 
              @click="openGameStack(game)"
            >
              <EditLogo />
            </Button>
            <Button 
              variant="secondary" 
              :icon="true" 
              @click="deleteGame(game)"
            >
              <TrashLogo />
            </Button>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, defineExpose } from 'vue';
import Button from '../Button/Button.vue';
import Filter from './Filter';
import Score from '../Score/Score.vue';
import Pagination from './Pagination';
import Skeleton from '../Skeleton/Skeleton.vue';
import { gameApi } from '../../api/Games';
import type { GameDto, GameFilterDto } from '../../DTO/Game.dto';
import type { PaginationResponseDto } from '../../DTO/Pagination.dto';
import { EditLogo, TrashLogo } from '../../assets';

interface Props {
  className?: string;
  userId?: string;
}

const props = withDefaults(defineProps<Props>(), {
  className: '',
  userId: undefined
});

const emit = defineEmits<{
  (e: 'game-updated'): void;
}>();

const apiUrl = import.meta.env.VITE_API_URL;
const pageSize = 10;

const filter = ref<GameFilterDto>({});
const page = ref(1);
const data = ref<PaginationResponseDto<GameDto[]> | null>(null);
const isLoading = ref(true);

const queryParams = computed(() => ({
  id: props.userId,
  ...filter.value,
  page: page.value,
  pageSize
}));

const fetchGames = async () => {
  isLoading.value = true;
  try {
    data.value = await gameApi.getGames(queryParams.value);

    if (data.value?.meta?.pages && queryParams.value.page > data.value.meta.pages) {
      page.value = 1;
    }
  } catch (error) {
    console.error('Failed to fetch games:', error);
  } finally {
    isLoading.value = false;
  }
};

const handleFilterChange = (newFilter: GameFilterDto) => {
  filter.value = newFilter;
  page.value = 1;
};

const setPage = (newPage: number) => {
  page.value = newPage;
};

const openGameStack = async (game?: GameDto) => {
  const stackOpenerModule = await import('../../utils/stackOpener');
  const GameStack = await import('../GameStack');
  
  stackOpenerModule.stackOpener.open(GameStack.default, {
    game,
    onResult: () => {
      fetchGames();
      emit('game-updated');
    }
  });
};

const deleteGame = async (game: GameDto) => {
  try {
    await gameApi.deleteGame(game.id);
    fetchGames();
    emit('game-updated');
  } catch (error: any) {
    alert(error.response?.data?.message || "An error occurred");
  }
};

watch(queryParams, () => {
  fetchGames();
});

onMounted(() => {
  fetchGames();
});

defineExpose({
  reload: fetchGames
});
</script>

<style lang="scss">
.game-history {
  display: flex;
  flex-direction: column;
  gap: .625rem;
  height: 100%;
  overflow: hidden;

  @media (max-width: 850px) and (orientation: landscape) {
    max-height: 100%;
  }

  &__toolbar {
    display: flex;
    justify-content: flex-end;
    align-items: center;

    &_edit {
      justify-content: space-between;
      gap: .625rem;
    }
  }

  &__content {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    grid-auto-rows: min-content;
    gap: .625rem;
    align-items: center;
    overflow-y: auto;
    min-height: 0;
    flex: 1;
    scrollbar-color: var(--accent) var(--secondary);
    scrollbar-width: thin;
    scroll-snap-type: y mandatory;

    @media (max-width: 850px) {
      grid-template-columns: repeat(5, 1fr);
    }

    /* Стили скроллбара для WebKit браузеров */
    &::-webkit-scrollbar {
      width: 8px;
    }

    &::-webkit-scrollbar-track {
      background-color: var(--secondary);
      border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: var(--accent);
      border-radius: 4px;
    }
  }

  &__header-row {
    display: grid;
    grid-template-columns: subgrid;
    grid-column: 1 / -1;
    background-color: var(--secondary);
    border-radius: .625rem;
    padding: .5rem .625rem;
    text-transform: uppercase;
    position: sticky;
    top: 0;
    z-index: 20;
  }

  &__header {
    &_additional {
      @media (max-width: 850px) {
        display: none;
      }
    }

    &_mobile {
      display: none;

      @media (max-width: 850px) {
        display: initial;
      }
    }
  }

  &__item {
    position: relative;
    cursor: pointer;
    display: grid;
    grid-template-columns: subgrid;
    align-items: center;
    grid-column: 1 / -1;
    padding: 0 .625rem;
    scroll-snap-align: center;

    &:hover {
      background-color: var(--gray);
    }

    &-date {
      display: flex;
      flex-direction: column;
      gap: .25rem;
    }

    &-hero {
      display: flex;
      align-items: center;
      gap: .625rem;

      &-info {
        display: flex;
        align-items: baseline;
        flex-wrap: wrap;
        gap: .25rem;
      }
    }

    &-result,
    &-game-mode {
      display: flex;
      flex-direction: column;
      gap: .25rem;
      text-transform: uppercase;
    }

    &-map {
      &-image {
        position: relative;
        aspect-ratio: 2;
        height: 80px;

        @media (max-width: 650px) {
          height: 60px;
        }

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: .625rem;
        }

        &:before {
          font-family: "Nunito", sans-serif;
          max-width: 50%;
          width: min-content;
          text-align: right;
          z-index: 1;
          display: block;
          content: attr(data-tooltip);
          color: var(--black);
          position: absolute;
          top: .25rem;
          right: .25rem;
          padding: .25rem;
          border-radius: .5rem;
          background-color: var(--white);

          @media (max-width: 650px) {
            display: none;
          }
        }
      }
    }

    &:hover &-actions {
      display: flex;
    }

    &-actions {
      z-index: 10;
      display: none;
      flex-direction: column;
      position: absolute;
      right: .25rem;
      align-items: center;
      gap: .25rem;
      
      .button {
        width: 2rem;
        height: 2rem;
        padding: .25rem;
      }
      
      .button__icon-container {
        width: 1.25rem;
        height: 1.25rem;
      }
    }

    &_additional {
      @media (max-width: 850px) {
        display: none;
      }
    }

    &_mobile {
      display: none;

      @media (max-width: 850px) {
        display: initial;
      }
    }
  }

  &__pagination {
    align-self: center;
  }
}
</style> 