<script setup lang="ts">
import { computed } from "vue";
import { useForm } from "vee-validate";
import { useI18n } from "vue-i18n";
import type { Zone, LocationRequest } from "../types/warehouse";
import { toastService } from "@/app/services/toastService";

const { t } = useI18n();

const props = defineProps<{
  modelValue?: Zone[];
  disabled?: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: Zone[]): void;
}>();

const { errors, defineField } = useForm({
  initialValues: {
    code: "",
    name: "",
    rows: "",
    columns: "",
    racks: ""
  }
});

const [code] = defineField("code");
const [name] = defineField("name");
const [rows] = defineField("rows");
const [columns] = defineField("columns");
const [racks] = defineField("racks");

const isFormValid = computed(() => {
  return (
    code.value &&
    name.value &&
    Number(rows.value) > 0 &&
    Number(columns.value) > 0 &&
    Number(racks.value) > 0
  );
});

const generateLocations = (
  zoneCode: string,
  rows: number,
  cols: number,
  racks: number
): LocationRequest[] => {
  const total = rows * cols * racks;
  const locations: LocationRequest[] = new Array(total);

  for (let i = 0; i < total; i++) {
    const r = Math.floor(i / (cols * racks)) + 1;            
    const c = Math.floor((i % (cols * racks)) / racks) + 1; 
    const k = (i % racks) + 1;                              

    const rowStr = `R${r}`;
    const colStr = `C${String(c).padStart(2, "0")}`;
    const rackStr = `K${String(k).padStart(2, "0")}`;

    locations[i] = {
      code: `${zoneCode}-${rowStr}-${colStr}-${rackStr}`,
      row: rowStr,
      column: colStr,
      rack: rackStr
    };
  }

  return locations;
};

const generateId = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};
const addZone = () => {
  if (!isFormValid.value) return;

  const rows_num = Number(rows.value);
  const cols_num = Number(columns.value);
  const racks_num = Number(racks.value);

  const totalCurrentLocations = (props.modelValue || []).reduce(
    (acc, zone) => acc + zone.locationRequest.length,
    0
  );

  const newZoneLocations = rows_num * cols_num * racks_num;

  if (totalCurrentLocations + newZoneLocations > 6000) {
    toastService.error(t("warehouses.locationLimitError"))
    return;
  }

  const locationRequest = generateLocations(code.value, rows_num, cols_num, racks_num);

  const zone: Zone = {
    id: generateId(),
    code: code.value,
    name: name.value,
    rows: rows_num,
    columns: cols_num,
    racks: racks_num,
    locationRequest,
    isExpanded: true
  };

  const updatedZones = [...(props.modelValue || []), zone];
  emit("update:modelValue", updatedZones);
  
  code.value = "";
  name.value = "";
  rows.value = "";
  columns.value = "";
  racks.value = "";
};

const deleteZone = (id: string) => {
  const updatedZones = (props.modelValue || []).filter(z => z.id !== id);
  emit("update:modelValue", updatedZones);
};

const editZone = (zone: Zone) => {
  code.value = zone.code;
  name.value = zone.name;
  rows.value = String(zone.rows);
  columns.value = String(zone.columns);
  racks.value = String(zone.racks);
  
  deleteZone(zone.id!);
};

const toggleExpand = (zoneToToggle: Zone) => {
  const updatedZones = (props.modelValue || []).map(z => {
    if (z.id === zoneToToggle.id) {
      return { ...z, isExpanded: !z.isExpanded };
    }
    return z;
  });
  emit("update:modelValue", updatedZones);
};
</script>

<template>
  <div class="space-y-8">

    <div class="">
      <div class="flex items-center justify-between  pb-8">
        <div>
          <h3 class="text-lg font-medium text-gray-900">{{ $t('warehouses.zonesManagement') }}</h3>
          <p class="text-sm text-gray-500">{{ $t('warehouses.configureZones') }}</p>
        </div>
        <BaseButton 
          v-if="!disabled"
          :label="$t('button.addNew')" 
          icon="pi pi-plus" 
          size="small" 
          type="button"
          @click="addZone"
          :disabled="!isFormValid"
        />
      </div>

     <div v-if="!disabled" class="space-y-6">

        <div class="grid grid-cols-1 gap-4">
          <FormInput 
            :label="$t('warehouses.zoneCode')" 
            v-model="code" 
            :error="errors.code"
            :invalid="!!errors.code" 
            :placeholder="$t('warehouses.zoneCode')" 
          />
          
          <FormInput 
            :label="$t('warehouses.zoneName')" 
            v-model="name" 
            :error="errors.name"
            :invalid="!!errors.name" 
            :placeholder="$t('warehouses.zoneName')" 
          />
        </div>

        <div class="grid grid-cols-3 gap-4">
          <div>
            <FormInput 
              :label="$t('warehouses.rows')" 
              v-model="rows" 
              type="number"
              :error="errors.rows"
              :invalid="!!errors.rows" 
              :placeholder="$t('warehouses.rows')" 
            />
            <span class="text-xs text-blue-500 flex items-center gap-1 text-primary-500 mt-1">
              <i class="pi pi-info-circle"></i> {{ $t('warehouses.rowsInfo') }}
            </span>
          </div>

          <div>
            <FormInput 
              :label="$t('warehouses.columns')" 
              v-model="columns" 
              type="number"
              :error="errors.columns"
              :invalid="!!errors.columns" 
              :placeholder="$t('warehouses.columns')" 
            />
            <span class="text-xs text-blue-500 flex items-center gap-1 text-primary-500 mt-1">
              <i class="pi pi-info-circle"></i> {{ $t('warehouses.columnsInfo') }}
            </span>
          </div>

          <div>
            <FormInput 
              :label="$t('warehouses.racks')" 
              v-model="racks" 
              type="number"
              :error="errors.racks"
              :invalid="!!errors.racks" 
              :placeholder="$t('warehouses.racks')" 
            />
            <span class="text-xs text-blue-500 flex items-center gap-1 text-primary-500 mt-1">
              <i class="pi pi-info-circle"></i> {{ $t('warehouses.racksInfo') }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="props.modelValue && props.modelValue.length > 0" class="px-16">
      <h3 class="font-bold mb-2 text-lg text-gray-900 mb-4">{{ $t('warehouses.zonesOverview') }}</h3>
      
      <div class="space-y-4">
        <div v-for="zone in props.modelValue" :key="zone.id" class="border rounded-lg bg-[#EEF2FF] border-primary-300 overflow-hidden">
  
           <div class="border rounded-xl bg-gray-100 border-gray-100 overflow-hidden m-2">
          <div class="p-4 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="font-bold mb-2 text-lg text-gray-900">{{ zone.name }}</span>
              <Tag severity="success" class="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">{{ zone.code }}</Tag>
            </div>
    <div class="flex items-center gap-2">
              <button v-if="!disabled" type="button" @click="editZone(zone)" class="text-primary-600 hover:text-primary-800" title="Edit">
              <VsxIcon iconName="Edit" :size="20" color="#F79009" type="linear" />
              </button>
             <button v-if="!disabled" type="button" @click="deleteZone(zone.id!)" class="text-red-600 hover:text-red-800" :title="$t('button.delete')">
             <VsxIcon iconName="Trash" :size="20" color="#F04438" type="linear" />
              </button>
             <button type="button" @click="toggleExpand(zone)" class="text-gray-500 hover:text-gray-700">
                  <VsxIcon v-if="zone.isExpanded" iconName="ArrowSquareUp" :size="20" color="#3F5FAC" type="linear" />
                  <VsxIcon v-else="zone.isExpanded" iconName="ArrowSquareDown" :size="20" color="#3F5FAC" type="linear" />
              </button>
           </div>
          </div>

     
          <div class="px- pb-4 flex justify-center text-center gap-24 max-w-2xl">
             <div>
                <div class="text-xs text-gray-500">{{ $t('warehouses.rows') }}</div>
                <div class="font-medium">{{ zone.rows }}</div>
             </div>
              <div>
                <div class="text-xs text-gray-500">{{ $t('warehouses.columns') }}</div>
                 <div class="font-medium">{{ zone.columns }}</div>
             </div>
              <div>
                <div class="text-xs text-gray-500">{{ $t('warehouses.racks') }}</div>
                 <div class="font-medium">{{ zone.racks }}</div>
             </div>
              <div>
                <div class="text-xs text-gray-500">{{ $t('warehouses.totalLocations') }}</div>
                 <div class="font-medium text-primary-600">{{ zone.locationRequest.length }}</div>
             </div>
            </div>
      
          <div v-if="zone.isExpanded" class="px-4 pb-4">
            <div class="font-bold mb-2 text-lg text-gray-700">{{ $t('warehouses.generatedLocations') }}</div>
            <div class="bg-gray-50 rounded  overflow-hidden">
               <table class="w-full text-sm text-left">
                  <thead class="bg-gray-300 text-gray-700 bg-opacity-50">
                     <tr>
                        <th class="p-4 font-medium">{{ $t('warehouses.locationCode') }}</th>
                        <th class="p-4 font-medium">{{ $t('warehouses.row') }}</th>
                        <th class="p-4 font-medium">{{ $t('warehouses.column') }}</th>
                        <th class="p-4 font-medium">{{ $t('warehouses.rack') }}</th>
                     </tr>
                  </thead>
                  <tbody class="">
                     <tr v-for="loc in zone.locationRequest" :key="loc.code" class="hover:bg-blue-50/50">
                        <td class="p-4 text-primary-600 font-medium">{{ loc.code }}</td>
                        <td class="p-4">{{ loc.row }}</td>
                        <td class="p-4">{{ loc.column }}</td>
                        <td class="p-4">{{ loc.rack }}</td>
                     </tr>
                  </tbody>
               </table>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
