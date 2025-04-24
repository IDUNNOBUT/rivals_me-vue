import { ref, reactive, readonly, provide, inject } from 'vue';
import type { InjectionKey, Ref } from 'vue';

export type ValidationValue = string | Record<string, any> | boolean | number;

export interface ValidationContextType {
  errors: Record<string, string>;
  isValid: Ref<boolean>;
  validateField: (fieldName: string, value: ValidationValue) => boolean;
  validateForm: () => boolean;
  getFormData: () => Record<string, ValidationValue>;
  removeField: (fieldName: string) => void;
  setFieldValue: (fieldName: string, value: ValidationValue) => void;
}

// Create a Symbol as injection key
export const ValidationKey: InjectionKey<ValidationContextType> = Symbol('ValidationContext');

// Create a function to provide validation context
export function createValidationContext(validationRules: Record<string, Array<{
  validate: (value: ValidationValue, formData?: Record<string, ValidationValue>) => boolean;
  message: string;
}>>) {
  const errors = reactive<Record<string, string>>({});
  const isValid = ref(true);
  const formData = reactive<Record<string, ValidationValue>>({});

  const validateField = (fieldName: string, value: ValidationValue): boolean => {
    formData[fieldName] = value;
    const rules = validationRules[fieldName];
    if (!rules) return true;

    for (const rule of rules) {
      if (!rule.validate(value, formData)) {
        errors[fieldName] = rule.message;
        return false;
      }
    }

    // If all rules pass, delete any previous error
    if (fieldName in errors) {
      delete errors[fieldName];
    }
    
    return true;
  };

  const removeField = (fieldName: string): void => {
    delete formData[fieldName];
    if (fieldName in errors) {
      delete errors[fieldName];
    }
  };

  const setFieldValue = (fieldName: string, value: ValidationValue): void => {
    formData[fieldName] = value;
  };

  const validateForm = (): boolean => {
    let formIsValid = true;
    
    // Check only fields that exist in formData
    Object.keys(formData).forEach(fieldName => {
      const value = formData[fieldName];
      const rules = validationRules[fieldName];

      if (!rules) return;

      for (const rule of rules) {
        if (!rule.validate(value, formData)) {
          errors[fieldName] = rule.message;
          formIsValid = false;
          break;
        }
      }
    });

    isValid.value = formIsValid;
    return formIsValid;
  };

  const getFormData = (): Record<string, ValidationValue> => {
    return { ...formData };
  };

  const context: ValidationContextType = {
    errors: readonly(errors) as Record<string, string>,
    isValid,
    validateField,
    validateForm,
    getFormData,
    removeField,
    setFieldValue
  };

  provide(ValidationKey, context);

  return context;
}

// Create a composable to use validation context
export function useValidation(): ValidationContextType {
  const context = inject(ValidationKey);
  if (!context) {
    throw new Error('useValidation must be used within a Validator component');
  }
  return context;
} 