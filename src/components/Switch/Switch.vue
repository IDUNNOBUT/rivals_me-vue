<template>
  <label
    :class="[className, 'switch', 'switch__wrapper', `switch__wrapper_caption-${captionPosition}`]"
  >
    {{ caption }}
    <input
      class="switch__content"
      type="checkbox"
      name="switch"
      :checked="modelValue"
      @change="$emit('update:modelValue', !modelValue)"
      :disabled="readonly"
    />
  </label>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Switch',
  props: {
    className: {
      type: String,
      default: undefined
    },
    caption: {
      type: String,
      default: undefined
    },
    modelValue: {
      type: Boolean,
      required: true
    },
    captionPosition: {
      type: String,
      default: 'left',
      validator: (value: string) => ['left', 'top'].includes(value)
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue']
});
</script>

<style lang="scss">
.switch {
  cursor: pointer;
  font-size: var(--font-m);

  &__wrapper {
    display: inline-flex;
    align-items: center;
    gap: .5rem;

    &_caption-top {
      flex-direction: column;
      align-items: flex-start;
    }
  }

  &__content {
    cursor: pointer;
    appearance: none;
    width: 2.25rem;
    height: 1.375rem;
    border-radius: 2rem;
    background-color: var(--secondary);
    position: relative;
    padding: .25rem;

    &::before {
      content: "";
      display: block;
      aspect-ratio: 1;
      border-radius: 50%;
      width: .875rem;
      transform: translateX(100%);
      background-color: var(--white);
      transition: all .3s ease-in-out;
    }

    &:checked::before {
      transform: translateX(0);
      background-color: var(--accent);
    }
  }
}
</style> 