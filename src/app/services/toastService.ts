import type { ToastServiceMethods } from "primevue/toastservice";

class ToastService {
  private toastInstance: ToastServiceMethods | null = null;
  init(toast: ToastServiceMethods) {
    this.toastInstance = toast;
  }

  success(detail: string, summary = "Success") {
    this.toastInstance?.add({
      severity: "success",
      summary,
      detail,
      life: 3000,
    });
  }

  error(detail: string, summary = "Error") {
    this.toastInstance?.add({
      severity: "error",
      summary,
      detail,
      life: 3000,
    });
  }

  info(detail: string, summary = "Info") {
    this.toastInstance?.add({
      severity: "info",
      summary,
      detail,
      life: 3000,
    });
  }

  warn(detail: string, summary = "Warning") {
    this.toastInstance?.add({
      severity: "warn",
      summary,
      detail,
      life: 3000,
    });
  }
}

export const toastService = new ToastService();
