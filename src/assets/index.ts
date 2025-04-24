import { defineAsyncComponent } from 'vue';

// Иконки экспортируем с использованием defineAsyncComponent для ленивой загрузки
// Using defineAsyncComponent with proper viewBox preservation
export const UserLogo = defineAsyncComponent(() => import('./user.svg'));
export const SwordLogo = defineAsyncComponent(() => import('./sword.svg'));
export const AssistLogo = defineAsyncComponent(() => import('./assist.svg'));
export const CrossLogo = defineAsyncComponent(() => import('./cross.svg'));
export const NewUserLogo = defineAsyncComponent(() => import('./new-user.svg'));
export const SaveLogo = defineAsyncComponent(() => import('./save.svg'));
export const SearchLogo = defineAsyncComponent(() => import('./search.svg'));
export const SkullLogo = defineAsyncComponent(() => import('./skull.svg'));
export const EditLogo = defineAsyncComponent(() => import('./edit.svg'));
export const TrashLogo = defineAsyncComponent(() => import('./trash.svg'));
export const ArrowLogo = defineAsyncComponent(() => import('./arrow.svg'));