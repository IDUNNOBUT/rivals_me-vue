<template>
  <label
    :class="[className, 'input', 'input__wrapper font_m', `input__wrapper_caption-${captionPosition}`]"
  >
    {{ caption }}
    <input
      class="input__content font_xs font_nunito"
      :type="type"
      :placeholder="placeholder"
      :value="modelValue"
      :readonly="readonly"
      :required="required"
      @input="handleInput"
    />
  </label>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Input',
  props: {
    className: {
      type: String,
      default: undefined
    },
    caption: {
      type: String,
      default: undefined
    },
    placeholder: {
      type: String,
      required: true
    },
    readonly: {
      type: Boolean,
      default: false
    },
    captionPosition: {
      type: String,
      default: 'left',
      validator: (value: string) => ['left', 'top'].includes(value)
    },
    required: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'text',
      validator: (value: string) => ['text', 'password', 'number'].includes(value)
    },
    modelValue: {
      type: [String, Number],
      default: ''
    }
  },
  emits: ['update:modelValue'],
  methods: {
    handleInput(e: Event) {
      const target = e.target as HTMLInputElement;
      const newValue = target.value;

      if (this.type === 'number') {
        if (newValue === '') {
          this.$emit('update:modelValue', '');
        } else {
          const num = Number(newValue);
          if (!isNaN(num)) {
            this.$emit('update:modelValue', num);
          }
        }
      } else {
        this.$emit('update:modelValue', newValue);
      }
    }
  }
});
</script>

<style lang="scss">
.input {
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
    outline: transparent;
    border: 1px solid var(--primary);
    padding: .25rem .5rem;
    border-radius: .5rem;
    -moz-appearance: textfield;

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }
}
</style> 