<template>
  <header class="header">
    <img
      width="95"
      height="36"
      class="header__logo"
      src="../../assets/rivals-logo.webp"
      alt="logo"
      @click="handleLogoClick"
    />
    <Button
      v-if="userStore.user && ![LINKS.auth].includes($route.path)"
      :caption="userStore.user.name"
      mode="leftSkew"
      :icon="true"
      @click="openUserMenu"
    >
      <UserLogo />
    </Button>
  </header>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import { LINKS } from '../../routes';
import Button from '../Button/Button.vue';
import { useUserStore } from '../../composables/useUserStore';
import { UserLogo } from '../../assets';

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

const handleLogoClick = () => {
  if (![LINKS.home, LINKS.auth].includes(route.path)) {
    router.push(LINKS.home);
  }
};

const openUserMenu = async () => {
  const stackOpenerModule = await import('../../utils/stackOpener');
  const userStackModule = await import('../UserStack');

  stackOpenerModule.stackOpener.open(
    userStackModule.default,
    { width: 'm' }
  );
};
</script>

<style lang="scss">
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: var(--secondary);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 1.25rem;

  &__logo {
    height: 2.25rem;
    margin-block: .25rem;
    cursor: pointer;
  }
}
</style> 