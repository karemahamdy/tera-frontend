<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { WarehouseLocation } from '@/app/types/lookups';

const { t } = useI18n();

const props = defineProps<{
  visible: boolean;
  locations: WarehouseLocation[];
  selectedLocationId?: string | null;
}>();

const emit = defineEmits(['update:visible', 'select']);

const searchQuery = ref('');
const selectedId = ref<string | null>(props.selectedLocationId || null);

const isVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
});

const filteredLocations = computed(() => {
  if (!searchQuery.value) return props.locations;
  const query = searchQuery.value.toLowerCase();
  return props.locations.filter((loc: WarehouseLocation) => 
    loc.locationCode?.toLowerCase().includes(query) || 
    loc.zoneName?.toLowerCase().includes(query) ||
    loc.zoneCode?.toLowerCase().includes(query)
  );
});

const handleConfirm = () => {
    const selected = props.locations.find(loc => loc.id === selectedId.value);
    if (selected) {
        emit('select', selected);
        isVisible.value = false;
    }
};

const handleCancel = () => {
    isVisible.value = false;
};
</script>

<template>
  <Dialog 
    v-model:visible="isVisible" 
    modal 
    :header="t('locationPicker.title')" 
    :style="{ width: '65vw' }"
    class="location-picker-dialog"
  >
    <div class="flex flex-col gap-6 pt-2">
      <!-- Search -->
      <div>
        <InputText 
          v-model="searchQuery" 
          :placeholder="t('locationPicker.searchPlaceholder')" 
          class="w-full pl-12 bg-gray-50 border-none rounded-xl h-12 focus:ring-2 focus:ring-primary-100"
        />
      </div>

      <!-- Table Header -->
      <div class="border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-sm">
          <DataTable 
            :value="filteredLocations" 
            class="p-datatable-sm locations-table"
            dataKey="id"
            scrollable
            scrollHeight="400px"
          >
            <Column style="width: 4rem">
                <template #body="slotProps">
                    <div class="flex justify-center">
                        <RadioButton 
                            v-model="selectedId" 
                            :value="slotProps.data.id" 
                            name="location" 
                            class="custom-radio"
                        />
                    </div>
                </template>
            </Column>
            <Column field="locationCode" :header="t('locationPicker.locationCode')">
                <template #body="slotProps">
                    <span class="text-gray-600 font-medium">{{ slotProps.data.locationCode }}</span>
                </template>
            </Column>
            <Column field="zoneCode" :header="t('locationPicker.zoneCode')">
                <template #body="slotProps">
                    <span class="text-primary-600 font-bold">{{ slotProps.data.zoneCode }}</span>
                </template>
            </Column>
            <Column field="zoneName" :header="t('locationPicker.zone')">
                <template #body="slotProps">
                    <span class="text-gray-500">{{ slotProps.data.zoneName }}</span>
                </template>
            </Column>
            <Column field="row" :header="t('locationPicker.row')">
                <template #body="slotProps">
                    <span class="text-gray-500">{{ slotProps.data.row }}</span>
                </template>
            </Column>
            <Column field="column" :header="t('locationPicker.column')">
                <template #body="slotProps">
                    <span class="text-gray-500">{{ slotProps.data.column }}</span>
                </template>
            </Column>
            <Column field="rack" :header="t('locationPicker.rack')">
                <template #body="slotProps">
                    <span class="text-gray-500">{{ slotProps.data.rack }}</span>
                </template>
            </Column>
          </DataTable>
      </div>

      <!-- Footer -->
      <div class="flex gap-4 mt-2">
        <BaseButton 
            :label="t('button.cancel')" 
            variant="outline" 
            class="flex-1 !border-gray-200 !text-gray-500 h-12 rounded-xl font-semibold hover:bg-gray-50"
            @click="handleCancel"
        />
        <BaseButton 
            :label="t('locationPicker.confirmSelection')" 
            class="flex-1 bg-primary-600 border-none hover:bg-primary-700 h-12 rounded-xl font-bold text-white shadow-md shadow-primary-200"
            @click="handleConfirm"
        />
      </div>
    </div>
  </Dialog>
</template>

<style scoped>
:deep(.p-dialog) {
    border-radius: 1.5rem;
    box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
}
:deep(.p-dialog-header) {
  padding: 2rem 2rem 1rem;
  font-size: 1.5rem;
}
:deep(.p-dialog-title) {
    font-weight: 700;
    color: #111827;
}
:deep(.p-dialog-content) {
  padding: 0 2rem 2rem;
}
:deep(.p-datatable-thead > tr > th) {
  background-color: #f9fafb;
  color: #4b5563;
  font-weight: 600;
  border-bottom: 1px solid #f3f4f6;
  padding: 1.25rem 1rem;
  font-size: 0.875rem;
}
:deep(.p-datatable-tbody > tr > td) {
  padding: 1.25rem 1rem;
  border-bottom: 1px solid #f9fafb;
  font-size: 0.875rem;
}
:deep(.custom-radio.p-radiobutton .p-radiobutton-box) {
    border-radius: 50%;
    width: 1.25rem;
    height: 1.25rem;
    border: 2px solid #d1d5db;
}
:deep(.custom-radio.p-radiobutton.p-radiobutton-checked .p-radiobutton-box) {
    border-color: #3F5FAC;
    background: #3F5FAC;
}
:deep(.p-paginator) {
    border: none;
    padding: 1rem;
}
</style>
