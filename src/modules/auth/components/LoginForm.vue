<script setup lang="ts">
import { ref } from "vue";
import * as yup from 'yup'
import { useField, useForm } from 'vee-validate'
import { useI18n } from "vue-i18n";
const { t } = useI18n();
// import { useToast } from "primevue/usetoast";
import { useRouter } from "vue-router";

const router = useRouter();
// const toast = useToast();
const rememberMe = ref<boolean>(false);
const selectedOption = ref<number | null>(null);

const options = [
  { label: "Option 1", value: 1 },
  { label: "Option 2", value: 2 },
  { label: "Option 3", value: 3 },
];

import { useUserStore } from '@/app/store/useUserStore';
const userStore = useUserStore();

const { handleSubmit } = useForm({
  validationSchema: yup.object({
    userName: yup.string().required(t('form.fieldRequired')),
    password: yup.string().required(t('form.fieldRequired')),
  })
})

const { value: userName, errorMessage: userNameError } = useField<string>("userName");
const { value: password, errorMessage: passwordError } = useField<string>("password");

const onSubmit = handleSubmit(async (values) => {
  try {
    const payload = {
      userName: values.userName as string,
      password: values.password as string,
    };
    await userStore.login(payload);
    // toast.add({ severity: 'success', summary: 'Success Message', detail: 'Message Content', life: 3000 });
    router.push({ name: "home" });

  } catch (error) {
    // toast.add({ severity: 'error', summary: 'Error Message', detail: 'Message Content', life: 3000 });
  }
});
// Change language via store so it persists and updates document attributes
function switchLanguage() {
  userStore.toggleLang();
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-4 bg-white">
    <div
      class="custom-card-bg w-full max-w-md rounded-2xl bg-primary-25 p-8 shadow"
    >
      <h2 class="text-3xl font-semibold text-center text-primary-500">
        {{ $t("auth.welcomeBack") }}
      </h2>
      <p class="text-center text-sm text-gray-600 mt-2">
        {{ $t("auth.signInMsg") }}
      </p>

      <form @submit.prevent="onSubmit" class="space-y-5 mt-4">
        <div>
          <label class="text-gray-700 font-medium">{{
            $t("auth.entity")
          }}</label>

          <Dropdown
            v-model="selectedOption"
            :options="options"
            optionLabel="label"
            :placeholder="$t('auth.entityPlaceholder')"
            class="w-full mt-1"
          />
        </div>
        
        <div>
          <label class="text-gray-700 font-medium">{{
            $t("auth.userName")
          }}</label>
          <InputText
            v-model="userName"
            autocomplete="userName"
            placeholder="Example@email.com"
            class="mt-1 w-full p-3 border border-gray-300 rounded-lg"
            :invalid="!!userNameError"
          />
          <small v-if="userNameError" class="text-danger-500">{{ userNameError }}</small>
        </div>

        <div>
          <label class="text-gray-700 font-medium">{{
            $t("auth.password")
          }}</label>
          <Password
            v-model="password"
            toggleMask
            :inputProps="{ autocomplete: 'current-password' }"
            :placeholder="$t('auth.passwordPlaceholder')"
            class="mt-1 w-full"
            :invalid="!!passwordError"
            inputClass="w-full p-3 border border-gray-300 rounded-lg"
          />
          <small v-if="passwordError" class="text-danger-500">{{ passwordError }}</small>
        </div>

        <div class="flex items-center gap-2 mt-2">
          <Checkbox v-model="rememberMe" :binary="true" inputId="remember" />
          <label for="remember" class="text-gray-700 cursor-pointer">
            {{ $t("auth.rememberMe") }}
          </label>
        </div>

        <!-- Login Button -->
        <Button v-slot="slotProps" asChild>
          <button
            v-bind="slotProps.a11yAttrs"
            class="rounded-lg bg-primary-500 hover:bg-primary-600  text-white border-none p-2 cursor-pointer w-full font-medium text-primary-25"
          >
            {{ $t("auth.login") }}
          </button>
        </Button>
      </form>
      <div class="mt-5 text-center">
          <Button @click="switchLanguage" :label="$t('language')" icon="pi pi-language" />
      </div>
      
    </div>
  </div>
</template>
