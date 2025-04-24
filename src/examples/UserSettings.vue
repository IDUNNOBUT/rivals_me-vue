<template>
  <div>
    <Button
      caption="Open User Settings"
      variant="secondary"
      @click="openUserSettings"
    />
  </div>
</template>

<script setup lang="ts">
import Button from '../components/Button/Button.vue';
import { stackOpener } from '../utils/stackOpener';
import UserStack from '../components/UserStack';

const openUserSettings = () => {
  stackOpener.open(UserStack, {
    width: 'm'
  });
};
</script> 