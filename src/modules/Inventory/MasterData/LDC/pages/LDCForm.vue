<script setup lang="ts">
import { ref } from "vue";
import { useForm } from "vee-validate";
import { ItemGroupSchema } from "../../Item-groups/validation/ItemGroupSchema";

const props = defineProps<{
  mode: "edit" | "create";
}>();

const editMode = props.mode === "edit";
const isSubmitting = ref(false);

const { errors, defineField, } = useForm({
  validationSchema: ItemGroupSchema,
  initialValues: {
    LDCNameAr: "",
    LDCNameEn: "",
    code: "",
   
  },
});

const [LDCNameAr] = defineField("LDCNameAr");
const [LDCNameEn] = defineField("LDCNameEn");
const [code] = defineField("code");

</script>

<template>
  <div>
    <ScreenHeader title="inventory" subtitle="masterData" actionName="LDC.title" />

    <card class="p-6 bg-[#ffffff] rounded-[10px]">
      <template #title>
        <div class="flex flex-col px-20">
          <h2 class="heading-title">
            {{ editMode ? $t("LDC.editLDCInfo") : $t("LDC.addLDCInfo") }}
          </h2>
          <p class="subheading-title">
          {{ editMode ? $t("LDC.editLDCInfoDesc") : $t("LDC.addLDCInfoDesc") }}
          </p>
        </div>
      </template>

      <template #content>
        <form @submit.prevent="" class="space-y-6 px-20">
          <div>
            <FormInput :label="$t('LDC.LDCCode')" v-model="code" :error="errors.code" :placeholder="$t('LDC.codePlaceholder')"
              :invalid="!!errors.code" />
          </div>

           <div class="flex justify-between w-full gap-4">
            <div class="w-[50%]">
              <FormInput :label="$t('LDC.LDCNameEn')" v-model="LDCNameAr"
                :error="errors.LDCNameAr" :placeholder="$t('LDC.namePlaceholder')"
                :invalid="!!errors.LDCNameAr" />
            </div>
            <div class="w-[50%]">
              <FormInput :label="$t('LDC.LDCNameAr')" v-model="LDCNameEn"
                :error="errors.LDCNameEn" :placeholder="$t('LDC.namePlaceholder')"
                :invalid="!!errors.LDCNameEn" />
            </div>
          </div>
        
           <div class="flex justify-between w-full gap-4">
            <div class="w-[50%]">
              <FormInput :label="$t('LDC.Local Purchase Account')" v-model="LDCNameAr"
                :error="errors.LDCNameAr" :placeholder="$t('LDC.namePlaceholder')"
                :invalid="!!errors.LDCNameAr" />
            </div>
            <div class="w-[50%]">
              <FormInput :label="$t('LDC.Local Sales Account')" v-model="LDCNameEn"
                :error="errors.LDCNameEn" :placeholder="$t('LDC.namePlaceholder')"
                :invalid="!!errors.LDCNameEn" />
            </div>
          </div>

           <div class="flex justify-between w-full gap-4">
            <div class="w-[50%]">
              <FormInput :label="$t('LDC.Local Purchase Return')" v-model="LDCNameAr"
                :error="errors.LDCNameAr" :placeholder="$t('LDC.namePlaceholder')"
                :invalid="!!errors.LDCNameAr" />
            </div>
            <div class="w-[50%]">
              <FormInput :label="$t('LDC.Local Sales Return')" v-model="LDCNameEn"
                :error="errors.LDCNameEn" :placeholder="$t('LDC.namePlaceholder')"
                :invalid="!!errors.LDCNameEn" />
            </div>
          </div>

           <div class="flex justify-between w-full gap-4">
            <div class="w-[50%]">
              <FormInput :label="$t('LDC.Import Purchase Account')" v-model="LDCNameAr"
                :error="errors.LDCNameAr" :placeholder="$t('LDC.namePlaceholder')"
                :invalid="!!errors.LDCNameAr" />
            </div>
            <div class="w-[50%]">
              <FormInput :label="$t('LDC.Import Purchase Return')" v-model="LDCNameEn"
                :error="errors.LDCNameEn" :placeholder="$t('LDC.namePlaceholder')"
                :invalid="!!errors.LDCNameEn" />
            </div>
          </div>

           <div class="flex justify-between w-full gap-4">
            <div class="w-[50%]">
              <FormInput :label="$t('LDC.Export Sales Account')" v-model="LDCNameAr"
                :error="errors.LDCNameAr" :placeholder="$t('LDC.namePlaceholder')"
                :invalid="!!errors.LDCNameAr" />
            </div>
            <div class="w-[50%]">
              <FormInput :label="$t('LDC.Export Sales Return')" v-model="LDCNameEn"
                :error="errors.LDCNameEn" :placeholder="$t('LDC.namePlaceholder')"
                :invalid="!!errors.LDCNameEn" />
            </div>
          </div>

           <div class="flex justify-between w-full gap-4">
            <div class="w-[50%]">
              <FormInput :label="$t('LDC.Physical Count')" v-model="LDCNameAr"
                :error="errors.LDCNameAr" :placeholder="$t('LDC.namePlaceholder')"
                :invalid="!!errors.LDCNameAr" />
            </div>
            <div class="w-[50%]">
              <FormInput :label="$t('LDC.Physical Count')" v-model="LDCNameEn"
                :error="errors.LDCNameEn" :placeholder="$t('LDC.namePlaceholder')"
                :invalid="!!errors.LDCNameEn" />
            </div>
          </div>

           <div>
            <FormInput :label="$t('LDC.Inventory Adjustment')" v-model="code" :error="errors.code" :placeholder="$t('LDC.codePlaceholder')"
              :invalid="!!errors.code" />
          </div>
          
          <div class="flex justify-between gap-4 mb-4 w-full">
            <BaseButton label="button.cancel" variant="ghost" block :to="{ name: 'LDCs' }"
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