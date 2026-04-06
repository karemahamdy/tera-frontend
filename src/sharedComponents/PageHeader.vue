<script setup>
import { ref, computed } from "vue";
import BaseButton from "./BaseButton.vue";
import { debounce } from "@/app/utils/debounce";
import { useI18n } from "vue-i18n";
import { FileService } from "@/app/services/file.service";
import axiosWrapper from "@/app/http/axiosWrapper";
import { toastService } from "@/app/services/toastService";
import { mapFiltersToBody } from "@/app/utils/mapFiltersToBody";
const { t } = useI18n();

const props = defineProps({
  title: { type: String, default: "" },
  subtitle: { type: String, default: "" },
  showSearch: { type: Boolean, default: true },
  searchPlaceholder: { type: String, default: "table.search" },
  showFilter: { type: Boolean, default: false },
  showMultiFilter: { type: Boolean, default: false },
  mainBtn: { type: Boolean, default: false },
  mainBtnText: { type: String, default: "" },
  onMainBtnClick: { type: Function, default: null },
  showExport: { type: Boolean, default: false },
  exportText: { type: String, default: "Export" },
  showImport: { type: Boolean, default: false },
  hasMenu: { type: Boolean, default: false },
  importText: { type: String, default: "Import" },
  onImport: { type: Function, default: null },
  onExport: { type: Function, default: null },
  onExportTemplate: { type: Function, default: null },
  onExportData: { type: Function, default: null },
  templateFileUrl: { type: [String, null], default: null },
  dataFileUrl: { type: [String, null], default: null },
  templateFileName: { type: String, default: "template-file.xlxs" },
  dataFileName: { type: String, default: "data-file.xlxs" },
  filters: { type: Array, default: [] },
  requiresBody: { type: Boolean, default: false },
});

const emit = defineEmits(["search", "filter-change", "action-click", "upload"]);
const fileInput = ref(null);

const onFilterChange = (filter, event) => {
  emit("filter-change", { filter, value: event.value });
};

const debouncedSearch = debounce((value) => {
  emit("search", value);
}, 750);

const onInput = (event) => {
  const value = event.target.value;
  debouncedSearch(value);
};

const downloadData = async (url, fileName) => {
  try {
    await FileService.downloadFile(url, fileName);
  } catch (error) {
    toastService.error(error);
  }
};

const items = computed(() => {
  return [
    {
      label: t("button.template"),
      icon: "pi pi-folder-open",
      command: () => {
        if (props.templateFileUrl) {
          FileService.downloadFile(
            props.templateFileUrl,
            props.templateFileName,
          );
        } else {
          props.onExportTemplate && props.onExportTemplate();
        }
      },
    },
    {
      label: t("button.data"),
      icon: "pi pi-file",
      command: () => {
        if (props.dataFileUrl) {
          FileService.downloadFile(props.dataFileUrl, props.dataFileName);
        } else {
          props.onExportData && props.onExportData();
        }
      },
    },
  ];
});

const triggerFileInput = () => {
  fileInput.value?.click();
};
const onFileChange = (event) => {
  const target = event.target;
  const file = target.files?.[0];
  if (!file) return;
  emit("upload", file);
  target.value = "";
};

const handleExportClick = async () => {
  if (props.hasMenu) return;
  try {
    if (props.onExport) {
      props.onExport();
    } else if (props.dataFileUrl) {
      if (props.requiresBody) {
        const body = mapFiltersToBody(props.filters);
        const response = await axiosWrapper.post(props.dataFileUrl, body, {
          responseType: "blob",
        });
        downloadBlob(response, props.dataFileName);
      } else {
        await FileService.downloadFile(props.dataFileUrl, props.dataFileName);
      }
    }
  } catch (err) {
    toastService.error(err);
  }
};
</script>

<template>
  <div
    class="heading-section flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
  >
    <!-- Title + Subtitle -->
    <div class="flex flex-col">
      <h2 class="heading-title">{{ $t(title) }}</h2>
      <p class="subheading-title">{{ $t(subtitle) }}</p>
    </div>

    <!-- Action Buttons -->
    <div class="flex flex-wrap justify- md:justify-end gap-3">
      <!-- Import -->
      <BaseButton
        v-if="showImport"
        :label="$t('import')"
        icon="Import"
        variant="outline-primary"
        @click="triggerFileInput"
      />
      <input
        ref="fileInput"
        type="file"
        class="hidden"
        :accept="accept"
        @change="onFileChange"
      />
      <!-- Export -->
      <BaseButton
        v-if="showExport"
        :label="$t('export')"
        icon="Export"
        variant="outline-primary"
        :hasMenu="hasMenu"
        @click="handleExportClick"
        :items="hasMenu ? items : []"
      />
      <!-- Main Button -->
      <BaseButton
        v-if="mainBtn"
        :label="$t(mainBtnText)"
        icon="AddSquare"
        variant="primary"
        :disabled="!mainBtnValid"
        @click="onMainBtnClick && onMainBtnClick()"
      />

      <slot name="actionBtn"></slot>
    </div>
  </div>
  <slot name="middle" />
  <!-- Search + Filters -->
  <div class="flex gap-[10px] mt-2 flex-nowrap">
    <span class="p-input-icon-left search-input">
      <InputText
        v-if="showSearch"
        v-model="searchQuery"
        :placeholder="$t(searchPlaceholder)"
        @input="onInput"
      />
    </span>
    <template v-if="showFilter">
      <Dropdown
        v-for="(filter, index) in filters"
        :key="index"
        v-model="filter.value"
        :options="filter.options"
        :placeholder="$t(filter.placeholder)"
        :optionLabel="$t(filter.optionLabel || 'label')"
        :optionValue="$t(filter.optionValue || 'value')"
        :showClear="filter.showClear"
        @change="(e) => onFilterChange(filter, e)"
        filter
      />
    </template>
    <template v-if="showMultiFilter">
      <template v-for="(filter, index) in filters" :key="index">
        <Dropdown
          v-if="filter.isSingle"
          v-model="filter.value"
          :options="filter.options"
          :placeholder="$t(filter.placeholder)"
          :optionLabel="$t(filter.optionLabel || 'label')"
          :optionValue="$t(filter.optionValue || 'value')"
          :showClear="filter.showClear"
          @change="(e) => onFilterChange(filter, e)"
          filter
        />
        <MultiSelect
          v-else
          :maxSelectedLabels="3"
          v-model="filter.value"
          :options="filter.options"
          :placeholder="$t(filter.placeholder)"
          :optionLabel="$t(filter.optionLabel || 'label')"
          :optionValue="$t(filter.optionValue || 'value')"
          :showClear="filter.showClear"
          @change="(e) => onFilterChange(filter, e)"
          filter
        />
      </template>
    </template>
  </div>
</template>

<style>
.search-input {
  flex: 1;
  min-width: 100px;
}

.search-input input {
  width: 100%;
  background-color: var(--color-gray-100);
}

.p-multiselect-header .p-checkbox.p-component {
  position: relative;
}
.p-multiselect-header .p-checkbox.p-component::after {
  position: absolute;
  content: "All";
  left: 2rem;
}

html[dir="rtl"] .p-multiselect-header .p-checkbox.p-component::after {
  content: "الكل";
  left: unset;
  right: 2rem;
}

.p-multiselect-header {
  flex-direction: column-reverse !important;
  align-items: flex-start !important;
  gap: 0.75rem;
}
</style>
