<script setup lang="ts">
import ScreenHeader from "@/sharedComponents/ScreenHeader.vue";
import { computed, ref } from "vue";

import { useI18n } from "vue-i18n";
import Basic from "../components/Basic.vue";
import UOM from "../components/UOM.vue";
import Tracking from "../components/Tracking.vue";
import Pricing from "../components/Pricing.vue";
import Ledger from "../components/Ledger.vue";
import Attachment from "../components/Attachment.vue";
import FormButtons from "../components/FormButtons.vue";
const { t } = useI18n();

const tabs = computed(() => [
  { label: t("items.basic"), level: 0 },
  { label: t("items.uom"), level: 1 },
  { label: t("items.tracking"), level: 2 },
  { label: t("items.pricing"), level: 3 },
  { label: t("items.ledger"), level: 4 },
  { label: t("items.attachment"), level: 5 },
]);

const activeIndex = ref<number>(0);

const onTabChange = (data: { index: number }) => {
  activeIndex.value = data.index;
};

const nextTab = () => {
  if (activeIndex.value < tabs.value.length - 1) {
    activeIndex.value += 1;
  }
};
const previousTab = () => {
  if (activeIndex.value > 0) {
    activeIndex.value -= 1;
  }
};

</script>

<template>
  <div>
    <ScreenHeader
      title="inventory"
      subtitle="masterData"
      actionName="items.addNew"
    />
    <TabMenu
      :model="tabs"
      :activeIndex="activeIndex"
      @tab-change="onTabChange"
    />
    <div class="text-black bg-white p-5">
      <Basic v-if="activeIndex === 0" />
      <UOM v-if="activeIndex === 1" />
      <Tracking v-if="activeIndex === 2" />
      <Pricing v-if="activeIndex === 3" />
      <Ledger v-if="activeIndex === 4" />
      <Attachment v-if="activeIndex === 5" />
      <FormButtons :activeIndex="activeIndex" @next="nextTab" @previous="previousTab" />
    </div>
  </div>
</template>

<style scoped>
:deep(.p-tabmenu-tablist) {
  display: flex;
  margin: 0;
  padding: 4px;
  list-style-type: none;
  background: #d6e0ff;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

:deep(.p-tabmenu-item-active .p-tabmenu-item-link) {
  background: var(--p-tabmenu-item-active-background);
  border-color: #3f5fac;
  color: #3f5fac;
}

:deep(.p-tabmenu-active-bar) {
  z-index: 1;
  display: block;
  position: absolute;
  bottom: var(--p-tabmenu-active-bar-bottom);
  height: var(--p-tabmenu-active-bar-height);
  background: transparent;
  transition: 250ms cubic-bezier(0.35, 0, 0.25, 1);
}
</style>
