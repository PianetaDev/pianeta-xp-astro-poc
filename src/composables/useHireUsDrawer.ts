// TODO: stub during Astro 5 migration. Original used Nuxt auto-imports (useState, useFetch, navigateTo).
// Re-implement with vanilla Vue 3 + fetch when wiring real islands.
import { ref } from 'vue';
export default function () {
  return { state: ref(null) };
}
