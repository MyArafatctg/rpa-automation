import type { ContainerStatus, ContainerType } from "./containerTypes";

export const mapToContainerType = (raw: any[]): ContainerType[] => {
  const validStatus: ContainerStatus[] = [
    "Success",
    "Processing",
    "Fail",
    "Pending",
    "Running Tasks",
  ];

  return raw.map((item) => ({
    SL_NO: item.SL_NO ?? "",
    FCR: item.FCR ?? "",
    INVOICE_NO: item.INVOICE_NO ?? "",
    EXP_NO: item.EXP_NO ?? "",
    STATUS: validStatus.includes(item.STATUS) ? item.STATUS : "Pending",
    SAVE_AS: item.SAVE_AS ?? "",
    TYPE_IN_TO_COPY: item.TYPE_IN_TO_COPY ?? "",
    LENGTH: item.LENGTH ?? "",
    ERR_DESCRIPTION: item.Err_Description ?? "",
    ELAPSED_TIME: item.Elapsed_Time?.toString() ?? null,
  }));
};
