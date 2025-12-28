<script setup>
import { ref } from "vue";
import BaseDialog from "./BaseDialog.vue";

const visible = ref(false);
const oldPass = ref("");
const newPass = ref("");
const confirmPass = ref("");

const emit = defineEmits(["update:visible"]);

const closeDialog = () => {
  emit("update:visible", false);
};

const confirmAction = () => {
  console.log("save clicked");
  closeDialog();
};
</script>

<template>
  <BaseDialog v-model:visible="visible"  :title="$t('changePassword.title')"
  :subtitle="$t('changePassword.subtitle')" @cancel="closeDialog" @confirm="confirmAction">

    <form class="space-y-5">
      <!-- <div>
        <label class="text-gray-700 font-medium">{{
          $t("auth.password")
        }}</label>
        <Password v-model="password" toggleMask :inputProps="{ autocomplete: 'current-password' }"
          :placeholder="$t('auth.passwordPlaceholder')" class="mt-1 w-full"
          inputClass="w-full p-3 border border-gray-300 rounded-lg" />
      </div> -->
      <div>
        <label class="text-gray-700 font-medium">{{
          $t("auth.password")
        }}</label>
        <Password v-model="password" toggleMask :inputProps="{ autocomplete: 'current-password' }"
          :placeholder="$t('auth.passwordPlaceholder')" class="mt-1 w-full"
          inputClass="w-full p-3 border border-gray-300 rounded-lg" />
      </div>
      <div>
        <label class="text-gray-700 font-medium">{{
          $t("auth.confirmPassword")
        }}</label>
        <Password v-model="password" toggleMask :inputProps="{ autocomplete: 'current-password' }"
          :placeholder="$t('auth.newpasswordPlaceholder')" class="mt-1 w-full"
          inputClass="w-full p-3 border border-gray-300 rounded-lg" />
      </div>
    </form>

  </BaseDialog>
</template>
