<template>
  <div :class="['field', error ? 'error' : '']">
    <slot :onChange="handleChange"></slot>
    <div v-if="error" :key="errorKey" class="error-message font_warning">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { useValidation, type ValidationValue } from '../../composables/useValidation';

interface Props {
  name: string;
  modelValue?: any;
  converter?: (value: any) => ValidationValue;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: undefined,
  converter: (value) => value
});

const emit = defineEmits(['update:modelValue']);

const { errors, validateField, removeField, setFieldValue } = useValidation();
const errorKey = ref(0);

const error = computed(() => errors[props.name]);

watch(() => errors[props.name], (newValue) => {
  if (newValue) {
    errorKey.value++;
  }
});

onMounted(() => {
  const initialValue = props.converter(props.modelValue);
  setFieldValue(props.name, initialValue);
});

onBeforeUnmount(() => {
  removeField(props.name);
});

const handleChange = (newValue: any) => {
  const convertedValue = props.converter(newValue);
  validateField(props.name, convertedValue);
  emit('update:modelValue', newValue);
};

watch(() => props.modelValue, (newValue) => {
  const convertedValue = props.converter(newValue);
  setFieldValue(props.name, convertedValue);
}, { immediate: true });
</script> 