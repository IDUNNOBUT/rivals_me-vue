<template>
  <label 
    :class="[className, 'date', 'date__wrapper', `date__wrapper_caption-${captionPosition}`]"
  >
    {{ caption }}
    <input
      class="date__content font_xs font_nunito font_white"
      type="date"
      :value="modelValue || ''"
      :readonly="readonly"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </label>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'DateInput',
  props: {
    className: {
      type: String,
      default: undefined
    },
    modelValue: {
      type: String,
      default: undefined
    },
    caption: {
      type: String,
      default: undefined
    },
    readonly: {
      type: Boolean,
      default: false
    },
    captionPosition: {
      type: String,
      default: 'left',
      validator: (value: string) => ['left', 'top'].includes(value)
    }
  },
  emits: ['update:modelValue']
});
</script>

<style lang="scss">
.date {
  cursor: pointer;

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
    padding: .5rem;
    border: none;
    background-color: var(--secondary);
    border-radius: .5rem;

    &::-webkit-calendar-picker-indicator {
      background-color: var(--white);
      border-radius: .5rem;
      cursor: pointer;
    }
  }
}
</style> 