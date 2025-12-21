import { defineStore } from "pinia";
import { ref } from "vue";

export const useLoadingStore = defineStore("loading", () => {
  const loading = ref(false);
  const loadingText = ref<string | undefined>();

  function start(text?: string) {
    loading.value = true;
    loadingText.value = text;
  }

  function stop() {
    loading.value = false;
    loadingText.value = undefined;
  }

  return {
    loading,
    loadingText,
    start,
    stop,
  };
});
