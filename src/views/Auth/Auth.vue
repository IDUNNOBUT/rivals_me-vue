<template>
  <div class="auth">
    <div class="auth__content">
      <div class="auth__image">
        <img width="580" height="220" src="../../assets/rivals-logo.webp" alt="logo">
      </div>
      
      <Validator :validationRules="validationRules">
        <Suspense>
          <template #default>
            <template v-if="currentMode === undefined">
              <h1 class="auth__title block font_roboto font_xl">
                <div>
                  <span class="auth__title_accent font_oswald font_accent">Rivals.me</span>
                  &nbsp;- сервис по отслеживанию игровой статистики в сессиях многопользовательского геройского шутера
                  Marvel Rivals
                </div>
              </h1>
              <Button
                caption="Log in"
                mode="rightSkew"
                :onClick="() => setMode('login')"
              >
                <UserLogo />
              </Button>
              <Button
                caption="New acc"
                mode="leftSkew"
                :onClick="() => setMode('register')"
              >
                <NewUserLogo />
              </Button>
            </template>
            <component v-else :is="currentForm" :setMode="setMode" />
          </template>
          <template #fallback>
            <div class="auth__skeleton">
              <Skeleton height="m" />
              <Skeleton height="m" />
              <Skeleton height="m" />
            </div>
          </template>
        </Suspense>
      </Validator>
    </div>
    
    <img 
      class="auth__background" 
      :src="backgroundImageUrl" 
      alt="Background"
    >
  </div>
</template>

<script setup lang="ts">
import { ref, shallowRef, defineAsyncComponent } from 'vue';
import { Button } from '../../components/Button';
import Skeleton from '../../components/Skeleton/Skeleton.vue';
import { Validator } from '../../components/Validator';
import type { ValidationValue } from '../../composables/useValidation';
import { UserLogo, NewUserLogo } from '../../assets';

const LoginForm = defineAsyncComponent(() => import('./LoginForm.vue'));
const RegisterForm = defineAsyncComponent(() => import('./RegisterForm.vue'));

const currentMode = ref<'login' | 'register' | undefined>(undefined);

const backgroundImageUrl = `${import.meta.env.VITE_API_URL || ''}/public/background.webp`;

const validationRules = {
  email: [
    {
      validate: (value: ValidationValue) => typeof value === "string" && value.trim().length > 0,
      message: "Email is required"
    },
    {
      validate: (value: ValidationValue) => {
        if (typeof value !== "string") return false;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
      },
      message: "Please enter a valid email address"
    }
  ],
  password: [
    {
      validate: (value: ValidationValue) => typeof value === "string" && value.trim().length > 0,
      message: "Password is required"
    },
    {
      validate: (value: ValidationValue) => {
        if (typeof value !== "string") return false;
        return value.length >= 6;
      },
      message: "Password must be at least 6 characters long"
    }
  ],
  nickname: [
    {
      validate: (value: ValidationValue) => typeof value === "string" && value.trim().length > 0,
      message: "Nickname is required"
    }
  ],
  repeatPassword: [
    {
      validate: (value: ValidationValue, formData?: Record<string, ValidationValue>) => {
        if (typeof value !== "string") return false;
        if (!formData) return value.trim().length > 0;

        const password = formData.password;
        if (typeof password !== "string") return false;

        return value === password;
      },
      message: "Passwords do not match"
    }
  ]
};

const currentForm = shallowRef<any>(LoginForm);

const setMode = (mode?: 'login' | 'register') => {
  currentMode.value = mode;
  
  if (mode === 'login') {
    currentForm.value = LoginForm;
  } else if (mode === 'register') {
    currentForm.value = RegisterForm;
  }
};
</script>

<style lang="scss">
.auth {
  height: 100%;
  display: grid;
  place-items: center;
  overflow: auto;
  position: relative;
  isolation: isolate;

  &__content {
    max-width: 600px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    padding: .625rem;
  }

  &__image {
    img {
      width: 100%;
      height: auto;
      aspect-ratio: 580/220;
    }
  }

  &__background {
    position: absolute;
    inset: 0;
    object-fit: cover;
    object-position: center;
    height: 100%;
    width: 100%;
    z-index: -1;
    filter: blur(4px);
  }
  
  &__title {
    text-align: center;
    margin-bottom: 1rem;
    
    &_accent {
      color: var(--accent);
    }
  }

  &__form {
    align-items: end;

    &-actions {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
    
    &-error {
      margin-top: 1rem;
      text-align: center;
    }
  }

  &__skeleton {
    align-items: center;
    justify-content: center;
    min-width: 300px;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
}
</style> 