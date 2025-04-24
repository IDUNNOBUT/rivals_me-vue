<template>
  <form class="auth__form block" @submit.prevent="handleSubmit">
    <ValidatedField name="email">
      <template v-slot="{ onChange }">
        <Input
          caption="Email"
          placeholder="Email"
          v-model="data.email"
          @update:modelValue="onChange"
        />
      </template>
    </ValidatedField>
    
    <ValidatedField name="password">
      <template v-slot="{ onChange }">
        <Input
          type="password"
          caption="Password"
          placeholder="Password"
          v-model="data.password"
          @update:modelValue="onChange"
        />
      </template>
    </ValidatedField>
    
    <div class="auth__form-actions">
      <Button
        caption="&lt;"
        :onClick="() => setMode(undefined)"
      />
      <Button
        type="submit"
        caption="Log in"
        mode="leftSkew"
        :onClick="() => {}"
      />
    </div>
    
    <div v-if="error" class="auth__form-error font_warning font_l font_roboto">{{ error }}</div>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { ValidatedField } from '../../components/Validator';
import { useUserStore } from '../../composables/useUserStore';
import { authApi } from '../../api/Auth';
import { useValidation } from '../../composables/useValidation';

interface Props {
  setMode: (mode?: 'login' | 'register') => void;
}

const props = defineProps<Props>();

const data = reactive({
  email: '',
  password: ''
});
const error = ref<string>();
const router = useRouter();
const { setUser } = useUserStore();
const { validateForm } = useValidation();

const handleSubmit = async (e: Event) => {
  e.preventDefault();
  if (!validateForm()) {
    return;
  }
  
  try {
    const response = await authApi.login(data);
    setUser(response.user);
    localStorage.setItem("token", response.accessToken);
    router.push('/');
  } catch (err: any) {
    error.value = err.response?.data?.message || 'An error occurred';
  }
};
</script> 