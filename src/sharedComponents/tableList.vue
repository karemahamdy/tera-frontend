<template>
    <card class="users-management">
        <!-- Header Section -->
        <template #title>
            <div class="heading-section">
                <div class="flex flex-col">
                    <h2 class="heading-title">{{ title }}</h2>
                    <p class="subheading-title">{{ subtitle }}</p>
                </div>
                <!-- Dynamic Action Buttons -->
                <div class="flex justify-end gap-4">
                    <BaseButton v-for="(btn, index) in actionButtons" :key="index" :label="btn.label" :icon="btn.icon"
                        :class="btn.class" :variant="btn.variant" @click="btn.onClick" />
                </div>
            </div>


            <!-- Filters Section -->
            <div class="filters-section">
                <!-- Search Input -->
                <span class="p-input-icon-left search-input">
                    <i class="pi pi-search" />
                    <InputText v-model="searchQuery" :placeholder="searchPlaceholder" @input="onSearch" />
                </span>

                <!-- Dynamic Filters -->
                <Dropdown v-for="(filter, index) in filters" :key="index" v-model="filter.value"
                    :options="filter.options" :placeholder="filter.placeholder"
                    :optionLabel="filter.optionLabel || 'label'" :optionValue="filter.optionValue || 'value'"
                    :showClear="filter.showClear" @change="onFilterChange(filter, $event)" />
            </div>

        </template>
        <!-- Data Table -->
        <template #content>
            <DataTable :value="filteredData" :paginator="paginator" :rows="rows" :loading="loading"
                class="border-2 border-[#E7E6E8] rounded-md" :rowsPerPageOptions="[5, 10, 20, 50]"
                responsiveLayout="scroll">
                <!-- Dynamic Columns -->
                <Column v-for="col in columns" :key="col.field" :field="col.field" :header="col.header"
                    :sortable="col.sortable" :style="col.style">

                    <template #body="slotProps">
                        <!-- Avatar -->
                        <div v-if="col.type === 'avatar'" class="user-cell">
                            <i icon class="pi pi-arrow-right"></i>
                            <Avatar :image="slotProps.data.avatar"
                                :label="!slotProps.data.avatar ? slotProps.data.name.charAt(0) : ''" shape="circle"
                                class="user-avatar" />
                            <div class="flex flex-col">
                                <div class="text-base text-gray-700">{{ slotProps.data.name }}</div>
                                <div class="text-sm text-gray-500">{{ slotProps.data.email }}</div>
                          </div>          
                        </div>

                        <!-- Tag -->
                        <Tag v-else-if="col.type === 'tag'" :value="slotProps.data[col.field]" :class="col.Class" />

                        <!-- badge -->
                        <Badge v-else-if="col.type === 'badge'" :value="slotProps.data[col.field]"
                            :class="col.Class" />
                           <!-- Status Column -->
                        <div v-else-if="col.field === 'status'" class="flex  align-items-center gap-2">
                            <Badge :class="getStatusBadge(slotProps.data.status)"
                                style="border: 1px solid white;  align-items:center; margin-top:8px"></Badge>
                            <span :class="getStatusText(slotProps.data.status)">
                                {{ slotProps.data.status }}
                            </span>
                        </div>

                        <!-- Permission Icon -->
                        <Button v-else-if="col.field === 'permission'" icon="pi pi-shield" text rounded
                            severity="secondary" @click="onPermissionClick(slotProps.data)" />

                        <!-- Action Column -->
                        <Button v-else-if="col.field === 'action'" icon="pi pi-ellipsis-v" text rounded
                            @click="toggleMenu($event, slotProps.data)" />

                        <!-- Default Text -->
                        <span v-else>{{ slotProps.data[col.field] }}</span>
                    </template>
                </Column>
            </DataTable>

            <!-- Action Menu -->
            <Menu ref="menu" :model="menuItems" popup />
            <Dropdown classMenuItems=" w-[130px]">
                <span
                    class="text-lg inline-flex flex-col items-center justify-center h-8 w-8 rounded-full bg-gray-500-f7 dark:bg-slate-900 dark:text-slate-400">
                    <Icon icon="heroicons-outline:dots-vertical" />
                </span>
                <template #menus>
                    <menuItems v-for="(mneu, i) in actions" :key="i" as="div">
                        <div v-show="" id="f" as="button"
                            :class="`     
                  ${'hover:bg-slate-900 dark:hover:bg-slate-600 dark:hover:bg-opacity-70 hover:text-white'}
                   w-full border-b border-b-gray-500 border-opacity-10   px-4 py-2 text-sm dark:text-slate-300  last:mb-0 cursor-pointer first:rounded-t last:rounded-b flex  space-x-2 rtl:space-x-reverse items-center  capitalize `">
                            <span class="text-base">
                                <Icon :icon="mneu.icon" />
                            </span>
                            <span>{{ mneu.name }}</span>
                        </div>
                    </menuItems>
                </template>
            </Dropdown>
        </template>
    </card>
</template>

<script setup>
import { ref, computed } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import Avatar from 'primevue/avatar';
import Tag from 'primevue/tag';
import Menu from 'primevue/menu';
import BaseButton from './BaseButton.vue';

// Props
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
        default: 'Search Users..'
    },
    actionButtons: {
        type: Array,
        default: () => []
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
                placeholder: 'All Scopes',
                value: null,
                options: [
                    { label: 'All Scopes', value: null },
                    { label: 'Global', value: 'Global' },
                    { label: 'Branch', value: 'Branch' }
                ],
                field: 'accessScope'
            },
            {
                placeholder: 'All Department',
                value: null,
                options: [
                    { label: 'All Department', value: null },
                    { label: 'IT', value: 'IT' },
                    { label: 'Finance', value: 'Finance' },
                    { label: 'Sales', value: 'Sales' },
                    { label: 'HR', value: 'HR' }
                ],
                field: 'department'
            }
        ]
    },
    columns: {
        type: Array,
        default: () => [
            { field: 'user', header: 'User', type: 'avatar', sortable: true, icon: slotProps => 'pi pi-arrow-right' },
            { field: 'userGroup', header: 'User Group', sortable: true, type: 'tag', Class: 'group-tag' },
            { field: 'userGroup', header: 'User Group', sortable: true, type: 'tag', Class: slotProps => 'customclass' },
            { field: 'count', header: 'Count', sortable: true, type: 'badge', Class: 'group-badge' },
            { field: 'department', header: 'Department', sortable: true },
            { field: 'accessScope', header: 'Access Scope', sortable: true },
            { field: 'status', header: 'Status', sortable: true },
            { field: 'lastLogin', header: 'Last Login', sortable: true },
            { field: 'permission', header: 'Permission' },
            { field: 'action', header: 'Action' }
        ]
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

// Emits
const emit = defineEmits(['search', 'filter-change', 'permission-click', 'action-menu-click']);

// Refs
const searchQuery = ref('');
const menu = ref();
const selectedRow = ref(null);

// Provide module-level default action buttons so defineProps() isn't required to create
// closures at compile time (script setup hoists defineProps()). This avoids the
// "defineProps() cannot reference locally declared variables" error.
const defaultActionButtons = [
    {
        label: 'Import',
        icon: 'pi pi-download',
        class: 'p-button-outlined',
        variant: 'outline-primary',
        onClick: () => console.log('Import clicked')
    },
    {
        label: 'Export',
        icon: 'pi pi-upload',
        class: 'p-button-outlined',
        variant: 'outline-primary',
        onClick: () => console.log('Export clicked')
    },
    {
        label: 'Add User',
        icon: 'pi pi-plus',
        variant: 'primary',
        onClick: () => console.log('Add User clicked')
    }
];

// Use the prop value when provided, otherwise fall back to the module-level defaults.
const actionButtons = computed(() => (props.actionButtons && props.actionButtons.length) ? props.actionButtons : defaultActionButtons);

// Menu Items
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

    // Apply dropdown filters
    props.filters.forEach(filter => {
        if (filter.value && filter.field) {
            result = result.filter(item => item[filter.field] === filter.value);
        }
    });

    return result;
});

// Methods
const onSearch = () => {
    emit('search', searchQuery.value);
};

const onFilterChange = (filter, event) => {
    emit('filter-change', { filter, value: event.value });
};

const onPermissionClick = (data) => {
    emit('permission-click', data);
};

const toggleMenu = (event, data) => {
    selectedRow.value = data;
    menu.value.toggle(event);
};

const getStatusBadge = (status) => {

    return status === "Active" ? "status-active" : "status-inactive";
}

const getStatusText = (status) => {

    return status === "Active" ? "status-text-active" : "status-text-inactive";
}

</script>

<style scoped>
.users-management {
    padding: 24px;
    background: #ffffff;
    border-radius: 10px;
}

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

.user-cell {
    display: flex;
    align-items: center;
    gap: 12px;
    position: relative;
}

.user-avatar {
    width: 40px;
    height: 40px;
    background: #3b82f6;
}

.user-info {
    display: flex;
    flex-direction: column;
}

.user-name {
    font-weight: 500;
    color: #1f2937;
}

.group-tag {
    background: var(--color-primary-25);
    color: var(--color-gray-700);
    padding: 4px 12px;
    border-radius: 50px;
    font-size: 13px;
    font-weight: 300;
}

.group-badge {
    background: var(--color-gray-200);
    color: var(--color-gray-700);
    padding: 16px 12px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 500;
}

/* l,l, */
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
</style>