export type SmartFormStatus =
  | "Success"
  | "Processing"
  | "Fail"
  | "Pending"
  | "Running Tasks";

export interface SmartFormData {
  Country_Territory: string | null;
  Language: string | null;
  Fund_Transfer_Method: string | null;
  Application_Date: string | Date | null;
  zone: string | null;

  Account_Name: string | null;
  Debit_Account_Number: number | string | null;
  Your_Reference: string | null;
  Customer_Type: string | null;
  Currency: string | null;

  Debit_Account_Currency: string | null;
  Remittance_Currency_1: string | null;
  Debit_Account_Currency_1: string | null;
  Amount_in_Words: string | null;
  Purpose_of_Payment: string | null;

  Fund_Transfer_Charges: string | null;
  Account_for_Debiting_Charge: string | null;
  Forward_Deal_Exchange_Contract_Reference: string | null;
  Exchange_Rate: number | string | null;
  Is_this_Payment_on_behalf_of_a_Third_Party: string | null;

  Ordering_Party_Name: string | null;
  Account_Number_IBAN_or_Unique_Identifier: string | null;
  Address: string | null;
  Address_1: string | null;
  City: string | null;
  Province: string | null;
  Country_Territory_1: string | null;
  Postcode: string | null;

  Beneficiary_Bank_Name: string | null;
  Bank_Code_Type: string | null;
  Beneficiary_Bank_Message: string | null;
  Address_2: string | null;
  Address_3: string | null;
  City_1: string | null;
  Province_1: string | null;
  Country_Territory_2: string | null;
  Postcode_1: string | null;

  Beneficiary_Bank_Name_Alt: string | null;
  Bank_Code_Type_Alt: string | null;
  Bank_Code: string | null;
  Beneficiary_Bank_Message_1: string | null;
  Address_4: string | null;
  Address_5: string | null;
  City_2: string | null;
  Province_2: string | null;
  Country_Territory_3: string | null;
  Postcode_2: string | null;

  Bank_Code_Type_1: string | null;
  Bank_Name_Code: string | null;
  Address_6: string | null;
  Address_7: string | null;
  City_3: string | null;
  Province_3: string | null;
  Country_Territory_4: string | null;
  Postcode_3: string | null;

  CUSTOMER_S_AUTHORISED_SIGNATURE: number | boolean | null;

  Status: SmartFormStatus;
  Err_Description: string;
  Elapsed_Time: string;
}

export interface SmartFormPayload {
  id: string;
  status?: SmartFormStatus;
  errDescription?: string;
  elapsedTime?: string | number | null;
}
