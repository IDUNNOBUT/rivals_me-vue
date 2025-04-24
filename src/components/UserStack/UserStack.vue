<template>
  <Validator ref="validatorRef" :validationRules="validationRules">
    <form class="user-stack" @submit.prevent="handleSubmit">
      <div class="user-stack__header">
        <div class="user-stack__header-title font_accent font_xl">User Settings</div>
        <div class="user-stack__header-actions">
          <Button
            v-if="edit"
            type="submit"
            variant="secondary"
            :icon="true"
            @click="() => {}"
          >
            <SaveLogo />
          </Button>
          <Button
            v-else
            variant="secondary"
            :icon="true"
            @click="handleEditToggle"
          >
            <EditLogo />
          </Button>
          <Button
            variant="secondary"
            :icon="true"
            @click="close"
          >
            <CrossLogo />
          </Button>
        </div>
      </div>
      <div class="user-stack__body">
        <ValidatedField
          name="name"
          v-model="name"
        >
          <template v-slot="{ onChange }">
            <Input
              :readonly="!edit"
              caption="Username"
              placeholder="Enter your username"
              :modelValue="name"
              @update:modelValue="onChange"
            />
          </template>
        </ValidatedField>

        <template v-if="edit">
          <div v-if="editPassword" class="user-stack__password">
            <ValidatedField
              name="password"
              v-model="password"
            >
              <template v-slot="{ onChange }">
                <Input
                  :readonly="!edit"
                  caption="Password"
                  placeholder="Enter new password"
                  :modelValue="password"
                  @update:modelValue="onChange"
                />
              </template>
            </ValidatedField>
            <Button
              caption="Cancel change"
              fontSize="xs"
              variant="secondary"
              @click="handlePasswordEditToggle"
            />
          </div>
          <Button
            v-else
            class="user-stack__button"
            caption="Edit password"
            variant="secondary"
            :icon="true"
            @click="handlePasswordEditToggle"
          >
            <EditLogo />
          </Button>
        </template>
        <Button
          class="user-stack__button"
          variant="secondary"
          caption="Log out"
          @click="handleLogout"
        />
        <Button
          class="user-stack__button"
          variant="secondary"
          caption="Delete account"
          :icon="true"
          @click="handleDelete"
        >
          <TrashLogo />
        </Button>
      </div>
    </form>
  </Validator>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '../../composables/useUserStore';
import { Validator, ValidatedField } from '../Validator';
import Button from '../Button/Button.vue';
import Input from '../Input/Input.vue';
import { userApi } from '../../api/Users/UserApi';
import type { ValidationValue } from '../../composables/useValidation';
import { SaveLogo, EditLogo, CrossLogo, TrashLogo } from '../../assets';

interface Props {
  close: () => void;
}

const props = defineProps<Props>();
const userStore = useUserStore();
const validatorRef = ref<any>(null);

const name = ref(userStore.user?.name || '');
const password = ref('');
const edit = ref(false);
const editPassword = ref(false);

const validationRules = {
  name: [
    {
      validate: (value: ValidationValue) => typeof value === "string" && value.trim().length >= 3,
      message: "Username must be at least 3 characters long"
    },
    {
      validate: (value: ValidationValue) => typeof value === "string" && value.trim().length <= 20,
      message: "Username must be no more than 20 characters long"
    }
  ],
  password: [
    {
      validate: (value: ValidationValue) => {
        // Password validation is conditional
        if (!editPassword.value || value === '') return true;
        return typeof value === "string" && value.length >= 6;
      },
      message: "Password must be at least 6 characters long"
    },
    {
      validate: (value: ValidationValue) => {
        if (!editPassword.value || value === '') return true;
        return typeof value === "string" && value.length <= 20;
      },
      message: "Password must be no more than 20 characters long"
    }
  ]
};

const handleSubmit = async () => {
  if (!validatorRef.value?.validateForm()) {
    return;
  }

  const updateData: Record<string, string> = {};

  if (name.value !== userStore.user?.name) {
    updateData.name = name.value;
  }

  if (editPassword.value && password.value !== '') {
    updateData.password = password.value;
  }

  if (Object.keys(updateData).length === 0) {
    return;
  }

  try {
    const response = await userApi.updateUser(updateData);
    userStore.setUser(response);
    props.close();
  } catch (error: any) {
    alert(error.response?.data?.message || "An error occurred");
  }
};

const handleEditToggle = () => {
  edit.value = !edit.value;
  if (!edit.value) {
    editPassword.value = false;
  }
};

const handlePasswordEditToggle = () => {
  editPassword.value = !editPassword.value;
  if (!editPassword.value) {
    password.value = '';
  }
};

const handleLogout = () => {
  userStore.logout();
  props.close();
};

const handleDelete = async () => {
  try {
    await userApi.deleteUser();
    userStore.logout();
    props.close();
  } catch (error: any) {
    alert(error.response?.data?.message || "An error occurred");
  }
};

defineExpose({
  name,
  password,
  edit,
  editPassword,
  handleSubmit,
  handleEditToggle,
  handlePasswordEditToggle,
  handleLogout,
  handleDelete
});
</script>

<style lang="scss">
.user-stack {
  display: flex;
  flex-direction: column;
  padding: 1.5rem .625rem;
  gap: .625rem;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    &-actions {
      display: flex;
      gap: .625rem;
    }
  }

  &__body {
    display: flex;
    flex-direction: column;
    gap: .625rem;
  }

  &__button {
    align-self: flex-end;
  }

  &__password {
    display: flex;
    gap: .625rem;
    align-items: center;
  }
}
</style> 