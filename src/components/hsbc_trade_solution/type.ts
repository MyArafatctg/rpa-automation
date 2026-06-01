export type TradeStatus =
  | "Success"
  | "Processing"
  | "Fail"
  | "Pending"
  | "Running Tasks";

export interface TradeData {
  HTS_ID: string | null;
  TEMPLATE_NAME: string | null;
  CUSTOMER_REFERENCE: string | null;
  METHOD_OF_TRANSMISSION: string | null;
  APPLICANT_CONTACT_NAME: string | null;
  CONTACT_TELEPHONE: string | null;
  BENEFICIARY_NAME: string | null;
  BENEFICIARY_ADDRESS_LINE_1: string | null;
  BENEFICIARY_ADDRESS_LINE_2: string | null;
  BENEFICIARY_CITY: string | null;
  BENEFICIARY_PROVINCE: string | null;
  BENEFICIARY_POSTAL_CODE: string | null;
  BENEFICIARY_COUNTRY: string | null;
  ADVISING_BANK: string | null;
  ADVISING_BANK_COUNTRY: string | null;
  ADVISING_BANK_BRANCH_CODE_BIC_SWIFT: string | null;
  ADVISING_BANK_NAME: string | null;
  ADVISING_BANK_ADDRESS_LINE_1: string | null;
  ADVISING_BANK_LINE_2: string | null;
  ADVISING_BANK_LINE_3: string | null;
  DC_CURRENCY: string | null;
  DC_AMOUNT: string | null;
  DC_VARIANCE_PLUS_PCT: string | null;
  DC_VARIANCE_MINUS_PCT: string | null;
  DC_EXPIRY_DATE: string | null;
  DC_EXPIRY_PLACE: string | null;
  DC_IS_THIS_TRANSFERABLE: string | null;
  DC_REVOLVING: string | null;
  DC_PARTIAL_SHIPMENT: string | null;
  PAY_TERM_AVAILABLE_BY: string | null;
  PAY_TERM_AVAILABLE_BY_PCT: string | null;
  PAY_TERM_DRAFT_REQUIRED: string | null;
  PAY_TERM_CONF_REQUIRED: string | null;
  PAY_TERM_AVAIL_WITH_PARTY: string | null;
  PAY_TERM_PRESENTATION_PERIOD: string | null;
  PAY_TERM_PRESENTATION_DETAILS: string | null;
  PAY_TERM_HSBC_TO_ARRANGE_INSURANCE: string | null;
  DOC_INVOICE_ORIGINAL: string | null;
  DOC_INVOICE_COPIES: string | null;
  DOC_INVOICE: string | null;
  DOC_PACKING_ORIGINAL: string | null;
  DOC_PACKING_COPIES: string | null;
  DOC_PACKING_LIST: string | null;
  DOC_OTHER_CLAUSE: string | null;
  SHIPMENT_TRANSPORT_DOCUMENT: string | null;
  SHIPMENT_TRANSPORT_DOCUMENT_TYPE: string | null;
  SHIPMENT_TRANSPORT_DOCUMENT_ORIGINAL: string | null;
  SHIPMENT_TRANSPORT_DOCUMENT_COPIES: string | null;
  SHIPMENT_TRANSPORT_CLAUSES: string | null;
  SHIPMENT_IN_CHARGE: string | null;
  SHIPMENT_DESTINATION: string | null;
  SHIPMENT_PORT_OF_LOADING: string | null;
  SHIPMENT_PORT_OF_DISCHARGE: string | null;
  SHIPMENT_LATEST_DATE: string | null;
  SHIPMENT_INCONTERMS: string | null;
  TRANSHIPMENT: string | null;
  TRANSHIPMENT_GOODS_CLAUSE: string | null;
  ADDITIONAL_CONDITIONS: string | null;
  BANK_CHARGES_WHO: string | null;
  BANK_CHARGES_DEBIT: string | null;
  BANK_CHARGES_COLLATERAL: string | null;
  BANK_CHARGES_CURRENCY: string | null;
  SETTLEMENT_INSTRUCTION_METHOD: string | null;
  SETTLEMENT_INSTRUCTION_SPECIAL: string | null;
  VAT_REFERENCE: string | null;
  VAT_SPLIT_RATIO: string | null;
  SUPPORTING_DOC: string | null;
  STATUS: TradeStatus;
  ERR_DESCRIPTION: string | null;
  ELAPSED_TIME: string | null;
}

export interface TradePayload {
  id: string;
  status?: TradeStatus;
  errDescription?: string;
  elapsedTime?: string | number | null;
}

//Setting

export interface TradeSettingData {
  username: string;
  password: string;
  folder: string;
  runMode: string;
}

export interface TradeSettingsFormProps {
  onStart: (data: TradeSettingData) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const tradeInitialFormData: TradeSettingData = {
  username: "",
  password: "",
  folder: "",
  runMode: "Trial",
};
