<script setup>
import { ref, computed } from 'vue';
import PageHeader from './PageHeader.vue';
import DynamicTable from './DynamicTable.vue';
import BaseButton from './BaseButton.vue';

// Props
const props = defineProps({
    title: { type: String },
    subtitle: { type: String },
    searchPlaceholder: {
        type: String,
        default: 'Search ..'
    },
    filters: {
        type: Array,
        default: () => [
            {
                placeholder: 'All Groups',
                value: null,
                options: [
                    { label: 'All Groups', value: null },
                    { label: 'Administration', value: 'Administration' },
                    { label: 'Finance Team', value: 'Finance Team' },
                    { label: 'Sales Team', value: 'Sales Team' },
                    { label: 'HR Team', value: 'HR Team' }
                ],
                field: 'userGroup'
            },
            {
                placeholder: 'All status',
                value: null,
                options: [
                    { label: 'All status', value: null },
                    { label: 'Active', value: 'Active' },
                    { label: 'In active', value: 'In active' }
                ],
                field: 'status'
            },
             {
                placeholder: 'All status',
                value: null,
                options: [
                    { label: 'All status', value: null },
                    { label: 'Active', value: 'Active' },
                    { label: 'In active', value: 'In active' }
                ],
                field: 'status'
            },
             {
                placeholder: 'All status',
                value: null,
                options: [
                    { label: 'All status', value: null },
                    { label: 'Active', value: 'Active' },
                    { label: 'In active', value: 'In active' }
                ],
                field: 'status'
            }
        ]
    },
    columns: {
        type: Array,
        default: () => []
    },
    data: {
        type: Array,
        default: () => [
            {
                id: 1,
                name: 'John Moore',
                email: 'john@tera.com',
                avatar: null,
                userGroup: 'Administration',
                slot: 'test1',
                count: '2',
                department: 'IT',
                accessScope: 'Global',
                status: 'in Active',
                lastLogin: 'Oct 11, 2025'
            },
            {
                id: 2,
                name: 'Mick Taylor',
                email: 'mick@tera.com',
                avatar: null,
                badge: 'pi pi-star-fill',
                userGroup: 'Finance Team',
                slot: 'test12',
                count: '2',
                department: 'Finance',
                accessScope: 'Branch',
                status: 'Active',
                lastLogin: 'Nov 3, 2025'
            },
  {
                id: 2,
                name: 'Mick Taylor',
                email: 'mick@tera.com',
                avatar: null,
                badge: 'pi pi-star-fill',
                userGroup: 'Finance Team',
                slot: 'test12',
                count: '2',
                department: 'Finance',
                accessScope: 'Branch',
                status: 'Active',
                lastLogin: 'Nov 3, 2025'
            },  {
                id: 2,
                name: 'Mick Taylor',
                email: 'mick@tera.com',
                avatar: null,
                badge: 'pi pi-star-fill',
                userGroup: 'Finance Team',
                slot: 'test12',
                count: '2',
                department: 'Finance',
                accessScope: 'Branch',
                status: 'Active',
                lastLogin: 'Nov 3, 2025'
            },  {
                id: 2,
                name: 'Mick Taylor',
                email: 'mick@tera.com',
                avatar: null,
                badge: 'pi pi-star-fill',
                userGroup: 'Finance Team',
                slot: 'test12',
                count: '2',
                department: 'Finance',
                accessScope: 'Branch',
                status: 'Active',
                lastLogin: 'Nov 3, 2025'
            },  {
                id: 2,
                name: 'Mick Taylor',
                email: 'mick@tera.com',
                avatar: null,
                badge: 'pi pi-star-fill',
                userGroup: 'Finance Team',
                slot: 'test12',
                count: '2',
                department: 'Finance',
                accessScope: 'Branch',
                status: 'Active',
                lastLogin: 'Nov 3, 2025'
            },  {
                id: 2,
                name: 'Mick Taylor',
                email: 'mick@tera.com',
                avatar: null,
                badge: 'pi pi-star-fill',
                userGroup: 'Finance Team',
                slot: 'test12',
                count: '2',
                department: 'Finance',
                accessScope: 'Branch',
                status: 'Active',
                lastLogin: 'Nov 3, 2025'
            },  {
                id: 2,
                name: 'Mick Taylor',
                email: 'mick@tera.com',
                avatar: null,
                badge: 'pi pi-star-fill',
                userGroup: 'Finance Team',
                slot: 'test12',
                count: '2',
                department: 'Finance',
                accessScope: 'Branch',
                status: 'Active',
                lastLogin: 'Nov 3, 2025'
            },  {
                id: 2,
                name: 'Mick Taylor',
                email: 'mick@tera.com',
                avatar: null,
                badge: 'pi pi-star-fill',
                userGroup: 'Finance Team',
                slot: 'test12',
                count: '2',
                department: 'Finance',
                accessScope: 'Branch',
                status: 'Active',
                lastLogin: 'Nov 3, 2025'
            },  {
                id: 2,
                name: 'Mick Taylor',
                email: 'mick@tera.com',
                avatar: null,
                badge: 'pi pi-star-fill',
                userGroup: 'Finance Team',
                slot: 'test12',
                count: '2',
                department: 'Finance',
                accessScope: 'Branch',
                status: 'Active',
                lastLogin: 'Nov 3, 2025'
            },  {
                id: 2,
                name: 'Mick Taylor',
                email: 'mick@tera.com',
                avatar: null,
                badge: 'pi pi-star-fill',
                userGroup: 'Finance Team',
                slot: 'test12',
                count: '2',
                department: 'Finance',
                accessScope: 'Branch',
                status: 'Active',
                lastLogin: 'Nov 3, 2025'
            },  {
                id: 2,
                name: 'Mick Taylor',
                email: 'mick@tera.com',
                avatar: null,
                badge: 'pi pi-star-fill',
                userGroup: 'Finance Team',
                slot: 'test12',
                count: '2',
                department: 'Finance',
                accessScope: 'Branch',
                status: 'Active',
                lastLogin: 'Nov 3, 2025'
            },  {
                id: 2,
                name: 'Mick Taylor',
                email: 'mick@tera.com',
                avatar: null,
                badge: 'pi pi-star-fill',
                userGroup: 'Finance Team',
                slot: 'test12',
                count: '2',
                department: 'Finance',
                accessScope: 'Branch',
                status: 'Active',
                lastLogin: 'Nov 3, 2025'
            },  {
                id: 2,
                name: 'Mick Taylor',
                email: 'mick@tera.com',
                avatar: null,
                badge: 'pi pi-star-fill',
                userGroup: 'Finance Team',
                slot: 'test12',
                count: '2',
                department: 'Finance',
                accessScope: 'Branch',
                status: 'Active',
                lastLogin: 'Nov 3, 2025'
            },  {
                id: 2,
                name: 'Mick Taylor',
                email: 'mick@tera.com',
                avatar: null,
                badge: 'pi pi-star-fill',
                userGroup: 'Finance Team',
                slot: 'test12',
                count: '2',
                department: 'Finance',
                accessScope: 'Branch',
                status: 'Active',
                lastLogin: 'Nov 3, 2025'
            },  {
                id: 2,
                name: 'Mick Taylor',
                email: 'mick@tera.com',
                avatar: null,
                badge: 'pi pi-star-fill',
                userGroup: 'Finance Team',
                slot: 'test12',
                count: '2',
                department: 'Finance',
                accessScope: 'Branch',
                status: 'Active',
                lastLogin: 'Nov 3, 2025'
            },  {
                id: 2,
                name: 'Mick Taylor',
                email: 'mick@tera.com',
                avatar: null,
                badge: 'pi pi-star-fill',
                userGroup: 'Finance Team',
                slot: 'test12',
                count: '2',
                department: 'Finance',
                accessScope: 'Branch',
                status: 'Active',
                lastLogin: 'Nov 3, 2025'
            },  {
                id: 2,
                name: 'Mick Taylor',
                email: 'mick@tera.com',
                avatar: null,
                badge: 'pi pi-star-fill',
                userGroup: 'Finance Team',
                slot: 'test12',
                count: '2',
                department: 'Finance',
                accessScope: 'Branch',
                status: 'Active',
                lastLogin: 'Nov 3, 2025'
            },  {
                id: 2,
                name: 'Mick Taylor',
                email: 'mick@tera.com',
                avatar: null,
                badge: 'pi pi-star-fill',
                userGroup: 'Finance Team',
                slot: 'test12',
                count: '2',
                department: 'Finance',
                accessScope: 'Branch',
                status: 'Active',
                lastLogin: 'Nov 3, 2025'
            },  {
                id: 2,
                name: 'Mick Taylor',
                email: 'mick@tera.com',
                avatar: null,
                badge: 'pi pi-star-fill',
                userGroup: 'Finance Team',
                slot: 'test12',
                count: '2',
                department: 'Finance',
                accessScope: 'Branch',
                status: 'Active',
                lastLogin: 'Nov 3, 2025'
            },  {
                id: 2,
                name: 'Mick Taylor',
                email: 'mick@tera.com',
                avatar: null,
                badge: 'pi pi-star-fill',
                userGroup: 'Finance Team',
                slot: 'test12',
                count: '2',
                department: 'Finance',
                accessScope: 'Branch',
                status: 'Active',
                lastLogin: 'Nov 3, 2025'
            },  {
                id: 2,
                name: 'Mick Taylor',
                email: 'mick@tera.com',
                avatar: null,
                badge: 'pi pi-star-fill',
                userGroup: 'Finance Team',
                slot: 'test12',
                count: '2',
                department: 'Finance',
                accessScope: 'Branch',
                status: 'Active',
                lastLogin: 'Nov 3, 2025'
            },  {
                id: 2,
                name: 'Mick Taylor',
                email: 'mick@tera.com',
                avatar: null,
                badge: 'pi pi-star-fill',
                userGroup: 'Finance Team',
                slot: 'test12',
                count: '2',
                department: 'Finance',
                accessScope: 'Branch',
                status: 'Active',
                lastLogin: 'Nov 3, 2025'
            },  {
                id: 2,
                name: 'Mick Taylor',
                email: 'mick@tera.com',
                avatar: null,
                badge: 'pi pi-star-fill',
                userGroup: 'Finance Team',
                slot: 'test12',
                count: '2',
                department: 'Finance',
                accessScope: 'Branch',
                status: 'Active',
                lastLogin: 'Nov 3, 2025'
            },  {
                id: 2,
                name: 'Mick Taylor',
                email: 'mick@tera.com',
                avatar: null,
                badge: 'pi pi-star-fill',
                userGroup: 'Finance Team',
                slot: 'test12',
                count: '2',
                department: 'Finance',
                accessScope: 'Branch',
                status: 'Active',
                lastLogin: 'Nov 3, 2025'
            },
        ]
    },
    paginator: {
        type: Boolean,
        default: true
    },
    rows: {
        type: Number,
        default: 10
    },
    loading: {
        type: Boolean,
        default: false
    },
});

const emit = defineEmits(['search', 'filter-change', 'permission-click', 'action-menu-click']);

const searchQuery = ref('');
const menu = ref();
const selectedRow = ref(null);

const localFilters = ref(props.filters.map(f => ({ ...f })));

const columns = computed(() => {
    const Columns = [
        { field: 'user', header: 'User', type: 'avatar', sortable: true },
        { field: 'slot', header: 'slot', type: 'slot', sortable: true },
        { field: 'userGroup', header: 'User Group', sortable: true, type: 'tag', Class: 'custom-tag' },
        { field: 'count', header: 'Count', sortable: true, type: 'badge', Class: 'custom-badge' },
        { field: 'department', header: 'Department', sortable: true },
        { field: 'accessScope', header: 'Access Scope', sortable: true },
        { field: 'status', header: 'Status', sortable: true },
        { field: 'lastLogin', header: 'Last Login', sortable: true },
        { field: 'permission', header: 'Permission' },
        { field: 'action', header: 'Action' }
    ];

    return Columns;
});

const menuItems = ref([
    {
        label: 'Edit',
        icon: 'pi pi-pencil',
        command: () => emit('action-menu-click', { action: 'edit', data: selectedRow.value })
    },
    {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => emit('action-menu-click', { action: 'delete', data: selectedRow.value })
    },
    {
        label: 'View Details',
        icon: 'pi pi-eye',
        command: () => emit('action-menu-click', { action: 'view', data: selectedRow.value })
    }
]);

// Computed
const filteredData = computed(() => {
    let result = [...props.data];

    // Apply search filter
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        result = result.filter(item =>
            item.name?.toLowerCase().includes(query) ||
            item.email?.toLowerCase().includes(query)
        );
    }

    // Apply dropdown filters from localFilters
    localFilters.value.forEach(filter => {
        if (filter && filter.value != null && filter.field) {
            result = result.filter(item => item[filter.field] === filter.value);
        }
    });

    return result;
});

const onSearch = (query) => {
    searchQuery.value = query;
    emit('search', query);
};

const onFilterChange = (payload) => {
    const { filter, value } = payload || {};
    if (filter && Object.prototype.hasOwnProperty.call(filter, 'field')) {
        const idx = localFilters.value.findIndex(f => f.field === filter.field);
        if (idx !== -1) {
            localFilters.value[idx].value = value;
        }
    }
    emit('filter-change', payload);
};

const onPermissionClick = (data) => {
    emit('permission-click', data);
};

const toggleMenu = (event, data) => {
    selectedRow.value = data;
    menu.value.toggle(event);
};

</script>

<template>
    <card class="p-6 bg-[#ffffff] rounded-[10px]">
        <!-- PageHeader component -->
        <template #title>
            <PageHeader title="Users Management" subtitle="Manage user accounts" :showExport="true" :showImport="true"
                :onExport="exportData" :onImport="importData" :mainBtn="true" mainBtnText="Add User"
                mainBtnIcon="pi pi-plus" :onMainBtnClick="openDialog" :filters="filters" @search="onSearch"
                :searchPlaceholder="searchPlaceholder" @filter-change="onFilterChange" />              
        </template>

        <!-- DynamicTable component -->
        <template #content>
            <DynamicTable :columns="columns" :data="filteredData" :paginator="paginator" :rows="rows" :loading="loading"
                :rowsPerPageOptions="[5, 10, 20, 50]" :menuItems="menuItems" :getStatusBadge="getStatusBadge"
                :getStatusText="getStatusText" @action-menu-click="(payload) => emit('action-menu-click', payload)">
                <template #col-slot="{ data }">
                    <i class="pi pi-star text-yellow-500 text-xl"></i>
                    {{ data.slot }}
                </template>
            </DynamicTable>
        </template>
    </card>
</template>

<style scoped>
.user-cell {
    display: flex;
    align-items: center;
    gap: 12px;
    position: relative;
}

.custom-tag {
    background: var(--color-primary-25);
    color: var(--color-gray-700);
    padding: 4px 12px;
    border-radius: 50px;
    font-size: 13px;
    font-weight: 300;
}

.custom-badge {
    background: var(--color-gray-200);
    color: var(--color-gray-700);
    padding: 16px 12px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 500;
}

/* status */
.status-active {
    background: var(--color-success-500);
    outline: 1px solid var(--color-success-500);
}

.status-inactive {
    background: var(--color-warning-500);
    outline: 1px solid var(--color-warning-500);
}

.status-text-active {
    color: var(--color-success-500);
}

.status-text-inactive {
    color: var(--color-warning-500);
}

/*  */
:deep(.p-datatable .p-datatable-tbody > tr > td) {
    padding: 16px;
    color: var(--color-gray-500);
}

:deep(.p-datatable .p-datatable-thead > tr > th) {
    background: #FAF9F9;
    font-weight: 600;
    color: var(--color-gray-700);
    font-size: 13px;
    padding: 20px 16px;
}

.permission-btn {
    color: var(--color-primary-500);
}

.permission-btn:hover {
    color: var(--color-primary-500) !important;
    background-color: var(--color-primary-25) !important;
}
</style>