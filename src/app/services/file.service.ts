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
      })
      .catch((error) => {
        toastService.error(error as string);
      });
  },
  uploadFile(url: string, data: { file: string | Blob }, fileKey?: string) {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        formData.append(fileKey ?? key, value as string | Blob);
      }
    });
    return axiosWrapper.post(url, formData);
  },

  downloadBlob (response: Blob, fileName: string) {
  const blob = new Blob([response]);
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(link.href);
},

};
