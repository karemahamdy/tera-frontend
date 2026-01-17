<script setup lang="ts">
import { useForm } from "vee-validate";
import * as yup from "yup";
import FormInput from "@/sharedComponents/inputs/FormInput.vue";
import { useI18n } from "vue-i18n";
import BaseButton from "./BaseButton.vue";
const { t } = useI18n();
import type {  ResetPassword } from "@/app/types/user";
import { toastService } from "@/app/services/toastService";

import { useUserStore } from '@/app/store/useUserStore';
const userStore = useUserStore();

const userSchema = yup.object({
  newPassword: yup.string().required(t("form.fieldRequired")).min(6),
  confirmPassword: yup
    .string()
    .required(t("form.fieldRequired"))
    .oneOf([yup.ref("newPassword")], t("form.passwordsMustMatch")),
});

const { handleSubmit, errors, defineField } = useForm({
  validationSchema: userSchema,
});

const [newPassword] = defineField("newPassword");
const [confirmPassword] = defineField("confirmPassword");

const onSubmit = handleSubmit( async (values) => {
  try {
    await userStore.resetUserPassword(values as ResetPassword);
    toastService.success(t("changePassword.passwordChangedSuccessfully"));
    userStore.logout();
  } catch (error) {
    toastService.error(error as string);
  }
});
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 bg-white/60 backdrop-blur"
    >
      <div class="p-5 border border-primary-100 rounded-xl bg-primary-25 w-1/3">
        <form @submit.prevent="onSubmit" class="space-y-5">
          <div>
            <div class="text-center mb-5">
              <p class="text-primary-500 text-2xl">
                <strong>{{ $t("changePassword.title") }}</strong>
              </p>
              <p class="text-[#4A5565]">{{ $t("changePassword.subtitle") }}</p>
            </div>
            <div>
              <FormInput
                class="mt-5 w-full text-gray-700"
                type="password"
                :label="$t('auth.newpassword')"
                v-model="newPassword"
                :error="errors.newPassword"
                placeholder="****"
              />

              <FormInput
                class="mt-2 w-full text-gray-700"
                type="password"
                :label="$t('auth.confirmPassword')"
                v-model="confirmPassword"
                :error="errors.confirmPassword"
                placeholder="****"
              />
            </div>
            <div class="w-full mt-5">
              <BaseButton
                class="w-full"
                type="submit"
                label="button.save"
                variant="primary"
                block
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>
w
