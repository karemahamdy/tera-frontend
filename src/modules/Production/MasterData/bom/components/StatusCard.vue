<script setup lang="ts">

const props = defineProps({
  variant: { type: String, default: '' },
  border: { type: String, default: '' },
  title: { type: String, default: '' },
  value: { type: [String, Number], default: '' },
  valueUnit: { type: String, default: '' },
  subtitle: { type: String, default: '' },
});
</script>

<template>
  <div class="card p-[24px] bg-[#E9EAEB] rounded-[16px] border border-gray-200" :class="variant">
    <div class="flex flex-col justify-between">
      <h3 class="font-semibold text-lg">{{$t(title)}}</h3>
      <div class="font-bold text-3xl unit">
        {{ value }}
        <span v-if="valueUnit" class="font-bold text-2xl">{{$t( valueUnit) }}</span>
      </div>
      <div class="px-1 py-3 text-sm font-medium">{{$t( subtitle )}}</div>
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

.card.purple {
  background: #f0dce3;
  color: #df6d99;
  border: 1px solid #cc839f;
}
.purple .status {
  background: #fedbfe;
  color: #ce487b;
}
.purple .unit {
  color: #aa3e68;
}
.purple .progress-bg {
  background: #fedbfe;
}
.purple .progress {
  background: #FBCFE8;
}
</style>