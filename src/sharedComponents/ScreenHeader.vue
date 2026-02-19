
<script setup>
const props = defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: "" },
  actionName: { type: String, default: "" },
  crudType: { type: String, default: "" },
});
</script>

<template>
  <div class="heading-section mb-6">
    <div class="flex items-center gap-3">
      <VsxIcon iconName="Send" :size="20" type="linear" style="color: var(--color-gray-400)" />
      <p class="heading-title">{{ $t(title) }}</p>
      <VsxIcon iconName="ArrowRight2" :size="20" type="linear" style="color: var(--color-gray-400)" />
      <span class="screen-header-name">{{ $t(subtitle) }}</span>
       <VsxIcon iconName="ArrowRight2" :size="20" type="linear" style="color: var(--color-gray-400)" v-if="actionName"/>
      <span class="dialog-subheading-title">{{ $t(actionName) }}</span>
        <VsxIcon iconName="ArrowRight2" :size="20" type="linear" style="color: var(--color-gray-400)" v-if="crudType"/>
      <span class="dialog-subheading-title">{{ $t(crudType) }}</span>
    </div>
  </div>
</template>

