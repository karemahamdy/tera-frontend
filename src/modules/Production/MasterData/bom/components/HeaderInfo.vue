<script lang="ts" setup>
const props = defineProps<{
  data: any;
}>();

const getStatusBadge = (isActive: boolean) =>
  isActive ? "status-active" : "status-inactive";

const getStatusText = (isActive: boolean) =>
  isActive ? "status-text-active" : "status-text-inactive";
</script>

<template>
  <div class="rounded-[12px] w-full h-full bg-gray-50">
    <div class="grid grid-cols-3 gap-16 p-4">
      <div class="flex flex-col gap-2">
        <span class="text-lg text-[#A4A7AE]">{{ $t('BOM.Code') }}</span>
        <span class="text-[#101828] text-base font-medium">{{ data?.bomCode ?? '—' }}</span>
      </div>
      <div class="flex flex-col gap-2">
        <span class="text-lg text-[#A4A7AE]">{{ $t('BOM.Name') }}</span>
        <span class="text-[#101828] text-base font-medium">{{ data?.bomName ?? '—' }}</span>
      </div>
      <div class="flex flex-col gap-2">
        <span class="text-lg text-[#A4A7AE]">{{ $t('BOM.FinalProduct') }}</span>
        <span class="text-[#101828] text-base font-medium">
          {{ data?.parentItemName ?? '—' }} ({{ data?.parentItemCode ?? '' }})
        </span>
      </div>
    </div>
    <div class="grid grid-cols-3 gap-16 p-4">
      <div class="flex flex-col gap-2">
        <span class="text-lg text-[#A4A7AE]">{{ $t('BOM.Quantity') }}</span>
        <span class="text-[#101828] text-base font-medium">
          {{ data?.baseQuantity ?? '—' }} {{ data?.uomName ?? '' }}
        </span>
      </div>
      <div class="flex flex-col gap-2">
        <span class="text-lg text-[#A4A7AE]">{{ $t('BOM.Version') }}</span>
        <span class="text-[#101828] text-base font-medium">V{{ data?.version ?? '—' }}</span>
      </div>
      <div class="flex flex-col gap-2">
        <span class="text-lg text-[#A4A7AE]">{{ $t('BOM.Status') }}</span>
        <div :class="getStatusText(data?.isActive)" class="flex items-center gap-2 w-fit">
          <span :class="getStatusBadge(data?.isActive)"></span>
          <span class="capitalize">
            {{ data?.isActive ? $t('button.active') : $t('button.inactive') }}
          </span>
        </div>
      </div>
    </div>
    <div class="grid grid-cols-1 p-4" v-if="data?.notes">
      <div class="flex flex-col gap-2">
        <span class="text-lg text-[#A4A7AE]">{{ $t('BOM.Notes') }}</span>
        <span class="text-[#101828] text-base font-medium">{{ data.notes }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.status-active, .status-inactive {
  width: 8px; height: 8px;
  border-radius: 50%;
  display: inline-block;
}
.status-active { background: var(--color-success-500); outline: 1px solid var(--color-success-500); }
.status-inactive { background: var(--color-warning-500); outline: 1px solid var(--color-warning-500); }
.status-text-active {
  color: var(--color-success-500); background-color: #D1FADF;
  padding: 4px 10px; border-radius: 50px; display: inline-flex; align-items: center;
}
.status-text-inactive {
  color: var(--color-warning-500); background-color: #FFF3E0;
  padding: 4px 10px; border-radius: 50px; display: inline-flex; align-items: center;
}
</style>
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
