<template>
  <div 
    :class="[className, 'score font_nunito', `score_${readonly ? 'readonly' : 'editable'}`]"
  >
    <SwordLogo />
    <SkullLogo />
    <AssistLogo />
    <input
      class="score__input font_xs"
      type="number"
      min="0"
      :value="modelValue.kills"
      :disabled="readonly"
      @input="handleChange('kills', $event)"
    />
    <input
      class="score__input font_xs"
      type="number"
      min="0"
      :value="modelValue.deaths"
      :disabled="readonly"
      @input="handleChange('deaths', $event)"
    />
    <input
      class="score__input font_xs"
      type="number"
      min="0"
      :value="modelValue.assists"
      :disabled="readonly"
      @input="handleChange('assists', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import type { ScoreValue } from './types';
import { SwordLogo, SkullLogo, AssistLogo } from '../../assets';

const props = defineProps({
  modelValue: {
    type: Object as () => ScoreValue,
    required: true
  },
  readonly: {
    type: Boolean,
    default: false
  },
  className: {
    type: String,
    default: undefined
  }
});

const emit = defineEmits(['update:modelValue']);

const handleChange = (field: keyof ScoreValue, event: Event) => {
  const target = event.target as HTMLInputElement;
  const value = parseInt(target.value) || 0;
  
  emit('update:modelValue', {
    ...props.modelValue,
    [field]: value
  });
};
</script>

<style lang="scss">
.score {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  row-gap: .625rem;
  column-gap: .5rem;
  padding: .5rem .25rem;
  width: min-content;

  &_editable {
    border: 1px solid var(--black);
    border-radius: .5rem;
    background-color: var(--white);
  }

  &__input {
    outline: transparent;
    border: none;
    background-color: transparent;
    min-width: 46px;
    -moz-appearance: textfield;

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    &[disabled] {
      color: var(--black);
    }
  }
}
</style> 