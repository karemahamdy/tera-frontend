<script setup lang="ts">

const props = defineProps({
  variant: { type: String, default: '' },
  border: { type: String, default: '' },
  icon: { type: String, default: '' },
  title: { type: String, default: '' },
  value: { type: [String, Number], default: '' },
});
</script>

<template>
  <div class="card p-[24px] rounded-[16px] border border-gray-200" :class="variant">
    <div class="flex justify-between items-center mb-4">
      <div class="w-14 h-14 flex items-center justify-center rounded-full bg-white">
        <VsxIcon :iconName="icon" :size="24" :color="variant" type="linear" />
      </div>
    </div>
    <div class="flex flex-col justify-between">
      <div class="font-bold text-3xl unit text-[#414651]">
        {{ value }}
      </div>
      <h3 class="font-light text-lg text-[#717680]">{{$t(title)}}</h3>
    </div>

  </div>
</template>

<style scoped>
.status {
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 400;
}

.card.orange {
  background: #FEF0C7;
  color: #F79009;
  border: 1px solid #FEDF89;
}
.orange .status {
  background: #FFE59E;
  color: #F79009;
}

.card.green {
  background: #ECFDF3;
  color: #059669;
  border: 1px solid #D1FADF;
}
.card.blue {
  background: #F0F3FA;
  color: #638EFF;
  border: 1px solid #CBD4EC;
}

.card.pink {
  background: #FDF2F8;
  color: #f190b7;
  border: 1px solid #FBCFE8;
}

</style>