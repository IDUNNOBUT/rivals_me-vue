<template>
  <template v-for="item in stackItems" :key="item.id">
    <teleport to="#stack">
      <StackWrapper :width="item.width">
        <component :is="item.component" v-bind="item.props"></component>
      </StackWrapper>
    </teleport>
  </template>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { stackUpdateEvent } from '../../utils/stackOpener';
import StackWrapper from '../StackWrapper';
import type { Component } from 'vue';

interface StackItem {
  component: Component;
  props: Record<string, any>;
  id: string;
  width?: 'm' | 'l';
}

const stackItems = ref<StackItem[]>([]);

const handleStackUpdate = (event: CustomEvent) => {
  stackItems.value = event.detail;
};

onMounted(() => {
  document.addEventListener(stackUpdateEvent, handleStackUpdate as EventListener);
});

onBeforeUnmount(() => {
  document.removeEventListener(stackUpdateEvent, handleStackUpdate as EventListener);
});
</script> 