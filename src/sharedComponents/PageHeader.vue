<script setup>
import { ref } from "vue";
import BaseButton from './BaseButton.vue';
import { debounce } from "@/app/utils/debounce";

const props = defineProps({
    title: { type: String, default: "" },
    subtitle: { type: String, default: "" },
    showSearch: { type: Boolean, default: true },
    searchPlaceholder: { type: String, default: 'Search ..' },
    showFilter: { type: Boolean, default: false},
    mainBtn: { type: Boolean, default: false },
    mainBtnText: { type: String, default: "" },
    onMainBtnClick: { type: Function, default: null },
    showExport: { type: Boolean, default: false },
    exportText: { type: String, default: "Export" },
    onExport: { type: Function, default: null },
    showImport: { type: Boolean, default: false },
    importText: { type: String, default: "Import" },
    onImport: { type: Function, default: null },
    filters: { type: Array, default: [] },
});

const emit = defineEmits(['search', 'filter-change', 'action-click']);

const onFilterChange = (filter, event) => {
    emit('filter-change', { filter, value: event.value });
}

const debouncedSearch = debounce((value) => {
  emit("search", value);
}, 500);

const onInput = (event) => {
  const value = event.target.value;
  debouncedSearch(value);
};

</script>

<template>
    <div class="heading-section flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <!-- Title + Subtitle -->
        <div class="flex flex-col">
            <h2 class="heading-title">{{ $t(title) }}</h2>
            <p class="subheading-title">{{ $t(subtitle) }}</p>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-wrap justify- md:justify-end gap-3">
            <!-- Import -->
            <BaseButton v-if="showImport" :label="$t('import')" icon="Import" variant="outline-primary"
                @click="onImport && onImport()" />
            <!-- Export -->
            <BaseButton v-if="showExport" :label="$t('export')" icon="Export" variant="outline-primary"
                @click="onExport && onExport()" />
            <!-- Main Button -->
            <BaseButton v-if="mainBtn" :label="$t(mainBtnText)" icon="AddSquare" variant="primary"
                :disabled="!mainBtnValid" @click="onMainBtnClick && onMainBtnClick()" />

            <slot name="actionBtn"></slot>
        </div>
    </div>

    <!-- Search + Filters -->
    <div class="flex gap-[10px]  mt-2 flex-nowrap">
        <span class="p-input-icon-left search-input">
            <InputText v-if="showSearch" v-model="searchQuery" :placeholder="$t(searchPlaceholder)"  @input="onInput"/>
        </span>
        <template v-if="showFilter">
            <Dropdown v-for="(filter, index) in filters" :key="index" v-model="filter.value" :options="filter.options"
                :placeholder="filter.placeholder" :optionLabel="filter.optionLabel || 'label'"
                :optionValue="filter.optionValue || 'value'" :showClear="filter.showClear"
                @change="(e) => onFilterChange(filter, e)" />
        </template>
    </div>
</template>


<style>
.search-input {
    flex: 1;
    min-width: 100px;
}

.search-input input {
    width: 100%;
    background-color: var(--color-gray-100);
}
</style>