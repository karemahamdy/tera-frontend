<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useI18n } from "vue-i18n";
import { ItemService } from "@/modules/Inventory/MasterData/items/services/item.service";
import { LookupsService } from "@/app/services/lookups.service";
import { FileService } from "@/app/services/file.service";
import { toastService } from "@/app/services/toastService";

const { t } = useI18n();

const props = defineProps<{
  visible: boolean;
  item: any;
  initialSerials?: any[];
  exportTemplateFunc?: Function;
  parseSerialsFunc?: Function;
  disabled?: boolean;
}>();

const emit = defineEmits(["update:visible", "save"]);

const isVisible = computed({
  get: () => props.visible,
  set: (value) => emit("update:visible", value),
});

const serialInput = ref<string>("");
const qtyInput = ref<number>(1);
const batchInput = ref<string>("");
const serialNumber2 = ref<string>("");
const serialNumber3 = ref<string>("");
const expireDateInput = ref();
const commentInput = ref("");

const fileInput = ref<HTMLInputElement | null>(null);
const isProcessing = ref(false);

const serialList = ref<any[]>(
  props.initialSerials ? [...props.initialSerials] : [],
);

const columns = computed(() => [
  { field: "mainSerial", header: t("serial.serial") },
  { field: "qty", header: t("serial.qty") },
  { field: "batchNumber", header: t("serial.batch") },
  { field: "expireDate", header: t("serial.expire") },
  { field: "comment", header: t("serial.comment") },
  ...(props.disabled ? [] : [{ field: "action", header: "" }]),
]);

const totalQty = computed(() =>
  serialList.value.reduce((acc, curr) => acc + Number(curr.qty), 0),
);

const addSerial = () => {
  if (!serialInput.value && !qtyInput.value) return;

  serialList.value.push({
    mainSerial: serialInput.value,
    qty: qtyInput.value || "0",
    batchNumber: batchInput.value,
    expireDate: expireDateInput.value,
    serialNumber2: serialNumber2.value,
    serialNumber3: serialNumber3.value,
    comment: commentInput.value,
  });

  serialInput.value = "";
  qtyInput.value = 1;
  batchInput.value = "";
  serialNumber2.value = "";
  serialNumber3.value = "";
  expireDateInput.value = undefined;
  commentInput.value = "";
};

const removeSerial = (data: any) => {
  const index = serialList.value.indexOf(data);
  if (index !== -1) {
    serialList.value.splice(index, 1);
  }
};

const triggerImport = () => {
  fileInput.value?.click();
};

const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (!target.files?.length) return;

  const file = target.files[0] as File;
  isProcessing.value = true;
  try {
    const response = props.parseSerialsFunc
      ? await props.parseSerialsFunc(file)
      : await LookupsService.parseSerials(file);
    if (response.succeeded && Array.isArray(response.data)) {
      // Map incoming data to our serial format if needed
      const newSerials = response.data.map((s: any) => ({
        mainSerial: s.mainSerial || s.serial || "",
        qty: s.quantity || s.qty || 1,
        batchNumber: s.batchNumber || s.batch || "",
        expireDate: s.expireDate || s.expire || null,
        comment: s.note || s.comment || "",
      }));
      serialList.value = [...serialList.value, ...newSerials];
      toastService.success(
        t("serial.importSuccess")
      );
    } else {
      toastService.error(response.message);
    }
  } catch (error) {
    toastService.error(error as string);
  } finally {
    isProcessing.value = false;
    target.value = ""; // Reset input
  }
};

const exportTemplate = async () => {
  try {
    const blob = await ItemService.downloadImportTemplate();
    FileService.downloadBlob(blob, "SerialImportTemplate.xlsx");
  } catch (error) {
    toastService.error(error as string);
  }
};

const exportTemplateFunction = () => {
  if (props.exportTemplateFunc) {
    props.exportTemplateFunc();
  } else {
    exportTemplate();
  }
};

const save = () => {
  isVisible.value = false;
  emit("save", { serials: serialList.value, totalQty: totalQty.value });
};

const close = () => {
  isVisible.value = false;
};

watch(
  () => props.visible,
  (newVal) => {
    if (newVal && props.initialSerials) {
      serialList.value = [...props.initialSerials];
    }
  },
);
</script>

<template>
  <Dialog v-model:visible="isVisible" modal :closable="false">
    <div class="grid grid-cols-1 md:grid-cols-2">
      <!-- Left Form Panel — hidden in view mode -->
      <div v-if="!disabled" class="md:col-span-1 w-full flex flex-col gap-5 p-2 h-full">
        <div class="flex justify-between items-center">
          <h3 class="font-bold text-lg text-gray-900">
            {{ t("serial.selectQuantity") }}
          </h3>
        </div>
        <div class="flex justify-between items-center">
          <input
            type="file"
            ref="fileInput"
            style="display: none"
            accept=".xlsx,.xls,.csv"
            @change="handleFileUpload"
          />
          <template v-show="false">
            <BaseButton
              :label="t('import')"
              icon="DocumentUpload"
              size="small"
              variant="outline-primary"
              class="px-2 py-1 text-xs"
              :loading="isProcessing"
              @click="triggerImport"
            />
            <BaseButton
              :label="t('export')"
              icon="DocumentDownload"
              size="small"
              variant="outline-primary"
              class="px-2 py-1 text-xs"
              @click="exportTemplateFunction"
            />
          </template>
        </div>

        <div class="flex flex-col gap-4">
          <div class="flex flex-col gap-1">
            <label class="text-xs text-gray-600 font-medium">
              {{ t("serial.serialNumber") }}
            </label>
            <InputText
              v-model="serialInput"
              :placeholder="t('serial.selectSerial')"
              class="w-full"
            />
          </div>

          <div class="flex gap-2">
            <div class="flex flex-col gap-1 w-1/2">
              <label class="text-xs text-gray-600 font-medium">
                {{ t("serial.batch") }}
              </label>
              <InputText
                v-model="batchInput"
                :placeholder="t('serial.batch')"
                class="w-full"
              />
            </div>

            <div class="flex flex-col gap-1 w-1/2">
              <label class="text-xs text-gray-600 font-medium">
                {{ t("serial.quantity") }}
              </label>
              <InputNumber
                v-model="qtyInput"
                :placeholder="t('serial.enterQuantity')"
                class="w-full"
              />
            </div>
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-xs text-gray-600 font-medium">
              {{ t("serial.expire") }}
            </label>
            <InputText
              v-model="expireDateInput"
              type="date"
              :placeholder="t('serial.date')"
              class="w-[105]"
            />
          </div>

          <div class="flex gap-2">
            <div class="flex flex-col gap-1 w-1/2">
              <label class="text-xs text-gray-600 font-medium">
                {{ t("serial.serialNumber2") }}
              </label>
              <InputText v-model="serialNumber2" :placeholder="t('serial.enterSN2')" class="w-full" />
            </div>

            <div class="flex flex-col gap-1 w-1/2">
              <label class="text-xs text-gray-600 font-medium">
                {{ t("serial.serialNumber3") }}
              </label>
              <InputText v-model="serialNumber3" :placeholder="t('serial.enterSN3')" class="w-full" />
            </div>
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-xs text-gray-600 font-medium">
              {{ t("serial.comment") }}
            </label>
            <InputText
              v-model="commentInput"
              :placeholder="t('serial.note')"
              class="w-full"
            />
          </div>
        </div>

        <div class="mt-auto flex flex-col gap-3 py-2">
          <BaseButton
            :label="t('serial.addSerial')"
            class="w-full bg-primary-600 hover:bg-primary-700 text-white border-0"
            @click="addSerial"
          />

          <BaseButton
            :label="t('common.cancel')"
            variant="ghost"
            class="w-full border-gray-300 text-gray-700 hover:bg-gray-50 bg-white"
            @click="close"
          />
        </div>
      </div>

      <!-- Right List Panel -->
      <div
        class="w-full h-full flex-1 flex flex-col justify-between p-2 rounded-xl bg-[#F5F8FF]/30"
      >
        <div>
          <div class="mb-4">
            <h3 class="font-bold text-lg text-gray-900">
              {{ t("serial.addedSerial") }}
            </h3>
            <p class="text-sm text-gray-500">
              {{ t("serial.identifyItems") }}
            </p>
          </div>

          <div
            class="flex-1 overflow-hidden rounded-lg bg-[#EFF4FF] border border-gray-100"
          >
            <DynamicTable
              :columns="columns"
              :data="serialList"
              :paginator="false"
              :showView="false"
              :showEdit="false"
              :showDelete="false"
              class="h-full bg-transparent"
            >
              <template #col-batchNumber="{ data }">
                <span
                  class="text-xs uppercase bg-white border border-gray-200 px-2 py-1 rounded text-gray-600"
                >
                  {{ data.batchNumber || '-' }}
                </span>
              </template>

              <template #col-expireDate="{ data }">
                <span class="text-gray-500">
                  {{
                    data.expireDate
                      ? new Date(data.expireDate).toLocaleDateString()
                      : "-"
                  }}
                </span>
              </template>

              <template #col-qty="{ data }">
                <span class="font-semibold text-gray-900">
                  {{ data.qty }}
                </span>
              </template>

              <template #col-action="{ data }">
                <button
                  class="text-red-400 hover:text-red-600"
                  @click="removeSerial(data)"
                >
                  <VsxIcon
                    iconName="Trash"
                    :size="20"
                    type="linear"
                    color="#F04438"
                  />
                </button>
              </template>
            </DynamicTable>
          </div>
        </div>

        <div
          class="flex justify-between items-center gap-5 mt-4 pt-4 border-t border-gray-100"
        >
          <div class="flex flex-col">
            <span class="text-xs text-gray-500 font-medium">
              {{ t("serial.totalQty") }}
            </span>
            <span class="text-2xl font-bold text-primary-600">
              {{ totalQty }}
            </span>
          </div>

          <!-- View mode: Close only -->
          <div v-if="disabled" class="flex gap-3">
            <BaseButton
              :label="t('common.close')"
              variant="ghost"
              class="w-24 border-gray-300 text-gray-700 hover:bg-gray-50 bg-white"
              @click="close"
            />
          </div>

          <!-- Edit mode: Cancel + Save -->
          <div v-else class="flex gap-3">
            <BaseButton
              :label="t('common.cancel')"
              variant="ghost"
              class="w-24 border-gray-300 text-gray-700 hover:bg-gray-50 bg-white"
              @click="close"
            />

            <BaseButton
              :label="t('serial.finalizeSave')"
              class="w-40 bg-primary-600 hover:bg-primary-700 text-white border-0"
              @click="save"
            />
          </div>
        </div>
      </div>
    </div>
  </Dialog>
</template>

<style scoped>
:deep(.p-dialog-content) {
  padding: 24px;
}

:deep(.p-datatable .p-datatable-thead > tr > th) {
  background-color: #e2e8f0;
  color: #475569;
  font-weight: 700;
}
</style>
