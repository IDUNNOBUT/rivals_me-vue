<template>
  <Validator ref="validatorRef" :validationRules="validationRules">
    <form class="game-stack" @submit.prevent="handleSubmit">
      <div class="game-stack__header">
        <div class="game-stack__header-title font_accent font_xl">
          {{ game.id ? "Game Settings" : "New Game" }}
        </div>
        <div class="game-stack__header-actions">
          <Button
            type="submit"
            variant="secondary"
            :icon="true"
            :disabled="!!(game.id && !hasChanges)"
            @click="() => {}"
          >
            <SaveLogo />
          </Button>
          <Button
            variant="secondary"
            :icon="true"
            @click="close"
          >
            <CrossLogo />
          </Button>
        </div>
      </div>
      <div class="game-stack__body">
        <Switch
          caption="Ranked"
          :modelValue="game.ranked ?? true"
          @update:modelValue="(value) => setGameState({ ...game, ranked: value })"
        />
        <Switch
          caption="Win"
          :modelValue="game.win ?? true"
          @update:modelValue="(value) => setGameState({ ...game, win: value })"
        />
        <ValidatedField
          name="date"
          v-model="game.date"
        >
          <template v-slot="{ onChange }">
            <DateInput
              :modelValue="game.date"
              @update:modelValue="(value) => { onChange(value); setGameState({ ...game, date: value }) }"
            />
          </template>
        </ValidatedField>
        <ValidatedField
          name="duration"
          v-model="game.duration"
        >
          <template v-slot="{ onChange }">
            <Input
              class="game-stack__duration"
              type="number"
              caption="Duration"
              :modelValue="game.duration || ''"
              placeholder="Enter duration"
              @update:modelValue="(value) => { onChange(Number(value)); setGameState({ ...game, duration: Number(value) }) }"
            />
          </template>
        </ValidatedField>
        <ValidatedField
          name="score"
          :converter="converters.score"
          :modelValue="{ kills: game.kills ?? 0, deaths: game.deaths ?? 0, assists: game.assists ?? 0 }"
        >
          <template v-slot="{ onChange }">
            <Score
              :modelValue="{ kills: game.kills ?? 0, deaths: game.deaths ?? 0, assists: game.assists ?? 0 }"
              @update:modelValue="(value) => { 
                onChange(value); 
                setGameState({
                  ...game,
                  kills: value.kills,
                  deaths: value.deaths,
                  assists: value.assists
                }) 
              }"
            />
          </template>
        </ValidatedField>
        <div class="game-stack__map-container">
          <img
            v-if="!!game.map && mapName"
            class="game-stack__map-image"
            :src="`${apiUrl}/public/maps/${encodeURIComponent(mapName)}/image.webp`"
            :srcset="`
              ${apiUrl}/public/maps/${encodeURIComponent(mapName)}/400w.webp 400w, 
              ${apiUrl}/public/maps/${encodeURIComponent(mapName)}/600w.webp 600w, 
              ${apiUrl}/public/maps/${encodeURIComponent(mapName)}/800w.webp 800w
            `"
            sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, 160px"
            :alt="mapName"
          />
          <ValidatedField
            name="map"
            :converter="converters.selector"
            :modelValue="game.map"
          >
            <template v-slot="{ onChange }">
              <Selector
                :modelValue="game.map"
                @update:modelValue="(value) => { 
                  onChange(value); 
                  setGameState({ ...game, map: value.id }); 
                  setMapName(value.name); 
                }"
                :data="maps || []"
                :reset-value="resetSelectorValue"
              />
            </template>
          </ValidatedField>
        </div>
        <ValidatedField
          name="hero"
          :converter="converters.selector"
          :modelValue="game.hero"
        >
          <template v-slot="{ onChange }">
            <Selector
              :modelValue="game.hero"
              @update:modelValue="(value) => { 
                onChange(value); 
                setGameState({ ...game, hero: value.id }); 
                setHeroName(value.name); 
              }"
              :data="heroes || []"
              :reset-value="resetSelectorValue"
            />
          </template>
        </ValidatedField>
      </div>
      <template v-if="!!game.hero && heroName">
        <img
          class="game-stack__hero-image"
          :src="`${apiUrl}/public/heroes/${encodeURIComponent(heroName)}/portrait/image.webp`"
          :srcset="`
            ${apiUrl}/public/heroes/${encodeURIComponent(heroName)}/portrait/400w.webp 400w, 
            ${apiUrl}/public/heroes/${encodeURIComponent(heroName)}/portrait/600w.webp 600w, 
            ${apiUrl}/public/heroes/${encodeURIComponent(heroName)}/portrait/800w.webp 800w, 
            ${apiUrl}/public/heroes/${encodeURIComponent(heroName)}/portrait/1200w.webp 1200w,
            ${apiUrl}/public/heroes/${encodeURIComponent(heroName)}/portrait/image.webp
          `"
          sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, 600px"
        />
        <img
          class="game-stack__background"
          :src="`${apiUrl}/public/heroes/${encodeURIComponent(heroName)}/background/image.webp`"
          :srcset="`
            ${apiUrl}/public/heroes/${encodeURIComponent(heroName)}/background/400w.webp 400w, 
            ${apiUrl}/public/heroes/${encodeURIComponent(heroName)}/background/600w.webp 600w, 
            ${apiUrl}/public/heroes/${encodeURIComponent(heroName)}/background/800w.webp 800w, 
            ${apiUrl}/public/heroes/${encodeURIComponent(heroName)}/background/1200w.webp 1200w,
            ${apiUrl}/public/heroes/${encodeURIComponent(heroName)}/background/image.webp
          `"
          sizes="(max-width: 480px) 100vw, (max-width: 768px) 100vw, 100vw"
        />
      </template>
      <div v-else class="game-stack__hero-image"></div>
    </form>
  </Validator>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Validator, ValidatedField } from '../Validator';
import Button from '../Button/Button.vue';
import Switch from '../Switch/Switch.vue';
import DateInput from '../DateInput/DateInput.vue';
import Input from '../Input/Input.vue';
import Score from '../Score/Score.vue';
import Selector from '../Selector/Selector.vue';
import { heroApi } from '../../api/Heroes';
import { mapApi } from '../../api/Maps';
import { gameApi } from '../../api/Games';
import type { ValidationValue } from '../../composables/useValidation';
import type { HeroDto } from '../../DTO/Hero.dto';
import type { MapDto } from '../../DTO/Map.dto';
import type { GameDto, CreateGameDto, UpdateGameDto } from '../../DTO/Game.dto';
import { SaveLogo, CrossLogo } from '../../assets';

interface Props {
  game?: GameDto;
  close: () => void;
  onResult?: () => void;
}

const props = defineProps<Props>();
const validatorRef = ref<any>(null);
const apiUrl = import.meta.env.VITE_API_URL;

const initialGameState: UpdateGameDto & { id?: string } = {
  date: new Date().toISOString().split("T")[0],
  duration: 0,
  hero: undefined,
  map: undefined,
  ranked: true,
  win: true,
  kills: 0,
  deaths: 0,
  assists: 0,
};

const resetSelectorValue = {
  id: undefined,
  name: "Not selected"
};

const converters = {
  score: (value: { kills: number; deaths: number; assists: number }) => ({
    kills: Number(value.kills),
    deaths: Number(value.deaths),
    assists: Number(value.assists)
  }),
  selector: (value: { id?: string }) => value?.id || value
};

const validationRules = {
  date: [
    {
      validate: (value: ValidationValue) => typeof value === "string" && value.length > 0,
      message: "Date is required"
    },
    {
      validate: (value: ValidationValue) => {
        if (typeof value !== "string") return false;
        const selectedDate = new Date(value);
        const today = new Date();

        selectedDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        return selectedDate.getTime() <= today.getTime();
      },
      message: "Game date cannot be in the future"
    }
  ],
  duration: [
    {
      validate: (value: ValidationValue) => {
        if (typeof value !== "number") return false;
        return value > 0;
      },
      message: "Duration is required and must be a positive number"
    }
  ],
  score: [
    {
      validate: (value: ValidationValue) => {
        if (typeof value !== "object") return false;
        const score = value as { kills: number; deaths: number; assists: number };
        return (
          typeof score.kills === "number" &&
          typeof score.deaths === "number" &&
          typeof score.assists === "number" &&
          score.kills >= 0 &&
          score.deaths >= 0 &&
          score.assists >= 0
        );
      },
      message: "All score values must be non-negative numbers"
    }
  ],
  map: [
    {
      validate: (value: ValidationValue) => typeof value === "string" && value.length > 0,
      message: "Map is required"
    }
  ],
  hero: [
    {
      validate: (value: ValidationValue) => typeof value === "string" && value.length > 0,
      message: "Hero is required"
    }
  ]
};

const getInitialGameState = (game?: GameDto): UpdateGameDto & { id?: string } => {
  if (!game) {
    return initialGameState;
  }

  const { user, ...payload } = game;
  return {
    ...payload,
    hero: game.hero.id,
    map: game.map.id,
  };
};

const game = ref<UpdateGameDto & { id?: string }>(getInitialGameState(props.game));
const heroName = ref<string | undefined>(props.game?.hero.name);
const mapName = ref<string | undefined>(props.game?.map.name);
const maps = ref<MapDto[]>([]);
const heroes = ref<HeroDto[]>([]);
const isLoading = ref({
  maps: true,
  heroes: true
});

const hasChanges = computed(() => {
  if (!props.game) return true;

  return (
    game.value.ranked !== props.game.ranked ||
    game.value.win !== props.game.win ||
    game.value.date !== props.game.date ||
    game.value.kills !== props.game.kills ||
    game.value.deaths !== props.game.deaths ||
    game.value.assists !== props.game.assists ||
    game.value.map !== props.game.map.id ||
    game.value.hero !== props.game.hero.id ||
    game.value.duration !== props.game.duration
  );
});

const setGameState = (newState: UpdateGameDto & { id?: string }) => {
  game.value = newState;
};

const setHeroName = (name: string) => {
  heroName.value = name;
};

const setMapName = (name: string) => {
  mapName.value = name;
};

const handleSubmit = async () => {
  if (game.value.id && !hasChanges.value) {
    return;
  }

  if (!validatorRef.value?.validateForm()) {
    return;
  }

  try {
    if (game.value.id) {
      const { id, ...updateData } = game.value;
      await gameApi.updateGame(id, updateData);
    } else {
      await gameApi.createGame(game.value as CreateGameDto);
    }

    if (props.onResult) {
      props.onResult();
    }
    props.close();
  } catch (error: any) {
    alert(error.response?.data?.message || "An error occurred");
  }
};

const loadMaps = async () => {
  isLoading.value.maps = true;
  try {
    maps.value = await mapApi.getMaps();
  } catch (error) {
    console.error("Failed to load maps:", error);
  } finally {
    isLoading.value.maps = false;
  }
};

const loadHeroes = async () => {
  isLoading.value.heroes = true;
  try {
    heroes.value = await heroApi.getHeroes();
  } catch (error) {
    console.error("Failed to load heroes:", error);
  } finally {
    isLoading.value.heroes = false;
  }
};

onMounted(async () => {
  await Promise.all([loadMaps(), loadHeroes()]);
});
</script>

<style lang="scss">
.game-stack {
  display: flex;
  flex-direction: column;
  padding-top: 1.5rem;
  padding-inline: .625rem;
  gap: .625rem;
  position: relative;
  height: 100%;
  width: 100%;
  overflow-y: auto;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    &-actions {
      display: flex;
      gap: .625rem;
    }
  }

  &__body {
    display: flex;
    flex-direction: column;
    gap: .625rem;
  }

  &__hero-image {
    object-fit: contain;
    min-height: 200px;
  }

  &__map {
    &-container {
      display: flex;
      flex-direction: column;
      width: min-content;
      background-color: var(--secondary);
      gap: .5rem;
      border-radius: .625rem;
    }

    &-image {
      height: 80px;
      margin-top: .5rem;
      object-fit: cover;
      max-width: 100%;
      border-radius: .625rem;
      margin-inline: .5rem;
    }
  }

  &__background {
    object-fit: cover;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
  }
}
</style> 