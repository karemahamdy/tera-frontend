// date-utils.ts
import { format, formatDistance, isValid } from "date-fns";
import { enUS, arSA } from "date-fns/locale";
import i18n from "@/app/i18n/index";
import { toastService } from "@/app/services/toastService";

export function formatDateTimeLang(
  date: Date | string,
  withTime = false
): string {
  try {
    if(date === "0001-01-01T00:00:00") return "-";
    const currentLanguage = i18n.global.locale.value ?? "en";

    const d = typeof date === "string" ? new Date(date) : date;
    if (!isValid(d)) return "";

    const baseFormat = "MMM d, yyyy";
    const timeFormat = "hh:mm a";

    const formatString = withTime ? `${baseFormat} ${timeFormat}` : baseFormat;

    const locale = currentLanguage === "ar" ? arSA : enUS;

    return format(d, formatString, { locale });
  } catch (error) {
    toastService.error(String(error));
    return "";
  }
}

export function formatDateTimeDetailedLang(
  date: Date | string,
  withTime = true
): string {
  try {
    if(date === "0001-01-01T00:00:00") return "-";

    const currentLanguage = i18n.global.locale.value ?? "en";

    const d = typeof date === "string" ? new Date(date) : date;
    if (!isValid(d)) return "";

    const dateArFormat = withTime ? "do MMMM yyyy, hh:mm a" : "do MMMM yyyy";
    const dateEnFormat = withTime
      ? "EEEE, MMMM do, yyyy hh:mm a"
      : "EEEE, MMMM do, yyyy";

    if (currentLanguage === "ar") {
      return format(d, dateArFormat, { locale: arSA });
    } else {
      return format(d, dateEnFormat, { locale: enUS });
    }
  } catch (error) {
    toastService.error(error as string);
    return "";
  }
}

export function formatDistanceLang(date: Date | string): string {
  try {
    if(date === "0001-01-01T00:00:00") return "-";

    const currentLanguage = i18n.global.locale.value ?? "en";
    const d = typeof date === "string" ? new Date(date) : date;
    if (!isValid(d)) return "";
    
    if (currentLanguage === "ar") {
      return formatDistance(d, new Date(), { addSuffix: true, locale: arSA });
    } else {
      return formatDistance(d, new Date(), { addSuffix: true, locale: enUS });
    }
  } catch (error) {
    toastService.error(error as string);
    return "";
  }
}
 export function formatDate (date: Date | null): string  | undefined {
  if (!date) return ;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};
