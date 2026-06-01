export type InvoiceStatus =
  | "Success"
  | "Pass"
  | "Processing"
  | "Fail"
  | "Pending"
  | "Running Tasks";

export interface EInvoice {
  EINVOICE_ID: string;
  ORDER_NUMBER: string;
  INVOICE_NUMBER: string;
  WAREHOUSE_CODE: string;
  INVOICE_DATE: string;
  COUNTRY_CODE: string;
  GOODS_INFO_FOR_JAPAN: string;
  QTY: string;
  ALTERNATIVE_ORDER_NUMBER: string;
  INVOICEDATEFORMAT: string;
  DESCRIPTION1: string;
  COMPOSITION: string;
  HS_CODE_1: string;
  HS_CODE_2: string;
  HS_CODE_M: string;
  TERMS_OF_DELIVERY: string;
  MODE_OF_TRANSPORT: string;
  PORT_OF_LOADINGINPUT: string;
  PORT_OF_DISCHARGEINPUT: string;
  COUNTRY_OF_ORIGIN: string;
  CONTAINER: string;
  TYPEOFPACKAGE: string;
  UNITTYPE: string;
  VAT: string;
  EXPORTER_REFERENCE: string;
  VAT_TEXT: string;
  EXPORTER_DECLARATION: string;
  ORIGIN_DECLARATION: string;
  REX_DECLARATION: string;
  EXPORTER: string;
  SUPPLIER_NAME: string;
  STREET_2: string;
  STREET_3: string;
  STREET_1: string;
  STREET_4: string;
  STREET_5: string;
  SUPPLIER_POSTALCODE: string;
  SUPPLIER_CITY: string;
  SUPPLIER_REGION: string;
  SUPPLIER_COUNTRY: string;
  SUPPLIER_TAXID: string;
  SUPPLIER_EMAIL: string;
  SUPPLIER_EMAILINCLUDED: string;
  REMARKSTEXT: string;
  CONSIGNEETEXT: string;
  CUSTOM_CLR_CAT_DESCR: string;
  CUSTOM_CLR_CAT_COMPOSITION: string;
  CUSTOM_CLR_CAT_HS_CODE: string;
  CUSTOM_CLR_CAT_PRICE: string;
  CUSTOM_CLR_CAT_QUANTITY: string;
  STATUS: InvoiceStatus;
  INSERTED_BY: string;
  INSERTED_DATE: string;
  UPDATED_BY: string;
  UPDATED_DATE: string;
  ELAPSED_TIME: string;
  ERR_DESCRIPTION: string;
  ACTUAL_MANUFACTURER: string;
  SPLIT_DESCR_1: string;
  SPLIT_COMP_1: string;
  SPLIT_HS_CODE_1: string;
  SPLIT_PRICE_1: string;
  SPLIT_QTY_1: string;
  SPLIT_DESCR_2: string;
  SPLIT_COMP_2: string;
  SPLIT_HS_CODE_2: string;
  SPLIT_PRICE_2: string;
  SPLIT_QTY_2: string;
  SPLIT_DESCR_3: string;
  SPLIT_COMP_3: string;
  SPLIT_HS_CODE_3: string;
  SPLIT_PRICE_3: string;
  SPLIT_QTY_3: string;
  SPLIT_DESCR_4: string;
  SPLIT_COMP_4: string;
  SPLIT_HS_CODE_4: string;
  SPLIT_PRICE_4: string;
  SPLIT_QTY_4: string;
  INVOICE_NUMBER2: string;
}

export interface InvoiceStatusUpdatePayload {
  invoiceId: string;
  status?: InvoiceStatus;
  errDescription?: string;
  elapsedTime?: string | number | null;
}

//Setting

export interface InvoiceSettingData {
  username: string;
  password: string;
  folder: string;
  runMode: string;
}

export interface InvoiceSettingsFormProps {
  onStart: (data: InvoiceSettingData) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const invoiceInitialFormData: InvoiceSettingData = {
  username: "",
  password: "",
  folder: "",
  runMode: "Trial",
};
