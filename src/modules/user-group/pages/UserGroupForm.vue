<script setup lang="ts">
import { ref } from "vue";
import ScreenHeader from "@/sharedComponents/ScreenHeader.vue";
import BaseButton from "@/sharedComponents/BaseButton.vue";
import { useRoute } from "vue-router";

const props = defineProps<{
  mode: "edit" | "create";
}>();

const editMode = props.mode === "edit";
const route = useRoute();
const groupId = ref<string | null>(route.params.id ? String(route.params.id) : null);
const groupName = ref<string>("");
const description = ref<string>("");

const handleSubmit = () => {
    console.log(`form submited ${groupId.value}`);
}
</script>
<template>
  <div>
    <ScreenHeader title="Access Control" subtitle="User Groups" />
    <card class="p-6 bg-[#ffffff] rounded-[10px]">
      <template #title>
        <div class="flex flex-col">
          <h2 class="heading-title">{{ editMode ? $t("userGroup.editUserGroup") : $t("userGroup.addNewUserGroup") }}</h2>
          <p class="subheading-title">
            {{ $t("userGroup.userGroupInfo") }}
          </p>
        </div>
      </template>
      <template #content>
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div>
            <label class="text-gray-700 font-medium mb-2 block"
              >{{ $t("userGroup.groupName") }}</label
            >
            <InputText
              v-model="groupName"
              placeholder="e.g., Finance Team"
              class="mt-1 w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label class="text-gray-700 font-medium mb-2 block"
              >{{ $t("userGroup.description") }}</label
            >
            <Textarea
              v-model="description"
              :placeholder="$t('userGroup.descriptionPlaceholder')"
              class="mt-1 w-full p-3 border border-gray-300 rounded-lg"
              rows="4"
            />
          </div>
          <div class="flex justify-between gap-4 mb-4 w-full">
            <BaseButton
              label="button.cancel"
              variant="ghost"
              block
              :to="{ name: 'UserGroup' }"
            />
            <BaseButton :label="editMode ? 'button.save' : 'userGroup.createGroup'"  variant="primary" block />
          </div>
        </form>
      </template>
    </card>
  </div>
</template>
<style scoped></style>
