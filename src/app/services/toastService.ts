import type { ToastServiceMethods } from "primevue/toastservice";
import i18n from "../i18n";

class ToastService {
  private toastInstance: ToastServiceMethods | null = null;

  init(toast: ToastServiceMethods) {
    this.toastInstance = toast;
  }

  success(detail: string, summary?: string) {
    this.toastInstance?.add({
      severity: "success",
      summary: summary || i18n.global.t("toast.success"),
      detail,
      life: 3000,
    });
  }

  error(detail: string, summary?: string) {
    this.toastInstance?.add({
      severity: "error",
      summary: summary || i18n.global.t("toast.error"),
      detail,
      life: 3000,
    });
  }

  info(detail: string, summary?: string) {
    this.toastInstance?.add({
      severity: "info",
      summary: summary || i18n.global.t("toast.info"),
      detail,
      life: 3000,
    });
  }

  warn(detail: string, summary?: string) {
    this.toastInstance?.add({
      severity: "warn",
      summary: summary || i18n.global.t("toast.warning"),
      detail,
      life: 3000,
    });
  }
}

export const toastService = new ToastService();
