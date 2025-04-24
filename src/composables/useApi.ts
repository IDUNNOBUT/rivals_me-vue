import { ref } from 'vue';
import type { Ref } from 'vue';

interface UseApiState<T> {
  data: Ref<T | null>;
  isLoading: Ref<boolean>;
  error: Ref<Error | null>;
}

interface UseApiOptions {
  cacheKey?: string;
  initialLoading?: boolean;
}

const cache = new Map<string, any>();

export function useApi<T>(options: UseApiOptions = {}): UseApiState<T> & {
  execute: <R>(apiCall: () => Promise<R>) => Promise<R | undefined>;
  clearCache: (key?: string) => void;
} {
  const data = ref<T | null>(null) as Ref<T | null>;
  const isLoading = ref<boolean>(options.initialLoading ?? false);
  const error = ref<Error | null>(null);

  const execute = async <R>(apiCall: () => Promise<R>): Promise<R | undefined> => {
    const { cacheKey } = options;

    if (cacheKey && cache.has(cacheKey)) {
      const cachedData = cache.get(cacheKey) as R;
      data.value = cachedData as unknown as T;
      isLoading.value = false;
      error.value = null;
      return cachedData;
    }

    try {
      isLoading.value = true;
      error.value = null;
      const response = await apiCall();

      if (cacheKey) {
        cache.set(cacheKey, response);
      }

      data.value = response as unknown as T;
      isLoading.value = false;
      return response;
    } catch (err: any) {
      data.value = null;
      isLoading.value = false;
      error.value = err?.response?.data as Error || err;
      return undefined;
    }
  };

  const clearCache = (key?: string) => {
    if (key) {
      cache.delete(key);
    } else {
      cache.clear();
    }
  };

  return {
    data,
    isLoading,
    error,
    execute,
    clearCache,
  };
} 