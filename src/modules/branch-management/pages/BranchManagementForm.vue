<script setup lang="ts">
import ScreenHeader from "@/sharedComponents/ScreenHeader.vue";
import BaseButton from "@/sharedComponents/BaseButton.vue";
import { useRoute } from "vue-router";

import { useForm } from "vee-validate";
import { branchFormSchema } from "../validation/BranchSchema";
import FormDropdown from "@/sharedComponents/inputs/FormDropdown.vue";
import FormInput from "@/sharedComponents/inputs/FormInput.vue";

const props = defineProps<{
  mode: "edit" | "create";
}>();

const editMode = props.mode === "edit";
const route = useRoute();

// const groupId = route.params.id
//   ? String(route.params.id)
//   : null;

const { handleSubmit, errors, defineField } = useForm({
  validationSchema: branchFormSchema,
  initialValues: {
    branchName: "",
    address: "",
    branchCode: "",
    branchStatus: "",
  },
});

const [branchName] = defineField("branchName");
const [address] = defineField("address");
const [branchCode] = defineField("branchCode");
const [branchStatus] = defineField("branchStatus");

const options = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

const onSubmit = handleSubmit((values) => {
  console.log(route);
  console.log("Form Values", values);
});

</script>

<template>
  <div>
    <ScreenHeader title="accessControl" subtitle="branch.branchName" />

    <card class="p-6 bg-[#ffffff] rounded-[10px]">
      <template #title>
        <div class="flex flex-col px-20">
          <h2 class="heading-title">
            {{ editMode ? $t("branch.editUserGroup") : $t("branch.addNewBranch") }}
          </h2>
          <p class="subheading-title">
            {{ $t("branch.userBranchInfo") }}
          </p>
        </div>
      </template>

      <template #content>
        <form @submit.prevent="onSubmit" class="space-y-6 px-20">
          <div class="flex gap-8">
  
            <FormInput class="w-1/2" :label="$t('branch.branchName')" v-model="branchName"
              :error="errors.branchName" placeholder="Enter full name" :invalid="!!errors.branchName"/>
              <FormInput class="w-1/2" :label="$t('branch.branchName')" v-model="branchName"
              :error="errors.branchName" placeholder="Enter full name" :invalid="!!errors.branchName"/>
          </div>
          <div class="flex gap-8">
            <div class="w-1/2">
              
              <label class="text-gray-700 font-medium mb-2 block">
                {{ $t("branch.address") }}
              </label>
              
              <Textarea v-model="address" :placeholder="$t('branch.descriptionPlaceholder')"
              class="mt-1 w-full p-3 border rounded-lg" rows="4" :class="{ 'border-danger-500': errors.address }" />
              
              <small v-if="errors.address" class="text-danger-500">
                {{ errors.address }}
              </small>
            </div>

             <div class="w-1/2">
              
              <label class="text-gray-700 font-medium mb-2 block">
                {{ $t("branch.address") }}
              </label>
              
              <Textarea v-model="address" :placeholder="$t('branch.descriptionPlaceholder')"
              class="mt-1 w-full p-3 border rounded-lg" rows="4" :class="{ 'border-danger-500': errors.address }" />
              
              <small v-if="errors.address" class="text-danger-500">
                {{ errors.address }}
              </small>
            </div>
          </div>

          <div class="flex gap-8">
            <FormInput class="w-1/2" :label="$t('branch.branchCode')" v-model="branchCode"
              :error="errors.branchCode" placeholder="Enter full name" />

            <FormDropdown class="w-1/2" :label="$t('branch.branchStatus')" :options="options" v-model="branchStatus"
              :error="errors.branchStatus" placeholder="Finance Team" />

          </div>

          <div class="flex justify-between gap-4 mb-4 w-full">
            <BaseButton label="button.cancel" variant="ghost" block :to="{ name: 'UserGroup' }" />

            <BaseButton type="submit" :label="editMode ? 'button.save' : 'branch.createBranch'" variant="primary"
              block />
          </div>

        </form>
      </template>
    </card>
  </div>
</template>

<style scoped></style>
