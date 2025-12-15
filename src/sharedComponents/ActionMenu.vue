<script setup>
import { ref, computed } from "vue";

const props = defineProps({
    onEdit: { type: Function, default: null },
    onView: { type: Function, default: null },
    onDelete: { type: Function, default: null },
    onPermission: { type: Function, default: null },
    showEdit: { type: Boolean, default: true },
    showView: { type: Boolean, default: true },
    showDelete: { type: Boolean, default: true },
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

    if (props.showView) {
        items.push({
            label: "View",
            icon: "Eye",
            color: "#3F5FAC",
            command: () => props.onView && props.onView(currentRow.value)
        });
    }

    if (props.showEdit) {
        items.push({
            label: "Edit",
            icon: "Edit",
            color: "#F79009",
            command: () => props.onEdit && props.onEdit(currentRow.value)
        });
    }

    if (props.showDelete) {
        items.push({
            label: "Delete",
            icon: "Trash",
            color: "#F04438",
            command: () => props.onDelete && props.onDelete(currentRow.value)
        });
    }

    if (props.customItems.length) {
        props.customItems.forEach(item => {
            items.push({
                ...item,
                command: () => item.command?.(currentRow.value)
            });
        });
    }
    
    return items;
});
</script>

<template>
    <Menu ref="menu" :model="menuItems" popup>
        <template #item="{ item }">
            <a class="p-menuitem-link flex items-center gap-2 py-2 px-3">
                <VsxIcon :iconName="item.icon" :size="20" :color="item.color" type="linear" />
                <span>{{ item.label }}</span>
            </a>
        </template>
    </Menu>
</template>

<style scoped>
a.p-menuitem-link:hover {
    background: var(--color-primary-25);
}
</style>
