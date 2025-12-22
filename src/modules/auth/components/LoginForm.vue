<script setup lang="ts">
import { onMounted, ref } from "vue";
import * as yup from 'yup'
import { useField, useForm } from 'vee-validate'
import { useI18n } from "vue-i18n";
const { t } = useI18n();
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import { useUserStore } from '@/app/store/useUserStore';
import { storeToRefs } from "pinia";
import type { LoginPayload } from "@/app/types/user";

const toast = useToast();
const router = useRouter();
const userStore = useUserStore();
const { entities } = storeToRefs(userStore);

const { handleSubmit } = useForm({
  validationSchema: yup.object({
    userName: yup.string().required(t('form.fieldRequired')),
    password: yup.string().required(t('form.fieldRequired')),
    entityId: yup.string().required(t('form.fieldRequired')),
    rememberMe: yup.boolean()
  }),
  initialValues: {
    rememberMe: true,
  },
})

const { value: userName, errorMessage: userNameError } = useField<string>("userName");
const { value: password, errorMessage: passwordError } = useField<string>("password");
const { value: entityId, errorMessage: entityError } = useField<string | null>("entityId");
const { value: rememberMe } = useField<boolean>("rememberMe");
const loading = ref<boolean>(false)

onMounted(() => {
  getEntityLookups()
})


const onSubmit = handleSubmit(async (values) => {
  try {
    loading.value = true;
    await userStore.login(values as LoginPayload);
    toast.add({ severity: 'success', summary: 'Success', detail: t("auth.welcomeBack"), life: 3000 });
    router.push({ name: "Home" });
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error Message', detail: error as string, life: 3000 });
  } finally {
    loading.value = false;
  }
});
// Change language via store so it persists and updates document attributes
function switchLanguage() {
  userStore.toggleLang();
}

const getEntityLookups = async () => {
  try {
    loading.value = true;
    await userStore.fetchEntityLookups();
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error Message', detail: error as string, life: 3000 });
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-4 bg-white">
    <div class="custom-card-bg w-full max-w-md rounded-2xl bg-primary-25 p-8 shadow">
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

          <Dropdown v-model="entityId" :options="entities" optionLabel="name" :invalid="!!entityError"
            optionValue="id" :loading="loading" :placeholder="$t('auth.entityPlaceholder')" class="w-full mt-1" />
          <small v-if="entityError" class="text-danger-500">{{ entityError }}</small>

        </div>

        <div>
          <label class="text-gray-700 font-medium">{{
            $t("auth.userName")
          }}</label>
          <InputText v-model="userName" autocomplete="userName" placeholder="Example@email.com"
            class="mt-1 w-full p-3 border border-gray-300 rounded-lg" :invalid="!!userNameError" />
          <small v-if="userNameError" class="text-danger-500">{{ userNameError }}</small>
        </div>

        <div>
          <label class="text-gray-700 font-medium">{{
            $t("auth.password")
          }}</label>
          <Password v-model="password" toggleMask :inputProps="{ autocomplete: 'current-password' }"
            :placeholder="$t('auth.passwordPlaceholder')" class="mt-1 w-full" :invalid="!!passwordError"
            inputClass="w-full p-3 border border-gray-300 rounded-lg" />
          <small v-if="passwordError" class="text-danger-500">{{ passwordError }}</small>
        </div>

        <div class="flex items-center gap-2 mt-2">
          <Checkbox v-model="rememberMe" :binary="true" inputId="remember" />
          <label for="remember" class="text-gray-700 cursor-pointer">
            {{ $t("auth.rememberMe") }}
          </label>
        </div>

        <!-- Login Button -->
        <Button @click="onSubmit" :label="$t('auth.login')" :loading="loading" severity="info" class="w-full" />
      </form>
      <div class="mt-5 text-center">
        <Button @click="switchLanguage" :label="$t('language')" icon="pi pi-language" />
      </div>

    </div>
  </div>
</template>

<style scoped>
:deep(.p-button-info) {
  background: var(--color-primary-500);
  border-color: var(--color-primary-500);
}
</style>
