<script setup lang="ts">
import { ref } from 'vue'
import StatusCard from './components/StatusCard.vue'

const cards = ref([
    {
        variant: 'orange',
        icon: 'Clock',
        title: 'License Expire',
        value: '65',
        valueUnit: '/ Days',
        subtitle: 'Expires Dec 31, 2025',
        statusText: 'Urgent',
        progressPercent: 65
    },
    {
        variant: 'green',
        borderClass: 'border-emerald-300',
        icon: 'Profile2User',
        title: 'User Capacity',
        value: '96/100',
        subtitle: 'Approaching Limit',
        statusText: 'Active',
        progressPercent: 96
    },
    {
        variant: 'blue',
        borderClass: 'border-blue-300',
        icon: 'VideoTick',
        title: 'Concurrent Session',
        value: '24/40',
        subtitle: 'Steady High Usage',
        statusText: 'Active',
        progressPercent: 60
    }
])
</script>

<template>
    <ScreenHeader title="Adminstration" subtitle="licenseInfo.title" />
    <card class="bg-[#ffffff] rounded-[10px]">
        <template #title>
            <PageHeader title="licenseInfo.title" subtitle="licenseInfo.subtitle" :showExport="false"
                :showImport="false" :mainBtn="false" :showSearch="false" />
        </template>
        <template #content>
            <div class="grid gap-6 md:grid-cols-3 sm:grid-cols-1">
                <StatusCard v-for="(card, index) in cards" :key="index" v-bind="card" />
            </div>
        </template>
    </card>
</template>
