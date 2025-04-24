<template>
  <div :class="['pagination', className]">
    <button
      class="pagination__arrow font_white font_xs"
      @click="() => pageChanged(currentPage - 1)"
      :disabled="currentPage === 1"
    >
      &lt;
    </button>

    <button
      class="pagination__page font_white font_xs font_nunito"
      :class="{ 'pagination__page_active': currentPage === 1 }"
      @click="() => pageChanged(1)"
    >
      1
    </button>

    <span
      v-if="pages > 3 && currentPage > 3"
      class="pagination__ellipsis font_nunito font_xs"
    >
      ...
    </span>

    <button
      v-if="currentPage > 2"
      class="pagination__page font_white font_xs font_nunito"
      @click="() => pageChanged(currentPage - 1)"
    >
      {{ currentPage - 1 }}
    </button>

    <button
      v-if="currentPage !== 1 && currentPage !== pages"
      class="pagination__page font_white font_xs font_nunito pagination__page_active"
      @click="() => pageChanged(currentPage)"
    >
      {{ currentPage }}
    </button>

    <button
      v-if="currentPage < pages - 1"
      class="pagination__page font_white font_xs font_nunito"
      @click="() => pageChanged(currentPage + 1)"
    >
      {{ currentPage + 1 }}
    </button>

    <span
      v-if="pages > 3 && currentPage < pages - 2"
      class="pagination__ellipsis font_nunito font_xs"
    >
      ...
    </span>

    <button
      v-if="pages > 1"
      class="pagination__page font_white font_xs font_nunito"
      :class="{ 'pagination__page_active': currentPage === pages }"
      @click="() => pageChanged(pages)"
    >
      {{ pages }}
    </button>
    
    <button
      class="pagination__arrow font_white font_xs"
      @click="() => pageChanged(currentPage + 1)"
      :disabled="currentPage >= pages"
    >
      &gt;
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  className?: string;
  pages: number;
  currentPage: number;
}>();

const emit = defineEmits<{
  (e: 'pageChanged', page: number): void;
}>();

function pageChanged(page: number) {
  emit('pageChanged', page);
}
</script>

<style lang="scss">
.pagination {
  display: flex;
  align-items: center;
  gap: 0.25rem;

  &__arrow,
  &__page {
    min-width: var(--icon-m);
    height: var(--icon-m);
    display: flex;
    align-items: center;
    justify-content: center;
    border: 0.0625rem solid var(--primary);
    border-radius: 0.25rem;
    background: var(--secondary);
    padding: .25rem;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: var(--accent);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  &__page {
    &_active {
      background: var(--accent);
      border-color: var(--accent);
    }
  }

  &__ellipsis {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: var(--icon-m);
    height: var(--icon-m);
  }
}
</style> 