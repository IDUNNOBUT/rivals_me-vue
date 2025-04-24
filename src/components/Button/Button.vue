<template>
  <button
    :type="type"
    :class="[
      className,
      'button font_oswald',
      `button_${variant}`,
      `button_${mode}`,
      `font_${fontSize}`,
      icon && !caption ? `button_icon icon_${iconSize}` : ''
    ]"
    :disabled="disabled"
    @click="onClick"
  >
    {{ caption }}
    <slot></slot>
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Button',
  props: {
    caption: {
      type: String,
      default: undefined
    },
    onClick: {
      type: Function,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    className: {
      type: String,
      default: undefined
    },
    variant: {
      type: String,
      default: 'accent',
      validator: (value: string) => ['accent', 'secondary'].includes(value)
    },
    mode: {
      type: String,
      default: 'default',
      validator: (value: string) => ['default', 'leftSkew', 'rightSkew'].includes(value)
    },
    fontSize: {
      type: String,
      default: 'l',
      validator: (value: string) => ['xs', 'm', 'l', 'xl'].includes(value)
    },
    icon: {
      type: Boolean,
      default: false
    },
    iconSize: {
      type: String,
      default: 'm',
      validator: (value: string) => ['s', 'm'].includes(value)
    },
    type: {
      type: String,
      default: 'button',
      validator: (value: string) => ['button', 'submit'].includes(value)
    }
  }
});
</script>

<style lang="scss">
$skew-width: .75rem;

.button {
  cursor: pointer;
  padding: .5rem;
  appearance: none;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: .5rem;

  &_icon {
    padding: .25rem;
    width: 2rem;
    height: 2rem;
    
    &.icon_s .button__icon-container {
      width: 1rem;
      height: 1rem;
    }
    
    &.icon_m .button__icon-container {
      width: 1.5rem;
      height: 1.5rem;
    }
  }

  &_accent {
    background-color: var(--accent);
    color: var(--black)
  }

  &_secondary {
    background-color: var(--secondary);
    color: var(--white);
  }

  &_default {
    border-radius: .25rem;
  }

  &_leftSkew {
    padding-left: calc($skew-width + .5rem);
    clip-path: polygon($skew-width 0, 100% 0, 100% 100%, 0 100%);
  }

  &_rightSkew {
    padding-right: calc($skew-width + .5rem);
    clip-path: polygon(0 0, calc(100% - $skew-width) 0, 100% 100%, 0 100%);
  }
}
</style> 