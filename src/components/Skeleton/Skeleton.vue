<template>
  <div
    :class="[
      className, 
      'skeleton', 
      grid ? 'skeleton_grid' : '', 
      height ? `skeleton_${height}` : ''
    ]"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Skeleton',
  props: {
    className: {
      type: String,
      default: undefined
    },
    grid: {
      type: Boolean,
      default: false
    },
    height: {
      type: String,
      default: undefined,
      validator: (value: string) => ['m', 'l'].includes(value)
    }
  }
});
</script>

<style lang="scss">
@keyframes skeleton-loading {
  0% {
    background-position: 0 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0 50%;
  }
}

.skeleton {
  height: 100%;
  width: 100%;
  position: relative;
  overflow: hidden;
  background-color: #e2e5e7;
  border-radius: .25rem;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      rgba(143, 143, 143, 1) 0%,
      rgba(212, 212, 212, 1) 50%,
      rgba(143, 143, 143, 1) 100%
    );
    background-size: 200% 200%;
    animation: skeleton-loading 3s ease-in-out infinite;
  }

  &_grid {
    grid-column: 1 / -1;
  }

  &_m {
    min-height: 40px;
  }

  &_l {
    min-height: 80px;
  }
}
</style> 