<script setup lang="ts">
import ScreenHeader from "@/sharedComponents/ScreenHeader.vue";
import BaseButton from "@/sharedComponents/BaseButton.vue";
import { useRoute, useRouter } from "vue-router";
import { useForm } from "vee-validate";
import { branchFormSchema } from "../validation/BranchSchema";
import ToggleItem from "@/sharedComponents/inputs/ToggleItem.vue";
import FormInput from "@/sharedComponents/inputs/FormInput.vue";
import { ref } from "vue";
import type { AddBranch } from "../types/branches";
import { useBranches } from "../composables/useBranch";


const props = defineProps<{
  mode: "edit" | "create";
}>();

const route = useRoute();
const router = useRouter();
const isSubmitting = ref(false);
const editMode = props.mode === "edit";
const branchId = route.params.id ? String(route.params.id) : null;

const { createBranch, updateBranch } = useBranches();

const { handleSubmit, errors, defineField } = useForm({
  validationSchema: branchFormSchema,
  initialValues: {
    nameAr: "",
    nameEn: "",
    addressAr: "",
    addressEn: "",
    code: "",
    // branchStatus: "",
    isActive: true,
  },
});

const [nameAr] = defineField("nameAr");
const [nameEn] = defineField("nameEn");
const [addressAr] = defineField("addressAr");
const [addressEn] = defineField("addressEn");
const [code] = defineField("code");
const [isActive] = defineField("isActive");

const onSubmit = handleSubmit(async (values) => {
  isSubmitting.value = true;

  const payload: AddBranch = {
    nameAr: values.nameAr,
    nameEn: values.nameEn,
    addressAr: values.addressAr,
    addressEn: values.addressEn,
    code: values.code,
    isActive: values.isActive
  };

  try {
    if (editMode && branchId) {
      await updateBranch(branchId , payload);
    } else {
      await createBranch(payload);
    }
    router.push({ name: "BranchManagement" });
  } catch (error) {
    console.error("Error submitting form:", error);
  } finally {
    isSubmitting.value = false;
  }
});

</script>

<template>
  <div>
    <ScreenHeader title="accessControl" subtitle="branch.branchName"
      :actionName="editMode ? $t('branch.editBranch') : $t('branch.addNewBranch')" />

    <card class="p-6 bg-[#ffffff] rounded-[10px]">
      <template #title>
        <div class="flex flex-col px-20">
          <h2 class="heading-title">
            {{ editMode ? $t("branch.editBranch") : $t("branch.addNewBranch") }}
          </h2>
          <p class="subheading-title">
              {{ editMode ? $t("branch.editBranchInfo") : $t("branch.userBranchInfo") }}
          </p>
        </div>
      </template>

      <template #content>
        <form @submit.prevent="onSubmit" class="space-y-6 px-20">
          <div class="flex gap-8">

            <FormInput class="w-1/2" :label="$t('branch.branchName')" v-model="nameAr" :error="errors.nameAr"
              placeholder="e.g., Head Office" :invalid="!!errors.nameAr" />
            <FormInput class="w-1/2" :label="$t('branch.branchNameAr')" v-model="nameEn" :error="errors.nameEn"
              placeholder=" المكتب الرئيسي" :invalid="!!errors.nameEn" />
          </div>
          <div class="flex gap-8">
            <div class="w-1/2">

              <label class="text-gray-700 font-medium mb-2 block">
                {{ $t("branch.address") }}
              </label>

              <Textarea v-model="addressAr"
                placeholder="Describe full address for this branch.."
                class="mt-1 w-full p-3 border rounded-lg" rows="4" :class="{ 'border-danger-500': errors.addressAr }" />

              <small v-if="errors.addressAr" class="text-danger-500">
                {{ errors.addressAr }}
              </small>
            </div>

            <div class="w-1/2">

              <label class="text-gray-700 font-medium mb-2 block">
                {{ $t("branch.addressAr") }}
              </label>

              <Textarea v-model="addressEn" placeholder="وصف العنوان الكامل لهذا الفرع.."
                class="mt-1 w-full p-3 border rounded-lg" rows="4" :class="{ 'border-danger-500': errors.addressEn }" />

              <small v-if="errors.addressEn" class="text-danger-500">
                {{ errors.addressEn }}
              </small>
            </div>
          </div>

          <div class="flex gap-8">
<<<<<<< HEAD
            <FormInput class="w-1/2" :label="$t('branch.branchCode')" v-model="branchCode" :error="errors.branchCode"
              :placeholder="$t('form.fullNamePlaceholder')" />
=======
            <FormInput class="w-1/2" :label="$t('branch.branchCode')" v-model="code" :error="errors.code"
              placeholder="e.g., HQ" />
>>>>>>> bbe04705fbf066c11d6c5255cbb4387be8cd47f8
            <ToggleItem :title="$t('branch.branchStatus')" :label="$t('branch.branchStatus')" v-model="isActive" />

          </div>

          <div class="flex justify-between gap-4 mb-4 w-full">
            <BaseButton label="button.cancel" variant="ghost" block :to="{ name: 'BranchManagement' }" />

            <BaseButton type="submit" :label="editMode ? 'button.save' : 'branch.createBranch'" variant="primary"
              block />
          </div>

        </form>
      </template>
    </card>
  </div>
</template>

<style scoped></style>
