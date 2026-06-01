export type ContainerStatus =
  | "Success"
  | "Processing"
  | "Fail"
  | "Pending"
  | "Running Tasks";

export interface ContainerType {
  SL_NO: string;
  FCR: string;
  INVOICE_NO: string;
  EXP_NO: string;
  STATUS: ContainerStatus;
  SAVE_AS: string;
  TYPE_IN_TO_COPY: string;
  LENGTH: string;
  ERR_DESCRIPTION: string;
  ELAPSED_TIME: string;
}

export interface ContainerStatusUpdatedPayload {
  fcr: string;
  status?: ContainerStatus;
  errDescription?: string;
  elapsedTime?: string | number | null;
}
