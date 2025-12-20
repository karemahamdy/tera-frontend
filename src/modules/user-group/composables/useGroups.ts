// modules/user-groups/composables/useGroups.ts

import { ref, watch, computed } from "vue";
import { GroupService } from "../services/groupService";
import type { GroupApiItem, GroupTableItem } from "../types/groupList";

export function useGroups() {
    const loading = ref(false);
    const apiGroups = ref<GroupApiItem[]>([]);
    const tableData = ref<GroupTableItem[]>([]);

    const fetchGroups = async () => {
        loading.value = true;
        try {
            apiGroups.value = await GroupService.getAll(1);
        } finally {
            loading.value = false;
        }
    };

    watch(
        apiGroups,
        (groups) => {
            tableData.value = groups.map((group) => ({
                id: group.id,
                GroupName: group.name,
                Description: group.description ?? "-",
                AssignedRoles: group.rolesAssingedToGroup.length
                    ? group.rolesAssingedToGroup.map((r) => r.name).join(", ")
                    : "-",
                UserCount: group.rolesAssingedToGroup.length,
                Created: "-",
            }));
        },
        { immediate: true }
    );

    const filteredTableData = computed(() =>
        tableData.value.map((row) => ({ ...row }))
    );

    return {
        loading,
        fetchGroups,
        filteredTableData,
    };
}
