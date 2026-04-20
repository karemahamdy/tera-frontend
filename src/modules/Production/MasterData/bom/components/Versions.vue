<script setup lang="ts">
import router from '@/app/router';

const props = defineProps<{
  versions: any[];
}>();

const handleEdit = (id: string) => {
  router.push(`/bom/view/${id}`);
};

const getStatusBadge = (isActive: boolean) =>
  isActive ? "status-active" : "status-inactive";

const getStatusText = (isActive: boolean) =>
  isActive ? "status-text-active" : "status-text-inactive";

const formatDate = (dateStr: string) =>
  dateStr ? new Date(dateStr).toLocaleDateString() : '—';
</script>

<template>
  <div class="space-y-4">
    <div
      v-for="item in versions"
      :key="item.id"
      class="flex justify-between items-center bg-gray-100 rounded-xl p-4"
    >
      <!-- Left -->
      <div class="flex flex-col gap-2">
        <div class="flex items-center gap-3">
          <span class="font-semibold text-gray-700">V{{ item.version }}</span>
          <div :class="getStatusText(item.isActive)" class="flex items-center gap-2 w-fit">
            <span :class="getStatusBadge(item.isActive)"></span>
            <span class="capitalize">
              {{ item.isActive ? $t('button.active') : $t('button.inactive') }}
            </span>
          </div>
        </div>
        <span class="text-xl text-gray-700">
          {{ $t('BOM.ChangedBy') }}: {{ item.changedBy }}
        </span>
        <span class="text-sm text-gray-500">{{ item.notes }}</span>
      </div>
      <!-- Right -->
      <div class="flex flex-col items-end gap-3">
        <span class="text-md text-gray-500">{{ formatDate(item.createdAt) }}</span>
        <BaseButton label="button.view" icon="Eye" variant="outline-primary" block @click="handleEdit(item.id)" />
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