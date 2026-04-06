import { ref, computed, onMounted } from 'vue';
import type { ActivationInformation } from '../types/license';
import { AdministrationService } from '../services/group.service';

export function useLicenseInfo() {
  const loading = ref(false);
  const licenseInfo = ref<ActivationInformation | null>(null);

  const fetchLicenseInfo = async () => {
    loading.value = true;
    try {
      const { data } = await AdministrationService.getActivationInformation();
      licenseInfo.value = data;
    } finally {
      loading.value = false;
    }
  };

  const daysUntilExpiry = computed(() => {
    if (!licenseInfo.value) return 0;
    const expiry = new Date(licenseInfo.value.expiryDate).getTime();
    const now = Date.now();
    return Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
  });

  const userUsagePercent = computed(() => {
    if (!licenseInfo.value) return 0;
    return Math.round(
      (licenseInfo.value.currentNumperOfUser /
        licenseInfo.value.numperOfUserInLicense) *
        100
    );
  });

  const sessionUsagePercent = computed(() => {
    if (!licenseInfo.value) return 0;
    return Math.round(
      (licenseInfo.value.currentNumperOfSessions /
        licenseInfo.value.numperOfSessionsInLicense) *
        100
    );
  });

  onMounted(fetchLicenseInfo);

  return {
    loading,
    licenseInfo,
    daysUntilExpiry,
    userUsagePercent,
    sessionUsagePercent
  };
}
