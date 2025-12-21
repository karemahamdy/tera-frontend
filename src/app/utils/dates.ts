// date-utils.ts
import { format, formatDistance } from 'date-fns';
import { enUS, arSA } from 'date-fns/locale'; 
import i18n from '@/plugins/i18n';
import { toastService } from "@/app/services/toastService";

export function formatDateTimeLang(date: Date | string, withTime = true): string {
  try {
    const currentLanguage = i18n.global.locale.value ?? 'en'; // fix for TS
    const d = typeof date === 'string' ? new Date(date) : date;

    const dateArFormat = withTime ? 'do MMMM yyyy, hh:mm a' : 'do MMMM yyyy';
    const dateEnFormat = withTime ? 'EEEE, MMMM do, yyyy hh:mm a' : 'EEEE, MMMM do, yyyy';

    if (currentLanguage === 'ar') {
      return format(d, dateArFormat, { locale: arSA });
    } else {
      return format(d, dateEnFormat, { locale: enUS });
    }
  } catch (error) {
    toastService.error(error as string);
    return '';
  }
}

export function formatDistanceLang(date: Date | string): string {
  try {
    const currentLanguage = i18n.global.locale.value ?? 'en';
    const d = typeof date === 'string' ? new Date(date) : date;

    if (currentLanguage === 'ar') {
      return formatDistance(d, new Date(), { addSuffix: true, locale: arSA });
    } else {
      return formatDistance(d, new Date(), { addSuffix: true, locale: enUS });
    }
  } catch (error) {
    toastService.error(error as string);
    return '';
  }
}
