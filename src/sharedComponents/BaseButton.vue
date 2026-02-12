<script setup>
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

const { t } = useI18n();

const props = defineProps({
    label: { type: String, required: true },
    variant: { type: String, default: "primary" },
    icon: { type: String, default: null },
    to: { type: [String, Object], default: null },
    onClick: { type: Function, default: null },
    block: { type: Boolean, default: false },
    items: { type: Array, default: () => [] },
    hasMenu: { type: Boolean, default: false },
    type: { type: String, default: "button" },
})

const router = useRouter()
const menu = ref();

const toggle = (event) => {
    menu.value.toggle(event);
};
function handleClick(event) {
    if (props.hasMenu) return toggle(event);
    if (props.to) return router.push(props.to);
    if (props.onClick) return props.onClick();
}

const color = computed(() => {
    switch (props.variant) {
        case "primary":
        case "danger":
            return "#FFFFFF";
        case "ghost":
            return "#6B7280";
        case "outline-primary":
            return "#3F5FAC";
        default:
            return "#FFFFFF";
    }
});
</script>

<template>
    <Button v-slot="slotProps" asChild aria-haspopup="true" aria-controls="overlay_menu">
        <button :type=" to ? 'button' : type" @click="handleClick" :class="[
            'rounded-lg p-4  cursor-pointer flex items-center justify-center gap-2 h-12 whitespace-nowrap',
            block ? 'w-full' : '',
            variant === 'primary' && 'bg-primary-500 hover:bg-primary-600 text-[#FFFFFF] border-none px-8',
            variant === 'danger' && 'bg-danger-500 hover:bg-danger-600 text-[#FFFFFF] border-none px-16',
            variant === 'ghost' && 'bg-transparent hover:bg-gray-200 text-gray-500 border border-gray-500 px-16',
            variant === 'outline-primary' && 'bg-transparent hover:bg-primary-25 text-primary-500 border border-primary-500 px-8',
        ]">
            <VsxIcon v-if="icon" :iconName="icon" :size="24" :color=color type="linear" />
            <span>{{ t(label) }}</span>
        </button>
    </Button>
    <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
</template>
