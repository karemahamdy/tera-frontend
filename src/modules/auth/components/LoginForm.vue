<script setup lang="ts">
import { ref } from "vue";

const email = ref<string>("");
const password = ref<string>("");
const rememberMe = ref<boolean>(false);
const selectedOption = ref<number | null>(null);

const options = [
  { label: "Option 1", value: 1 },
  { label: "Option 2", value: 2 },
  { label: "Option 3", value: 3 },
];

import { useI18n } from "vue-i18n";

const { t, locale } = useI18n();

// Change language dynamically
function switchLanguage() {
  locale.value = locale.value === 'en' ? 'ar' : 'en';
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <div
      class="custom-card-bg w-full max-w-md rounded-2xl bg-[#F0F3FA] p-8 shadow"
    >
      <h2 class="text-3xl font-semibold text-center text-primary-500">
        {{ $t("auth.welcomeBack") }}
      </h2>
      <p class="text-center text-sm text-gray-600 mt-2">
        {{ $t("auth.signInMsg") }}
      </p>

      <form class="space-y-5 mt-4">
        <div>
          <label class="text-gray-700 font-medium">{{
            $t("auth.userName")
          }}</label>
          <InputText
            v-model="email"
            autocomplete="username"
            placeholder="Example@email.com"
            class="mt-1 w-full p-3 border border-gray-300 rounded-lg"
          />
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
            inputClass="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>

        <div class="mt-4">
          <label class="text-gray-700 font-medium">{{
            $t("auth.branch")
          }}</label>

          <Dropdown
            v-model="selectedOption"
            :options="options"
            optionLabel="label"
            :placeholder="$t('auth.branchPlaceholder')"
            class="w-full mt-1"
          />
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
            class="rounded-lg bg-primary-500 hover:bg-primary-600  text-white border-none p-2 cursor-pointer w-full font-medium"
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
