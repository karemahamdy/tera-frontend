<script setup>
import { ref } from "vue";
import { debounce } from "@/app/utils/debounce";
import BaseButton from "@/sharedComponents/BaseButton.vue";

const props = defineProps({
  showExport: { type: Boolean, default: false },
  exportText: { type: String, default: "Export" },
  onExport: { type: Function, default: null },
  filters: { type: Array, default: [] },
});

const emit = defineEmits(["filter-change", "search", "clear"]);

const onSearch = () => {
  emit("search", props.filters);
};
const onFilterChange = (filter, event) => {
  emit("filter-change", { filter, value: event.value });
};
const clearFilters = () => {
  props.filters.forEach((filter) => {
    filter.value = null;
  
  });
 emit("clear");
};
</script>

<template>
  <div class="flex flex-wrap justify-between items-center">
    <!-- Filters -->
    <div class="flex gap-[10px] mt-2 flex-nowrap">
      <component
        :is="filter.selectionMode === 'single' ? 'Dropdown' : 'MultiSelect'"
        v-for="(filter, index) in filters"
        :key="index"
        :maxSelectedLabels="3"
        v-model="filter.value"
        :options="filter.options"
        :placeholder="$t(filter.placeholder)"
        :optionLabel="filter.optionLabel || 'label'"
        :optionValue="filter.optionValue || 'value'"
        :showClear="filter.showClear"
        @change="(e) => onFilterChange(filter, e)"
        
      />
      
    </div>
    <div class="flex flex-wrap justify- md:justify-end gap-3">
      <template v-if="showExport">
        <BaseButton
          :label="$t('button.clearFilters')"
          variant="outline-primary"
          @click="clearFilters()"
        />
        <BaseButton
          :label="$t('button.search')"
          variant="primary"
          @click="onSearch"
        />
      </template>
      <slot name="actionBtn"></slot>
    </div>
  </div>
</template>

<style></style>
