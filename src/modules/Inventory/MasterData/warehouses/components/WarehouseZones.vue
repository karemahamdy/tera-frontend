<script setup lang="ts">
import { ref, computed } from "vue";
import type { Zone, Location } from "../types/warehouse";

const props = defineProps<{
  modelValue?: Zone[];
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: Zone[]): void;
}>();

const newZone = ref({
  code: "",
  name: "",
  rows: "",
  columns: "",
  racks: ""
});

const isFormValid = computed(() => {
  return (
    newZone.value.code &&
    newZone.value.name &&
    Number(newZone.value.rows) > 0 &&
    Number(newZone.value.columns) > 0 &&
    Number(newZone.value.racks) > 0
  );
});

const generateLocations = (zoneCode: string, rows: number, cols: number, racks: number): Location[] => {
  const locs: Location[] = [];
  for (let r = 1; r <= rows; r++) {
    for (let c = 1; c <= cols; c++) {
      for (let k = 1; k <= racks; k++) {
        const rowStr = `R${r}`;
        const colStr = `C${String(c).padStart(2, '0')}`;
        const rackStr = `K${String(k).padStart(2, '0')}`;
        const code = `${zoneCode}-${rowStr}-${colStr}-${rackStr}`;
        locs.push({
          code,
          row: rowStr,
          column: colStr,
          rack: rackStr
        });
      }
    }
  }
  return locs;
};

const addZone = () => {
  if (!isFormValid.value) return;

  const rows = Number(newZone.value.rows);
  const cols = Number(newZone.value.columns);
  const racks = Number(newZone.value.racks);

  const locations = generateLocations(newZone.value.code, rows, cols, racks);

  const zone: Zone = {
    id: self.crypto.randomUUID(),
    code: newZone.value.code,
    name: newZone.value.name,
    rows,
    columns: cols,
    racks,
    locations,
    isExpanded: true
  };

  const updatedZones = [...(props.modelValue || []), zone];
  emit("update:modelValue", updatedZones);

  // Reset form
  newZone.value = {
    code: "",
    name: "",
    rows: "",
    columns: "",
    racks: ""
  };
};

const deleteZone = (id: string) => {
  const updatedZones = (props.modelValue || []).filter(z => z.id !== id);
  emit("update:modelValue", updatedZones);
};

const toggleExpand = (zone: Zone) => {
  zone.isExpanded = !zone.isExpanded;
};
</script>

<template>
  <div class="space-y-8">
    <!-- Zones Management Form -->
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-lg font-medium text-gray-900">Zones Management</h3>
          <p class="text-sm text-gray-500">Configure warehouse zones with storage locations</p>
        </div>
        <BaseButton 
          label="Add New" 
          icon="pi pi-plus" 
          size="small" 
          @click="addZone"
          :disabled="!isFormValid"
        />
      </div>

      <div class="grid grid-cols-1 gap-4">
        <!-- Zone Code and Name -->
        <div class="space-y-1">
          <label class="text-sm font-medium text-gray-700">Zone Code <span class="text-red-500">*</span></label>
          <InputText v-model="newZone.code" placeholder="Enter Zone Code" class="w-full" />
        </div>
        
        <div class="space-y-1">
          <label class="text-sm font-medium text-gray-700">Zone Name <span class="text-red-500">*</span></label>
          <InputText v-model="newZone.name" placeholder="Enter Zone Name" class="w-full" />
        </div>

        <!-- Rows, Columns, Racks -->
        <div class="grid grid-cols-3 gap-4">
          <div class="space-y-1">
            <label class="text-sm font-medium text-gray-700">Rows</label>
            <InputText v-model="newZone.rows" type="number" placeholder="Enter Rows" class="w-full" />
            <span class="text-xs text-blue-500 flex items-center gap-1">
              <i class="pi pi-info-circle"></i> Rows Numbers in Zone
            </span>
          </div>

          <div class="space-y-1">
            <label class="text-sm font-medium text-gray-700">Columns</label>
            <InputText v-model="newZone.columns" type="number" placeholder="Enter Columns" class="w-full" />
             <span class="text-xs text-blue-500 flex items-center gap-1">
              <i class="pi pi-info-circle"></i> Number of Columns in 1 Row
            </span>
          </div>

          <div class="space-y-1">
            <label class="text-sm font-medium text-gray-700">Racks</label>
            <InputText v-model="newZone.racks" type="number" placeholder="Enter Racks" class="w-full" />
            <span class="text-xs text-blue-500 flex items-center gap-1">
              <i class="pi pi-info-circle"></i> Number of Racks in 1 Column
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Zones Overview -->
    <div v-if="props.modelValue && props.modelValue.length > 0">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Zones Overview</h3>
      
      <div class="space-y-4">
        <div v-for="zone in props.modelValue" :key="zone.id" class="border rounded-lg bg-blue-50/50 border-blue-100 overflow-hidden">
          <!-- Zone Header -->
          <div class="p-4 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="font-medium text-gray-900">{{ zone.name }}</span>
              <span class="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">{{ zone.code }}</span>
            </div>
            <div class="flex items-center gap-2">
              <button class="text-blue-600 hover:text-blue-800" title="Edit">
                 <i class="pi pi-pencil"></i>
              </button>
              <button @click="deleteZone(zone.id)" class="text-red-600 hover:text-red-800" title="Delete">
                 <i class="pi pi-trash"></i>
              </button>
              <button @click="toggleExpand(zone)" class="text-gray-500 hover:text-gray-700">
                 <i :class="zone.isExpanded ? 'pi pi-chevron-up' : 'pi pi-chevron-down'"></i>
              </button>
            </div>
          </div>

          <!-- Zone Stats -->
          <div class="px-4 pb-4 flex justify-between text-center max-w-2xl">
             <div>
                <div class="text-xs text-gray-500">Rows</div>
                <div class="font-medium">{{ zone.rows }}</div>
             </div>
              <div>
                <div class="text-xs text-gray-500">Columns</div>
                 <div class="font-medium">{{ zone.columns }}</div>
             </div>
              <div>
                <div class="text-xs text-gray-500">Racks</div>
                 <div class="font-medium">{{ zone.racks }}</div>
             </div>
              <div>
                <div class="text-xs text-gray-500">Total Locations</div>
                 <div class="font-medium text-blue-600">{{ zone.locations.length }}</div>
             </div>
          </div>

          <!-- Generated Storage Locations Table -->
          <div v-if="zone.isExpanded" class="px-4 pb-4">
            <div class="font-medium mb-2 text-sm text-gray-700">Generated Storage Locations</div>
            <div class="bg-gray-50 rounded border overflow-hidden">
               <table class="w-full text-sm text-left">
                  <thead class="bg-gray-200 text-gray-700 bg-opacity-50">
                     <tr>
                        <th class="p-2 font-medium">Location Code</th>
                        <th class="p-2 font-medium">Row</th>
                        <th class="p-2 font-medium">Column</th>
                        <th class="p-2 font-medium">Rack</th>
                     </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-100">
                     <tr v-for="loc in zone.locations" :key="loc.code" class="hover:bg-blue-50/50">
                        <td class="p-2 text-blue-600 font-medium">{{ loc.code }}</td>
                        <td class="p-2">{{ loc.row }}</td>
                        <td class="p-2">{{ loc.column }}</td>
                        <td class="p-2">{{ loc.rack }}</td>
                     </tr>
                  </tbody>
               </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
