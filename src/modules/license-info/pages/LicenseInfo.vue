<script setup lang="ts">
import { computed } from 'vue';
import StatusCard from './components/StatusCard.vue';
import { useLicenseInfo } from '../composables/useLicenseInfo';
import { useI18n } from 'vue-i18n';
import { formatDateTimeDetailedLang } from '../../../app/utils/dates';

const { t } = useI18n();
const {
    licenseInfo,
    daysUntilExpiry,
    userUsagePercent,
    sessionUsagePercent
} = useLicenseInfo();

const cards = computed(() => {
    if (!licenseInfo.value) return [];

    return [
        {
            variant: 'orange',
            icon: 'Clock',
            title: 'licenseInfo.licenseExpire',
            value: daysUntilExpiry.value,
            valueUnit: 'licenseInfo.days',
            subtitle: `${t('licenseInfo.expiresOn')} ${formatDateTimeDetailedLang(
                licenseInfo.value.expiryDate
            )}`,
            statusText: daysUntilExpiry.value >= 90
                ? 'licenseInfo.urgent'
                : 'licenseInfo.active',
            progressPercent: Math.min(daysUntilExpiry.value, 100)
        },
        {
            variant: 'green',
            icon: 'Profile2User',
            title: 'licenseInfo.userCapacity',
            value: `${licenseInfo.value.currentNumperOfUser}/${licenseInfo.value.numperOfUserInLicense}`,
            subtitle: 'licenseInfo.approachingLimit',
            statusText: userUsagePercent.value >= 90 ? 'licenseInfo.urgent'
                : 'licenseInfo.active',
            progressPercent: userUsagePercent.value
        },
        {
            variant: 'blue',
            icon: 'VideoTick',
            title: 'licenseInfo.concurrentSession',
            value: `${licenseInfo.value.currentNumperOfSessions}/${licenseInfo.value.numperOfSessionsInLicense}`,
            subtitle: 'licenseInfo.steadyHighUsage',
            statusText: sessionUsagePercent.value >= 90 ? 'licenseInfo.urgent'
                : 'licenseInfo.active',
            progressPercent: sessionUsagePercent.value
        }
    ];
});
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
