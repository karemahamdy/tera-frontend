<script setup>
import { defineProps } from "vue";
import BaseButton from "./BaseButton.vue";

const props = defineProps({
  visible: Boolean,
  title: String,
  subtitle: String,
  width: {
    type: String,
    default: "30rem"
  }
});

const emits = defineEmits(["update:visible", "cancel", "confirm"]);
</script>

<template>
  <Dialog 
    v-model:visible="props.visible" 
    modal 
    :style="{ width: props.width }"
  >

    <template #header>
      <div class="flex flex-col mb-2 mt-4 gap-1 text-center">
        <p class="dialog-heading-title px-12">{{ props.title }}</p>
        <p class="dialog-subheading-title px-12">{{ props.subtitle }}</p>
      </div>
    </template>

    <div>
      <slot></slot>
    </div>

    <template #footer>
      <div class="flex justify-center gap-2 w-full">
        <BaseButton  :label="$t('button.cancel')" variant="ghost" @click="$emit('cancel')" block />
        <BaseButton :label="$t('button.save')" variant="primary" @click="$emit('confirm')" block />
      </div>
    </template>

  </Dialog>
</template>
