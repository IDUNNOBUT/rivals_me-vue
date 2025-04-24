<template>
  <UserProvider>
    <Header />
    <main class="main">
      <router-view />
    </main>
    <StackManager />
    <div id="stack"></div>
  </UserProvider>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { baseApi } from './api/Base';
import UserProvider from './components/App/UserProvider.vue';
import StackManager from './components/StackManager';
import Header from './components/Header';

const router = useRouter();
let responseInterceptor: number;

onMounted(() => {
  responseInterceptor = baseApi.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        router.push('/auth');
      }
      return Promise.reject(error);
    }
  );
});

onUnmounted(() => {
  baseApi.interceptors.response.eject(responseInterceptor);
});
</script>

<style>
  .main {
    flex: 1;
    display: flex;
    flex-direction: column;
    background-color: var(--primary);
    height: 100%;
    overflow: hidden;
  }
</style>
