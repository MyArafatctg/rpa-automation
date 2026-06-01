import type { EDocData, EDocStatus } from "./types";

export const mapToEDocData = (raw: any[]): EDocData[] => {
  const validStatus: EDocStatus[] = [
    "Success",
    "Processing",
    "Fail",
    "Pending",
  ];

  return raw.map((item) => ({
    Shipper: item.Shipper ?? "",
    Consignee: item.Consignee ?? "",
    Booking_confirmation_number: item.Booking_confirmation_number ?? "",
    Booking_Number: "",
    File_Path: item.File_Path ?? "",
    File_Name: item.File_Name ?? "",
    Upload_Type: item.Upload_Type ?? "",
    Save_As: "",
    Status: validStatus.includes(item.Status) ? item.Status : "Pending",
    Err_Description: item.Err_Description || null,
    Elapsed_Time: item.Elapsed_Time?.toString() ?? null,
  }));
};
