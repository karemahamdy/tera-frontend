import axiosWrapper from "@/app/http/axiosWrapper";

export const FileService = {
  async downloadFile(apiURL: string, fileName?: string) {
    const response = await axiosWrapper.get<Blob>(apiURL, {
      responseType: "blob",
    });
    const blob = new Blob([response]);
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = fileName || "user-template-file.csv";
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },
};
