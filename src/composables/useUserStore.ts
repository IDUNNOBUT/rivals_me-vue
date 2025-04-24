import { ref, reactive, readonly, provide, inject } from 'vue';
import type { InjectionKey, Ref } from 'vue';
import type { Router } from 'vue-router';
import type { UserDto } from '../DTO/User.dto';
import { userApi } from '../api/Users/UserApi';
import { useApi } from './useApi';

// Create a shared state to be used across all instances
const userState = ref<UserDto | null>(null);
let routerInstance: Router | null = null;

export interface UserStore {
  user: UserDto | null;
  setUser: (user: UserDto) => void;
  logout: () => void;
  initialize: (router: Router) => Promise<void>;
}

const USER_STORE_KEY = Symbol() as InjectionKey<UserStore>;

export function createUserStore(): UserStore {
  const { execute } = useApi<UserDto>();
  
  const setUser = (user: UserDto) => {
    userState.value = user;
  };

  const logout = () => {
    userState.value = null;
    localStorage.removeItem('token');
    if (routerInstance) {
      routerInstance.push('/auth');
    }
  };
  
  const initialize = async (router: Router) => {
    // Save router reference
    routerInstance = router;
    
    // If we already have a user, no need to fetch again
    if (userState.value) {
      return;
    }
    
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await execute(() => userApi.getUser());
        if (response) {
          userState.value = response;
        }
      } catch (error) {
        if (routerInstance) {
          routerInstance.push('/auth');
        }
      }
    }
  };

  const store: UserStore = {
    get user() { return userState.value; },
    setUser,
    logout,
    initialize
  };

  provide(USER_STORE_KEY, store);
  
  return store;
}

export function useUserStore(): UserStore {
  const store = inject(USER_STORE_KEY);
  if (!store) {
    throw new Error('useUserStore must be used within a UserStoreProvider');
  }
  return store;
} 