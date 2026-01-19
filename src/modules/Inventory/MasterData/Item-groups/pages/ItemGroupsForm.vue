<script setup lang="ts">
import { ref } from "vue";
import { useForm } from "vee-validate";
import { ItemGroupSchema } from "../validation/ItemGroupSchema";


const props = defineProps<{
  mode: "edit" | "create";
}>();

const editMode = props.mode === "edit";
const isSubmitting = ref(false);

const { errors, defineField, } = useForm({
  validationSchema: ItemGroupSchema,
  initialValues: {
    itemGroupNameAr: "",
    itemGroupNameEn: "",
    code: "",
    description: "",
  },
});

const [itemGroupNameAr] = defineField("itemGroupNameAr");
const [itemGroupNameEn] = defineField("itemGroupNameEn");
const [code] = defineField("code");
const [description] = defineField("description");

</script>

<template>
  <div>
    <ScreenHeader title="inventory" subtitle="masterData" actionName="itemGroup.title" />

    <card class="p-6 bg-[#ffffff] rounded-[10px]">
      <template #title>
        <div class="flex flex-col px-20">
          <h2 class="heading-title">
            {{ editMode ? $t("itemGroup.editItemsGroup") : $t("itemGroup.addNewGroup") }}
          </h2>
          <p class="subheading-title">
          {{ editMode ? $t("itemGroup.editGroupInfo") : $t("itemGroup.itemGroupInfo") }}
          </p>
        </div>
      </template>

      <template #content>
        <form @submit.prevent="" class="space-y-6 px-20">
          <div>
            <FormInput :label="$t('itemGroup.code')" v-model="code" :error="errors.code" :placeholder="$t('itemGroup.codePlaceholder')"
              :invalid="!!errors.code" />
          </div>
           <div class="flex justify-between w-full gap-4">
            <div class="w-[50%]">
              <FormInput :label="$t('itemGroup.itemGroupNameEn')" v-model="itemGroupNameAr"
                :error="errors.itemGroupNameAr" :placeholder="$t('itemGroup.namePlaceholder')"
                :invalid="!!errors.itemGroupNameAr" />
            </div>
            <div class="w-[50%]">
              <FormInput :label="$t('itemGroup.itemGroupNameAr')" v-model="itemGroupNameEn"
                :error="errors.itemGroupNameEn" :placeholder="$t('itemGroup.namePlaceholder')"
                :invalid="!!errors.itemGroupNameEn" />
            </div>
          </div>
          <div>
            <label class="text-gray-700 font-medium mb-2 block">
              {{ $t("itemGroup.description") }}
            </label>

            <Textarea v-model="description" :placeholder="$t('userGroup.descriptionPlaceholder')"
              class="mt-1 w-full p-3 border rounded-lg" rows="4" :class="{ 'border-danger-500': errors.description }"
              :disabled="isSubmitting" />

            <small v-if="errors.description" class="text-danger-500">
              {{ $t(errors.description) }}
            </small>
          </div>

          <div class="flex justify-between gap-4 mb-4 w-full">
            <BaseButton label="button.cancel" variant="ghost" block :to="{ name: 'itemGroups' }"
              :disabled="isSubmitting" />

            <BaseButton type="submit" :label="editMode ? 'button.save' : 'userGroup.createGroup'" variant="primary"
              block :disabled="isSubmitting" :loading="isSubmitting" />
          </div>
        </form>
      </template>
    </card>
  </div>
</template>

<style scoped></style>