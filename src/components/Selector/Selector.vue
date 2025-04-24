<template>
  <div
    :class="[className, 'selector', 'selector__wrapper font_m', `selector__wrapper_caption-${captionPosition}`]"
  >
    {{ caption }}
    <div
      :class="['selector__content font_xs font_nunito font_white', isOpen ? 'selector__content_open' : '']"
      @click="!isOpen && (isOpen = !isOpen)"
    >
      <span class="selector__value">{{ selectedItem?.name }}</span>
      <svg 
        class="selector__arrow" 
        :class="{ 'selector__arrow_open': isOpen }" 
        xmlns="http://www.w3.org/2000/svg" 
        width="14" 
        height="14" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        stroke-width="2" 
        stroke-linecap="round" 
        stroke-linejoin="round"
      >
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
      <div 
        v-if="isOpen" 
        class="selector__items" 
        ref="itemsRef"
      >
        <div
          v-for="item in items"
          :key="item.id"
          :title="item.name"
          :class="['selector__item', item.id === modelValue ? 'selector__item_selected font_accent' : '']"
          @click="selectItem(item)"
        >
          {{ item.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, onBeforeUnmount } from 'vue';

interface ISelectorItem {
  id: string | boolean | number | undefined;
  name: string;
}

const DEFAULT_RESET_VALUE: ISelectorItem = {
  id: undefined,
  name: "All"
};

export default defineComponent({
  name: 'Selector',
  props: {
    className: {
      type: String,
      default: undefined
    },
    modelValue: {
      type: [String, Boolean, Number],
      default: undefined
    },
    caption: {
      type: String,
      default: undefined
    },
    captionPosition: {
      type: String,
      default: 'left',
      validator: (value: string) => ['left', 'top'].includes(value)
    },
    data: {
      type: Array as () => ISelectorItem[],
      required: true
    },
    resetValue: {
      type: Object as () => ISelectorItem,
      default: () => DEFAULT_RESET_VALUE
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const isOpen = ref(false);
    const itemsRef = ref<HTMLElement | null>(null);
    
    const items = computed(() => {
      return [props.resetValue, ...props.data];
    });
    
    const selectedItem = computed(() => {
      return items.value.find(item => item.id === props.modelValue);
    });
    
    const selectItem = (item: ISelectorItem) => {
      emit('update:modelValue', item);
      isOpen.value = false;
    };
    
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen.value && itemsRef.value && !itemsRef.value.parentElement?.contains(event.target as Node)) {
        isOpen.value = false;
      }
    };
    
    onMounted(() => {
      document.addEventListener('mousedown', handleClickOutside);
    });
    
    onBeforeUnmount(() => {
      document.removeEventListener('mousedown', handleClickOutside);
    });
    
    return {
      isOpen,
      itemsRef,
      items,
      selectedItem,
      selectItem
    };
  }
});
</script>

<style lang="scss">
.selector {
  cursor: pointer;

  &__wrapper {
    display: inline-flex;
    align-items: center;
    gap: .5rem;

    &_caption-top {
      flex-direction: column;
      align-items: flex-start;
    }
  }

  &__content {
    padding: .5rem;
    border-radius: .625rem;
    background-color: var(--secondary);
    position: relative;
    min-width: 108px;
    max-width: 180px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: .5rem;

    &_open {
      border-radius: .625rem .625rem 0 0;
    }
  }

  &__arrow {
    transition: transform .3s ease-in-out;

    &_open {
      transform: rotate(180deg);
    }
  }

  &__items {
    z-index: 50;
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    padding: .5rem;
    background-color: var(--secondary);
    display: flex;
    flex-direction: column;
    gap: .5rem;
    border-radius: 0 0 .625rem .625rem;
    max-height: 108px;
    overflow-y: auto;
    scrollbar-color: var(--accent) var(--secondary);
    scrollbar-width: thin;
  }

  &__item {
    text-overflow: ellipsis;
    text-wrap: nowrap;
    overflow: hidden;
    flex-shrink: 0;
  }

  &__value {
    text-overflow: ellipsis;
    text-wrap: nowrap;
    overflow: hidden;
    text-decoration: underline;
  }
}
</style> 