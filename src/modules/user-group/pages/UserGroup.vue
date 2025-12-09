<script setup lang="ts">
import ScreenHeader from "@/sharedComponents/ScreenHeader.vue";
import PageHeader from "@/sharedComponents/PageHeader.vue";
import DynamicTable from "@/sharedComponents/DynamicTable.vue";
import { ref, computed } from "vue";
import { defineEmits } from "vue";

import { useI18n } from "vue-i18n";

const { t } = useI18n();

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
        { field: 'GroupName', header: t('userGroup.groupName'), type: 'slot', sortable: true },
        { field: 'Description', header: t('userGroup.description'), sortable: true },
        { field: 'AssignedRoles', header:t('userGroup.assignedRoles'), sortable: true, type: 'tag', Class: 'custom-tag' },
        { field: 'UserCount', header:t('userGroup.userCount'), sortable: true, type: 'badge', Class: 'custom-badge' },
        { field: 'Created', header:t('userGroup.created'), sortable: true },
        { field: 'permission', header:t('permission') },
        { field: 'action', header:t('action') }
    ];

    return Columns;
});


</script>

<template>
    <div class="p-6 w-full h-full bg-gray-100">
        <ScreenHeader title="layout.accessControl" subtitle="userGroup.userGroup" />
        <card class="bg-[#ffffff] rounded-[10px]">
            <!-- PageHeader component -->
            <template #title>
                <PageHeader title="userGroup.userGroup" subtitle="userGroup.OrganizeUsersIntoGroupsAndAssignRoles"
                    :showExport="true" :showImport="true" :mainBtn="true" mainBtnText="userGroup.addUserGroup"
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