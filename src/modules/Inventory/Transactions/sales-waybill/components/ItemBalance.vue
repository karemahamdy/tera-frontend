<script setup lang="ts">
import { useInventoryLookups } from "@/composables/useInventoryLookups";
import { ref, watchEffect } from "vue";

const { getItemBalance } = useInventoryLookups();

const props = defineProps<{
    itemId: string;
    warehouseId: string;
    zoneId?: string | null;
    locationId?: string | null;
    balanceValue?: number;
}>();
const emit = defineEmits(['update:balanceValue']);
const balance = ref<number | null>(null);

watchEffect(async () => {
    if (!props.itemId || !props.warehouseId) return;

    balance.value = await getItemBalance(
        props.itemId,
        props.warehouseId,
        props.zoneId,
        props.locationId
    );
    emit('update:balanceValue', balance.value)
});
</script>

<template>
    <div class="text-sm" :class="{
        'text-danger-500': balance && balance < 0
    }">
        {{ balance }}
    </div>
</template>