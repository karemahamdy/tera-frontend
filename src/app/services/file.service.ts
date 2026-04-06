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
        link.download = fileName || "user-template-file.xlxs";
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
downloadBlobCSV(data: Blob, fileName: string) {
  const isCSV = fileName.toLowerCase().endsWith(".xlxs");
  if (isCSV) {
    const BOM = "\uFEFF";
    data.text().then(text => {
      const blob = new Blob([BOM + text], {
        type: "text/csv;charset=utf-8;"
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
    });
    return;
  }
  const url = window.URL.createObjectURL(data);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  window.URL.revokeObjectURL(url);
}

};
