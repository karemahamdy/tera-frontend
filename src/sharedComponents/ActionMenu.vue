<script setup>
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n();

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
    if (props.showEdit) {
        items.push({
            label:t("button.edit"),
            icon: "Edit",
            color: "#F79009",
            command: () => emit("edit", currentRow.value)
        });
    }

    if (props.showDelete) {
        items.push({
            label:t("button.delete"),
            icon: "Trash",
            color: "#F04438",
            command: () => emit("delete", currentRow.value)
        });
    }
  if (props.customItems.length) {
    props.customItems.forEach(item => {
      items.push({
        ...item,
        modelValue: currentRow.value
          ? currentRow.value[item.key]
          : false,
        command: (val) => {
          emit("custom", {
            action: item.action,
            data: currentRow.value,
            value: val
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
                 <ToggleSwitch
      :modelValue="item.modelValue"
      @update:modelValue="item.command"
    />
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
