<template>
  <div class="user">
    <div class="user__first-column">
      <div class="block user__item">
        <h2 class="block__title">User Info</h2>
        <div class="user__info">
          <div v-if="isLoading">
            <Skeleton height="m" />
          </div>
          <template v-else>
            <div class="user__info-item">
              <span class="user__info-label">uuid:</span>
              <span>{{ userData?.id }}</span>
            </div>
            <div class="user__info-item">
              <span class="user__info-label">name:</span>
              <span>{{ userData?.name }}</span>
            </div>
            <div class="user__info-item">
              <span class="user__info-label">email:</span>
              <span>{{ userData?.email }}</span>
            </div>
            <div class="user__info-item">
              <span class="user__info-label">registered:</span>
              <span>{{ userData?.registeredAt ? new Date(userData.registeredAt).toLocaleDateString() : "N/A" }}</span>
            </div>
          </template>
          
          <div v-if="isOverallLoading">
            <Skeleton height="m" />
          </div>
          <template v-else>
            <div class="user__info-item">
              <span class="user__info-label">total games:</span>
              <span>{{ overallData?.totalGames }}</span>
            </div>
            <div class="user__info-item">
              <span class="user__info-label">win rate:</span>
              <span>{{ overallData?.winRate }}</span>
            </div>
          </template>
        </div>
      </div>
      <div class="block user__item">
        <h2 class="block__title">Last month stat</h2>
        <MonthStat ref="monthStatRef" :userId="id" />
      </div>
    </div>
    <div class="block user__item user__item_big">
      <h2 class="block__title">History</h2>
      <GameHistory 
        ref="gameHistoryRef" 
        :userId="id" 
        @game-updated="handleGameResult" 
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import MonthStat from '../../components/MonthStat';
import Skeleton from '../../components/Skeleton/Skeleton.vue';
import { userApi } from '../../api/Users';
import { gameApi } from '../../api/Games';
import type { UserDto } from '../../DTO/User.dto';
import { useUserStore } from '../../composables/useUserStore';
import GameHistory from '../../components/GameHistory';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const id = route.params.id as string;

const monthStatRef = ref(null);
const gameHistoryRef = ref(null);

const isLoading = ref(true);
const isOverallLoading = ref(true);
const userData = ref<UserDto | null>(null);
const overallData = ref<{ totalGames: number, winRate: number } | null>(null);

watch(() => userStore.user, (currentUser) => {
  if (currentUser?.id === id) {
    router.push('/');
  }
}, { immediate: true });

const loadUserData = async () => {
  isLoading.value = true;
  try {
    userData.value = await userApi.getUser(id);
  } catch (error) {
    console.error('Failed to load user:', error);
  } finally {
    isLoading.value = false;
  }
};

const loadOverallData = async () => {
  isOverallLoading.value = true;
  try {
    overallData.value = await gameApi.getUserOverall(id);
  } catch (error) {
    console.error('Failed to load overall stats:', error);
  } finally {
    isOverallLoading.value = false;
  }
};

watch(() => route.params.id, () => {
  if (route.params.id) {
    loadUserData();
    loadOverallData();
  }
}, { immediate: true });

const handleGameResult = () => {
  if (monthStatRef.value) {
    monthStatRef.value.reload();
  }
  loadOverallData();
};

onMounted(() => {
  loadUserData();
  loadOverallData();
});
</script>

<style lang="scss">
.user {
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

  &__info {
    display: flex;
    flex-direction: column;
    gap: .625rem;
    align-items: baseline;
    font-family: "Nunito", sans-serif;

    &-item {
      display: flex;
      align-items: baseline;
      gap: .25rem;
    }

    &-label {
      font-weight: 600;
      font-family: "Roboto", sans-serif;
      font-size: var(--font-l);
    }
  }
}
</style> 