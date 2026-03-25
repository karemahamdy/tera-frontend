<script setup lang="ts">
import { ref } from "vue";

const getStatusBadge = (status: any) => {
    return status === "active" ? "status-active" : "status-inactive";
}
const getStatusText = (status: any) => {
    return status === "active" ? "status-text-active" : "status-text-inactive";
}

const versions = ref([
    {
        id: 1,
        version: "V2",
        status: "active",
        user: "John Smith",
        description: "Updated material costs and labor rates",
        date: "2024-01-15",
    },
    {
        id: 2,
        version: "V1",
        status: "inactive",
        user: "John Smith",
        description: "Initial BOM version created",
        date: "2024-01-10",
    },
]);
</script>
<template>
    <div class="space-y-4">
        <div v-for="item in versions" :key="item.id"
            class="flex justify-between items-center bg-gray-100 rounded-xl p-4">
            <!-- Left -->
            <div class="flex flex-col gap-2">
                <!-- Top Row -->
                <div class="flex items-center gap-3">
                    <span class="font-semibold text-gray-700">
                        {{ item.version }}
                    </span>
                    <div :class="getStatusText(item.status)" class="flex items-center gap-2 w-fit">
                        <span :class="getStatusBadge(item.status)"></span>
                        <span class="capitalize">
                            {{ item.status }}
                        </span>
                    </div>
                </div>

                <!-- Changed By -->
                <span class="text-xl text-gray-700">
                    Changed by: {{ item.user }}
                </span>

                <!-- Description -->
                <span class="text-sm text-gray-500">
                    {{ item.description }}
                </span>
            </div>

            <!-- Right -->
            <div class="flex flex-col items-end gap-3">
                <!-- Date -->
                <span class="text-md text-gray-500">
                    {{ item.date }}
                </span>

                <!-- Button -->
                <BaseButton label="button.view" icon="Eye" variant="outline-primary" block />

            </div>
        </div>
    </div>
</template>
<style scoped>
.status-active,
.status-inactive {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    display: inline-block;
}

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
    background-color: #D1FADF;
    padding: 4px 10px;
    border-radius: 50px;
    display: inline-flex;
    align-items: center;
}

.status-text-inactive {
    color: var(--color-warning-500);
    background-color: #FFF3E0;
    padding: 4px 10px;
    border-radius: 50px;
    display: inline-flex;
    align-items: center;
}
</style>