<template>
    <div class="heading-section">
        <div class="flex flex-col">
            <h2 class="heading-title">{{ title }}</h2>
            <p class="subheading-title">{{ subtitle }}</p>
        </div>

        <div class="flex justify-end gap-4">
            <BaseButton v-for="(btn, index) in actionButtons" :key="index" :label="btn.label" :icon="btn.icon"
                :class="btn.class" :variant="btn.variant" @click="() => handleActionClick(btn)" />
        </div>
    </div>

    <div class="filters-section">
        <span class="p-input-icon-left search-input">
            <InputText v-model="searchQuery" :placeholder="searchPlaceholder" @input="onSearch" />
        </span>

        <Dropdown v-for="(filter, index) in filters" :key="index" v-model="filter.value" :options="filter.options"
            :placeholder="filter.placeholder" :optionLabel="filter.optionLabel || 'label'"
            :optionValue="filter.optionValue || 'value'" :showClear="filter.showClear"
            @change="(e) => onFilterChange(filter, e)" />
    </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from "vue";
import BaseButton from './BaseButton.vue';

const props = defineProps({
    title: {
        type: String,
        default: 'Users Management'
    },
    subtitle: {
        type: String,
        default: 'Manage user accounts and show all user information'
    },
    searchPlaceholder: {
        type: String,
        default: 'Search ..'
    },
    actionButtons: {
        type: Array,
        default: () => []
    },
    filters: {
        type: Array,
        default: () => []
    },
})

const emit = defineEmits(['search', 'filter-change', 'action-click']);

const searchQuery = ref('');

const onSearch = () => {
    emit('search', searchQuery.value);
};

const onFilterChange = (filter, event) => {
    emit('filter-change', { filter, value: event.value });
}

const handleActionClick = (btn) => {
    if (btn && typeof btn.onClick === 'function') btn.onClick();
    else emit('action-click', btn);
}
</script>

<style>
.filters-section {
    display: flex;
    gap: 10px;
    margin-bottom: 24px;
    flex-wrap: nowrap;
}

.search-input {
    flex: 1;
    min-width: 100px;
}

.search-input input {
    width: 100%;
}
</style>