<script setup>
import { ref, defineProps, defineEmits } from "vue";
import BaseButton from './BaseButton.vue';
// import { useI18n } from "vue-i18n";


// const { t } = useI18n();

const props = defineProps({
    title: { type: String, default: "" },
    subtitle: { type: String, default: "" },
    showSearch: { type: Boolean, default: true },
    searchPlaceholder: { type: String, default: 'Search ..' },
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

const searchQuery = ref('');

const onSearch = () => {
    emit('search', searchQuery.value);
};

const onFilterChange = (filter, event) => {
    emit('filter-change', { filter, value: event.value });
}

</script>

<template>
    <div class="heading-section">
        
        <div class="flex flex-col">
            <h2 class="heading-title">{{ $t(title) }}</h2>
            <p class="subheading-title">{{ $t(subtitle) }}</p>
        </div>

        <div class="flex justify-end gap-3 flex-wrap">
               <!-- Import -->
            <BaseButton v-if="showImport" :label="$t('import')" icon="Import" variant="outline-primary"
                @click="onImport && onImport()" />
            <!-- Export -->
            <BaseButton v-if="showExport" :label="$t('export')"  icon="Export" variant="outline-primary"
                @click="onExport && onExport()" />
            <!-- Main Button -->
            <BaseButton v-if="mainBtn" :label="$t(mainBtnText)" icon="AddSquare"
                variant="primary" :disabled="!mainBtnValid"
                @click="onMainBtnClick && onMainBtnClick()" />
            <slot name="actionBtn"></slot>
        </div>
    </div>

    <div class="flex gap-[10px] mb-6 mt-2 flex-nowrap">
        <span class="p-input-icon-left search-input">
            <InputText v-model="searchQuery" :placeholder="searchPlaceholder" @input="onSearch" />
        </span>

        <Dropdown v-for="(filter, index) in filters" :key="index" v-model="filter.value" :options="filter.options"
            :placeholder="filter.placeholder" :optionLabel="filter.optionLabel || 'label'"
            :optionValue="filter.optionValue || 'value'" :showClear="filter.showClear"
            @change="(e) => onFilterChange(filter, e)" />
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