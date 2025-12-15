<script setup>
import { ref, computed } from "vue";
const emit = defineEmits([
    "edit",
    "view",
    "delete",
    "permission",
    "resetPassword",
    "custom"
]);

const props = defineProps({
    showEdit: { type: Boolean, default: true },
    showView: { type: Boolean, default: true },
    showDelete: { type: Boolean, default: true },
    resetPassword: { type: Boolean, default: true },
    showPermission: { type: Boolean, default: false },
    customItems: { type: Array, default: () => [] }
});

const menu = ref(null);
const currentRow = ref(null);
const toggleMenu = (event, row) => {
    currentRow.value = row;
    menu.value.show(event);
};
defineExpose({
    toggle: toggleMenu
});

const menuItems = computed(() => {
    const items = [];
    // if (props.showView) {
    //     items.push({
    //         label: "View",
    //         icon: "Eye",
    //         color: "#3F5FAC",
    //         command: () => emit("view", currentRow.value)
    //     });
    // }
  
    if (props.showEdit) {
        items.push({
            label: "Edit",
            icon: "Edit",
            color: "#F79009",
            command: () => emit("edit", currentRow.value)
        });
    }

    if (props.showDelete) {
        items.push({
            label: "Delete",
            icon: "Trash",
            color: "#F04438",
            command: () => emit("delete", currentRow.value)
        });
    }

    if (props.customItems.length) {
        props.customItems.forEach(item => {
            items.push({
                label: item.label,
                icon: item.icon,
                color: item.color,
                slot: item.slot,
                changeStatus: item.changeStatus,
                command: () => {
                    emit("custom", {
                        action: item.action,
                        data: currentRow.value
                    });
                }
            });

        });
    }


    return items;
});
</script>

<template>
    <Menu ref="menu" :model="menuItems" popup>
        <template #item="{ item, props }">
            <!-- Toggle -->
            <div v-if="item.changeStatus" class="flex items-center px-3 py-2 cursor-pointer" @click.stop="item.command">
                <ToggleSwitch v-model="item.modelValue" />
                <span class="ml-2">{{ item.label }}</span>
            </div>
            <a v-else class="flex items-center px-3 py-2 cursor-pointer" @click="item.command">
                <VsxIcon :iconName="item.icon" :size="20" :color="item.color" />
                <span class="ml-2">{{ item.label }}</span>
            </a>
        </template>
    </Menu>

</template>

<style scoped>
a.p-menuitem-link:hover {
    background: var(--color-primary-25);
}
</style>
