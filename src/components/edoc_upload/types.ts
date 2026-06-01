export type EDocStatus =
  | "Success"
  | "Processing"
  | "Fail"
  | "Pending"
  | "Uploading";

export interface EDocData {
  Shipper: string;
  Consignee: string;
  Booking_confirmation_number: string;
  Booking_Number: string;
  File_Path: string;
  File_Name: string;
  Upload_Type: string;
  Save_As: string;
  Status: EDocStatus;
  Err_Description: string | null;
  Elapsed_Time: string | null;
}

export interface EdocStatusUpdatedPayload {
  bookingNumber: string;
  status?: EDocStatus;
  errDescription?: string;
  elapsedTime?: string | number | null;
}

export interface EdocInsertPayload {
  shipper: string;
  consignee: string;
  bookingConfirmationNumber: string;
  uploadType: string;
  filePath: string;
  fileName: string;
  status: string;
  errDescription: string;
  elapsedTime: string;
  insertedBy: string;
  updatedBy: string;
}
