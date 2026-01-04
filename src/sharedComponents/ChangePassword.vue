<script setup>
import { ref } from "vue";
import BaseDialog from "./BaseDialog.vue";
import { useForm } from "vee-validate";
import * as yup from "yup";
import FormInput from "@/sharedComponents/inputs/FormInput.vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const visible = ref(false);

const emit = defineEmits(["update:visible", "passwordChanged"]);

const closeDialog = () => {
  emit("update:visible", false);
};

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

const onSubmit = handleSubmit((values) => {
  emit("passwordChanged", values);
  closeDialog();
});
</script>

<template>
  <BaseDialog
    v-model:visible="visible"
    @update:visible="closeDialog"
    :title="$t('auth.resetPassword')"
    :subtitle="$t('auth.resetPasswordInfo')"
    @cancel="closeDialog"
    @confirm="onSubmit"
  >
    <form @submit.prevent="onSubmit" class="space-y-5">
      <div>
        <FormInput
          class="mt-1 w-full"
          type="password"
          :label="$t('auth.newpassword')"
          v-model="newPassword"
          :error="errors.newPassword"
          placeholder="****"
        />

        <FormInput
          class="mt-1 w-full"
          type="password"
          :label="$t('auth.confirmPassword')"
          v-model="confirmPassword"
          :error="errors.confirmPassword"
          placeholder="****"
        />
      </div>
    </form>
  </BaseDialog>
</template>
