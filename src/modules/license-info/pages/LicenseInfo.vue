<script setup lang="ts">
import { ref } from 'vue'
import StatusCard from './components/StatusCard.vue'
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
 

const cards = ref([
    {
        variant: 'orange',
        icon: 'Clock',
        title: t('licenseInfo.licenseExpire'),
        value: '65',
        valueUnit: '/ Days',
        subtitle: t('licenseInfo.expiresDec312025'),
        statusText: t('licenseInfo.urgent'),
        progressPercent: 65
    },
    {
        variant: 'green',
        borderClass: 'border-emerald-300',
        icon: 'Profile2User',
        title: t('licenseInfo.userCapacity'),
        value: '96/100',
        subtitle: t('licenseInfo.approachingLimit'),
        statusText: 'Active',
        progressPercent: 96
    },
    {
        variant: 'blue',
        borderClass: 'border-blue-300',
        icon: 'VideoTick',
        title: t('licenseInfo.concurrentSession'),
        value: '24/40',
        subtitle: t('licenseInfo.steadyHighUsage'),
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
