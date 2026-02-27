<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps<{
  visible: boolean;
  items: any[];
}>();

const emit = defineEmits(['update:visible', 'select']);

const searchQuery = ref('');

const isVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
});

const selectItem = (item: any) => {
  isVisible.value = false;
  emit('select', item);
};

const columns = computed(() => {
    return [
        { field: 'code', header: t('itemDialog.itemCode'), sortable: true },
        { field: 'name', header: t('itemDialog.itemName'), sortable: true },
        { field: 'baseUnitName', header: t('itemDialog.unit'), sortable: true },
        { field: 'action', header: '' }
    ];
});

const filteredItems = computed(() => {
    if (!searchQuery.value) return props.items;
    const query = searchQuery.value.toLowerCase();
    return props.items.filter((item: any) => 
        item.code?.toLowerCase().includes(query) || 
        item.name?.toLowerCase().includes(query)
    );
});
</script>

<template>
    <Dialog 
      v-model:visible="isVisible" 
      modal 
      :header="t('itemDialog.selectItem')" 
      :style="{ width: '60vw' }" 
      :breakpoints="{ '960px': '75vw', '641px': '90vw' }"
    >
        <div class="flex flex-col gap-4">
            <span class="w-full">
                <InputText 
                  v-model="searchQuery" 
                  :placeholder="t('itemDialog.search')" 
                  class="w-full bg-gray-50 border-gray-200" 
                />
            </span>
            
            <div class="overflow-hidden rounded-lg border border-gray-100">
                <DynamicTable 
                    :columns="columns" 
                    :data="filteredItems" 
                    :paginator="true" 
                    :rows="5"
                    :showView="false"
                    :showEdit="false"
                    :showDelete="false"
                >
                    <template #col-code="{ data }">
                        <div class="flex items-center gap-2">
                            <div class="w-7">
                                <Badge v-if="data.trackingType == 'Serial'" severity="success" class="circle-badge-sm">
                                    <VsxIcon iconName="Brodcast" :size="20" type="linear" />
                                </Badge>
                            </div>
                            <div class="text-base text-gray-700">{{ data.code }}</div>
                        </div>
                         
                    </template>
                    
                    <template #col-action="{ data }">
                        <div class="flex justify-end">
                            <BaseButton 
                              :label="t('itemDialog.add')" 
                              size="small" 
                              varient="primary" 
                              @click="selectItem(data)" 
                            />
                        </div>
                    </template>
                </DynamicTable>
            </div>
        </div>
    </Dialog>
</template>

<style scoped>
.circle-badge-sm {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;
}
.circle-badge {
 background-color: transparent;
}
.icon-transparent {
  color: transparent; 
}
</style>
