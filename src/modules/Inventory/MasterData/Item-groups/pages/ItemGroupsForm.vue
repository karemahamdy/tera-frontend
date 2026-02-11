<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useForm } from "vee-validate";
import { useRouter } from "vue-router";
import { ItemGroupSchema } from "../validation/ItemGroupSchema";
import { useItemGroup } from "../composables/useItemGroup";
import { itemGroupsService } from "../services/itemGroup.service";

const props = defineProps<{
  mode: "edit" | "create" | "view";
   id?: string; 
   level: number;
}>();

const router = useRouter();
const editMode = props.mode === "edit";
const viewMode = props.mode === "view";
const isSubmitting = ref(false);
const isLoading = ref(false);

const { createItemGroup, updateItemGroup, clearErrors } = useItemGroup();

const { errors, defineField, setValues, handleSubmit } = useForm({
  validationSchema: ItemGroupSchema,
  initialValues: {
    nameAr: "",
    nameEn: "",
    code: "",
    description: "",
  },
});

const [nameAr] = defineField("nameAr");
const [nameEn] = defineField("nameEn");
const [code] = defineField("code");
const [description] = defineField("description");

const levelString = computed(() => {
  const levelMap: Record<number, string> = { 1: 'Category', 2: 'Group1', 3: 'Group2', 4: 'Group3', 5: 'Group4' };
  return levelMap[props.level] || 'Category';
});

const loadItemGroup = async () => {
  if (!props.id) return;
  
  isLoading.value = true;
  try {
    const data = await itemGroupsService.getById(props.id, levelString.value);
    setValues({
      nameAr: data.nameAr || "",
      nameEn: data.nameEn || "",
      code: data.code || "",
      description: data.description || "",
    });
  } catch (error) {
    console.error("Error loading item group:", error);
  } finally {
    isLoading.value = false;
  }
};

const onSubmit = handleSubmit(async (values) => {
  if (viewMode) return;
  
  isSubmitting.value = true;
  clearErrors();
  
  try {
    if (editMode && props.id) {
      await updateItemGroup(props.id, values, levelString.value);
    } else {
      await createItemGroup(values, levelString.value);
    }
    
    router.push({
      name: "itemGroups",
      query: { level: props.level }
    });
  } catch (error) {
    console.error("Error submitting form:", error);
  } finally {
    isSubmitting.value = false;
  }
});

onMounted(() => {
  if (props.mode !== "create" && props.id) {
    loadItemGroup();
  }
});

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
        <form @submit.prevent="onSubmit" class="space-y-6 px-20">
          <div>
            <FormInput :label="$t('itemGroup.code')" v-model="code" :error="errors.code" :placeholder="$t('itemGroup.codePlaceholder')"
              :invalid="!!errors.code" :disabled="viewMode || editMode || isLoading" />
          </div>
           <div class="flex justify-between w-full gap-4">
            <div class="w-[50%]">
              <FormInput :label="$t('itemGroup.itemGroupNameEn')" v-model="nameEn"
                :error="errors.nameEn" :placeholder="$t('itemGroup.namePlaceholder')"
                :invalid="!!errors.nameEn" :disabled="viewMode || isLoading" />
            </div>
            <div class="w-[50%]">
              <FormInput :label="$t('itemGroup.itemGroupNameAr')" v-model="nameAr"
                :error="errors.nameAr" :placeholder="$t('itemGroup.namePlaceholder')"
                :invalid="!!errors.nameAr" :disabled="viewMode || isLoading" />
            </div>
          </div>
          <div>
            <label class="text-gray-700 font-medium mb-2 block">
              {{ $t("itemGroup.description") }}
            </label>

            <Textarea v-model="description" :placeholder="$t('userGroup.descriptionPlaceholder')"
              class="mt-1 w-full p-3 border rounded-lg" rows="4" :class="{ 'border-danger-500': errors.description }"
              :disabled="viewMode || isSubmitting || isLoading" />

            <small v-if="errors.description" class="text-danger-500">
              {{ $t(errors.description) }}
            </small>
          </div>

          <div class="flex justify-between gap-4 mb-4 w-full">
            <BaseButton label="button.cancel" variant="ghost" block :to="{ name: 'itemGroups', query: { level: props.level } }"
              :disabled="isSubmitting" />

            <BaseButton v-if="!viewMode" type="submit" :label="editMode ? 'button.save' : 'userGroup.createGroup'" variant="primary"
              block :disabled="isSubmitting || isLoading" :loading="isSubmitting" />
          </div>
        </form>
      </template>
    </card>
  </div>
</template>

<style scoped></style>