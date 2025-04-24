<template>
  <slot></slot>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { createUserStore } from '../../composables/useUserStore';

const router = useRouter();
const userStore = createUserStore();

onMounted(async () => {
  await userStore.initialize(router);
});
</script> 