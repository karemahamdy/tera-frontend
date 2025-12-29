<script setup lang="ts">

const props = defineProps({
  variant: { type: String, default: '' },
  border: { type: String, default: '' },
  icon: { type: String, default: '' },
  title: { type: String, default: '' },
  value: { type: [String, Number], default: '' },
  valueUnit: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  statusText: { type: String, default: '' },
  progressPercent: { type: Number, default: 0 }
});
</script>

<template>
  <div class="card p-[24px] rounded-[16px] border border-gray-200" :class="variant">
    <div class="flex justify-between items-center mb-4">
      <div class="w-12 h-12 flex items-center justify-center rounded-xl bg-white shadow-md">
        <VsxIcon :iconName="icon" :size="24" :color="variant" type="linear" />
      </div>
      <span class="status">{{$t( statusText )}}</span>
    </div>
    <div class="flex flex-col justify-between">
      <h3 class="font-semibold text-lg">{{$t(title)}}</h3>
      <div class="font-bold text-3xl unit">
        {{ $t(value) }}
        <span v-if="valueUnit" class="font-normal text-lg">{{$t( valueUnit) }}</span>
      </div>
      <div class="px-1 py-3 text-sm font-medium">{{$t( subtitle )}}</div>
    </div>
    <div class="overflow-hidden rounded-full h-[8px] progress-bg mt-4">
      <div class="progress" :style="{ width: progressPercent + '%' }"></div>
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
.progress {
  height: 100%;
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
.orange .unit {
  color: #B54708;
}
.orange .progress-bg {
  background: #fed7aa;
}
.orange .progress {
  background: #F79009;
}
.card.green {
  background: #ECFDF3;
  color: #059669;
  border: 1px solid #D1FADF;
}
.green .status {
  background: #d1fae5;
  color: #027A48;
}
.green .unit {
  color: #027A48;
}
.green .progress-bg {
  background: #a7f3d0;
}
.green .progress {
  background: #00BC7D;
}
.card.blue {
  background: #F0F3FA;
  color: #638EFF;
  border: 1px solid #CBD4EC;
}
.blue .status {
  background: #DBEAFE;
  color: #082393;
}
.blue .unit {
  color: #082393;
}
.blue .progress-bg {
  background: #c7d2fe;
}
.blue .progress {
  background: #638EFF;
}
</style>