<script setup lang="ts">
import ScreenHeader from "@/sharedComponents/ScreenHeader.vue";
import PageHeader from "@/sharedComponents/PageHeader.vue";
import DynamicTable from "@/sharedComponents/DynamicTable.vue";
import { ref, computed } from "vue";
import { defineEmits } from "vue";

const props = defineProps({
    data: {
        type: Array,
        default: () => [
            {
                id: 1,
                GroupName: 'Finance Team',
                Description: 'Manage payment, budget..',
                AssignedRoles: "Administration",
                UserCount: '2',
                slot: 'test1',
                Created: 'Oct 11, 2025',

            },
            {
                id: 1,
                GroupName: 'Finance Team',
                Description: 'Manage payment, budget..',
                AssignedRoles: "Administration",
                UserCount: '2',
                slot: 'test1',
                Created: 'Oct 11, 2025',

            },
            {
                id: 1,
                GroupName: 'Finance Team',
                Description: 'Manage payment, budget..',
                AssignedRoles: "Administration",
                UserCount: '2',
                slot: 'test1',
                Created: 'Oct 11, 2025',

            },
            {
                id: 1,
                GroupName: 'Finance Team',
                Description: 'Manage payment, budget..',
                AssignedRoles: "Administration",
                UserCount: '2',
                slot: 'test1',
                Created: 'Oct 11, 2025',

            },
            {
                id: 1,
                GroupName: 'Finance Team',
                Description: 'Manage payment, budget..',
                AssignedRoles: "Administration",
                UserCount: '2',
                slot: 'test1',
                Created: 'Oct 11, 2025',

            },
            {
                id: 1,
                GroupName: 'Finance Team',
                Description: 'Manage payment, budget..',
                AssignedRoles: "Administration",
                UserCount: '2',
                slot: 'test1',
                Created: 'Oct 11, 2025',

            },
            {
                id: 1,
                GroupName: 'Finance Team',
                Description: 'Manage payment, budget..',
                AssignedRoles: "Administration",
                UserCount: '2',
                slot: 'test1',
                Created: 'Oct 11, 2025',

            },
            {
                id: 1,
                GroupName: 'Finance Team',
                Description: 'Manage payment, budget..',
                AssignedRoles: "Administration",
                UserCount: '2',
                slot: 'test1',
                Created: 'Oct 11, 2025',

            },
            {
                id: 1,
                GroupName: 'Finance Team',
                Description: 'Manage payment, budget..',
                AssignedRoles: "Administration",
                UserCount: '2',
                slot: 'test1',
                Created: 'Oct 11, 2025',

            }, {
                id: 1,
                GroupName: 'Finance Team',
                Description: 'Manage payment, budget..',
                AssignedRoles: "Administration",
                UserCount: '2',
                slot: 'test1',
                Created: 'Oct 11, 2025',

            }, {
                id: 1,
                GroupName: 'Finance Team',
                Description: 'Manage payment, budget..',
                AssignedRoles: "Administration",
                UserCount: '2',
                slot: 'test1',
                Created: 'Oct 11, 2025',

            }, {
                id: 1,
                GroupName: 'Finance Team',
                Description: 'Manage payment, budget..',
                AssignedRoles: "Administration",
                UserCount: '2',
                slot: 'test1',
                Created: 'Oct 11, 2025',

            }, {
                id: 1,
                GroupName: 'Finance Team',
                Description: 'Manage payment, budget..',
                AssignedRoles: "Administration",
                UserCount: '2',
                slot: 'test1',
                Created: 'Oct 11, 2025',

            }, {
                id: 1,
                GroupName: 'Finance Team',
                Description: 'Manage payment, budget..',
                AssignedRoles: "Administration",
                UserCount: '2',
                slot: 'test1',
                Created: 'Oct 11, 2025',

            }, {
                id: 1,
                GroupName: 'Finance Team',
                Description: 'Manage payment, budget..',
                AssignedRoles: "Administration",
                UserCount: '2',
                slot: 'test1',
                Created: 'Oct 11, 2025',

            }, {
                id: 1,
                GroupName: 'Finance Team',
                Description: 'Manage payment, budget..',
                AssignedRoles: "Administration",
                UserCount: '2',
                slot: 'test1',
                Created: 'Oct 11, 2025',

            }, {
                id: 1,
                GroupName: 'Finance Team',
                Description: 'Manage payment, budget..',
                AssignedRoles: "Administration",
                UserCount: '2',
                slot: 'test1',
                Created: 'Oct 11, 2025',

            }, {
                id: 1,
                GroupName: 'Finance Team',
                Description: 'Manage payment, budget..',
                AssignedRoles: "Administration",
                UserCount: '2',
                slot: 'test1',
                Created: 'Oct 11, 2025',

            }, {
                id: 1,
                GroupName: 'Finance Team',
                Description: 'Manage payment, budget..',
                AssignedRoles: "Administration",
                UserCount: '2',
                slot: 'test1',
                Created: 'Oct 11, 2025',

            },
        ]
    },
});

const searchQuery = ref('');
const emit = defineEmits(['search', 'action-menu-click']);

const columns = computed(() => {
    const Columns = [
        { field: 'GroupName', header: 'Group Name', type: 'slot', sortable: true },
        { field: 'Description', header: 'Description', sortable: true },
        { field: 'AssignedRoles', header: 'Assigned Roles', sortable: true, type: 'tag', Class: 'custom-tag' },
        { field: 'UserCount', header: 'User Count', sortable: true, type: 'badge', Class: 'custom-badge' },
        { field: 'Created', header: 'Created', sortable: true },
        { field: 'permission', header: 'Permission' },
        { field: 'action', header: 'Action' }
    ];

    return Columns;
});

const onSearch = (query) => {
    searchQuery.value = query;
    emit('search', query);
};

</script>

<template>
    <div class="p-6 w-full h-full bg-gray-100">
        <ScreenHeader title="Access Control" subtitle="Roles & Permissions" />
        <card class="bg-[#ffffff] rounded-[10px]">
            <!-- PageHeader component -->
            <template #title>
                <PageHeader title="Users Group" subtitle="Organize users into groups and assign roles"
                    :showExport="true" :showImport="true" :mainBtn="true" mainBtnText="Add User Group"
                    searchPlaceholder="Search user group..." />
            </template>

            <!-- DynamicTable component -->
            <template #content>
                <DynamicTable :columns="columns" :data="data" :loading="loading" :menuItems="menuItems"
                    @action-menu-click="(payload) => emit('action-menu-click', payload)">
                    <template #col-GroupName="{ data }">
                        <div class="flex items-start gap-2 flex-wrap">
                            <VsxIcon iconName="People" :size="24" color="#717680" type="linear" />
                            <span class="break-words">{{ data.GroupName }}</span>
                        </div>
                    </template>
                </DynamicTable>
            </template>
        </card>
    </div>
</template>

<style scoped></style>