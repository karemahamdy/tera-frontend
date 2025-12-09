<script setup>
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

const { t } = useI18n();

const props = defineProps({
    label: { type: String, required: true },
    variant: { type: String, default: "primary" },
    icon: { type: String, default: null },
    to: { type: [String, Object], default: null },
    onClick: { type: Function, default: null },
    block: { type: Boolean, default: false }
})

const router = useRouter()

function handleClick() {
    if (props.to) return router.push(props.to)
    if (props.onClick) return props.onClick()
}
</script>

<template>
    <Button v-slot="slotProps" asChild>

        <button @click="handleClick" :class="[
            'rounded-lg p-4  cursor-pointer flex items-center justify-center gap-2 h-[3rem] whitespace-nowrap',
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
</template>
