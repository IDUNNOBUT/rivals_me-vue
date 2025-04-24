<template>
  <slot></slot>
</template>

<script setup lang="ts">
import { createValidationContext } from '../../composables/useValidation';
import type { ValidationValue } from '../../composables/useValidation';

interface ValidationRule {
  validate: (value: ValidationValue, formData?: Record<string, ValidationValue>) => boolean;
  message: string;
}

interface Props {
  validationRules: Record<string, ValidationRule[]>;
}

const props = defineProps<Props>();

const validationContext = createValidationContext(props.validationRules);

defineExpose({
  validateForm: validationContext.validateForm,
  getFormData: validationContext.getFormData
});
</script>

<style lang="scss">
.field {
  position: relative;
  display: inline-block;
  width: fit-content;

  &.error {
    &::after {
      content: '';
      position: absolute;
      inset: -4px;
      border: 2px solid var(--warning);
      border-radius: .625rem;
      pointer-events: none;
    }
  }
}

.error-message {
  position: absolute;
  top: calc(100% + .5rem);
  left: 0;
  padding: .25rem .5rem;
  background: var(--gray);
  border-radius: .5rem;
  z-index: 10;
  animation: fadeOut 0.5s ease-in-out 3s forwards;

  &::after {
    content: '';
    position: absolute;
    left: calc(50% - .25rem);
    top: -.5rem;
    width: 0;
    height: 0;
    border-left: .5rem solid transparent;
    border-right: .5rem solid transparent;
    border-bottom: .5rem solid var(--gray);
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-10px);
    visibility: hidden;
  }
}
</style> 