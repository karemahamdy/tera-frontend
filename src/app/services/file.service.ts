import axiosWrapper from "@/app/http/axiosWrapper";
import { toastService } from "./toastService";

export const FileService = {
  downloadFile(url: string, fileName?: string) {
    return axiosWrapper
      .get<Blob>(url, {
        responseType: "blob",
      })
      .then((response) => {
        const blob = new Blob([response]);
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = fileName || "user-template-file.csv";
        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }).catch((error) => {
        toastService.error(error as string);
      });
  },
};
