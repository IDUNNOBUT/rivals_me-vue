<template>
  <div :class="[props.className, 'month-stat']">
    <Skeleton v-if="isLoading" />
    <div v-else class="chart-container">
      <ChartComponent :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, defineExpose } from 'vue';
import { gameApi } from '../../api/Games';
import Skeleton from '../Skeleton/Skeleton.vue';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'vue-chartjs';

const ChartComponent = Line;

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface IResponse {
  labels: string[];
  data: number[];
}

interface Props {
  className?: string;
  userId?: string;
}

const props = withDefaults(defineProps<Props>(), {
  className: undefined,
  userId: undefined
});

const data = ref<IResponse | null>(null);
const isLoading = ref(true);

const getCssVar = (name: string): string => {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
};

const chartData = computed(() => ({
  labels: data.value?.labels || [],
  datasets: [
    {
      data: data.value?.data || [],
      borderColor: getCssVar('--accent'),
      backgroundColor: getCssVar('--accent'),
      tension: 0.4,
      pointRadius: 4,
      pointHoverRadius: 6,
    }
  ]
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 0
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: getCssVar('--secondary'),
      padding: 12,
      titleSpacing: 0,
      titleMarginBottom: 0,
      bodyFont: {
        size: 14,
        family: 'Roboto'
      },
      displayColors: false,
      callbacks: {
        title: () => '',
        label: (context) => `${context.label}: ${context.formattedValue}`,
      }
    }
  },
  scales: {
    x: {
      border: {
        display: false
      },
      grid: {
        color: getCssVar('--gray'),
      },
      ticks: {
        display: false
      }
    },
    y: {
      border: {
        display: false
      },
      grid: {
        color: (context) => {
          if (context.tick.value === 0) {
            return getCssVar('--black');
          }
          return getCssVar('--gray');
        }
      },
      ticks: {
        font: {
          family: 'Roboto',
          size: 14
        },
        stepSize: 1,
        callback: (value) => Math.round(Number(value))
      }
    }
  }
};

const loadStats = async () => {
  isLoading.value = true;
  try {
    data.value = await gameApi.getUserStats(props.userId);
  } catch (error) {
    console.error('Failed to load user stats:', error);
  } finally {
    isLoading.value = false;
  }
};

watch(() => props.userId, () => {
  loadStats();
});

onMounted(() => {
  loadStats();
});

defineExpose({
  reload: loadStats
});
</script>

<style lang="scss">
.month-stat {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 200px;
  
  .chart-container {
    width: 100%;
    height: 100%;
  }
}
</style> 