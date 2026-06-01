import { XIcon } from "lucide-react";
import React, { useState, useCallback, useEffect } from "react";
import { toast } from "react-toastify";
import InputField from "../util/setting_form/InputField";
import {
  invoiceInitialFormData,
  type InvoiceSettingData,
  type InvoiceSettingsFormProps,
} from "./InvoiceType";

const InvoiceSetting: React.FC<InvoiceSettingsFormProps> = ({
  onStart,
  isOpen,
  onClose,
}) => {
  const [formData, setFormData] = useState<InvoiceSettingData>(
    invoiceInitialFormData,
  );
  const [error, setError] = useState("");

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleChange = useCallback(
    (e: any) => {
      const { name, value, type, checked } = e.target;
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
      setError("");
    },
    [formData],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // VALIDATION
    if (
      !formData.username ||
      !formData.password ||
      !formData.folder ||
      !formData.runMode
    ) {
      setError("Please fill all required fields.");
      return;
    }

    // All good → call onStart
    onStart(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20  flex items-center justify-center z-50 p-4 ">
      <div className="bg-white  p-8 rounded-xl w-full max-w-2xl relative drop-shadow-lg">
        {/* HEADER */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 bg-red-300 hover:bg-red-400 p-2 rounded-full cursor-pointer"
        >
          <XIcon />
        </button>

        <h2 className="text-xl font-semibold mb-4">
          Set username and password
        </h2>
        <form onSubmit={handleSubmit}>
          <div>
            {" "}
            {/*<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">*/}
            {/* Column 1 */}
            <div className="space-y-3">
              <InputField
                label="Username"
                name="username"
                hasFileIcon
                value={formData.username}
                onChange={handleChange}
              />
              <InputField
                label="Password"
                name="password"
                type="password"
                hasFileIcon
                value={formData.password}
                onChange={handleChange}
              />
              <InputField
                label="Enter the Folder Path"
                name="folder"
                hasFileIcon
                value={formData.folder}
                onChange={handleChange}
              />

              <InputField
                label="Run Mode"
                name="runMode"
                value={formData.runMode}
                onChange={handleChange}
                isSelect
                options={["Trial", "Approve", "Approve and Download"]}
              />
              {/*              <InputField
                label="Excel File Path"
                name="excelFilePath"
                hasFileIcon
                value={formData.excelFilePath}
                onChange={handleChange}
              />

              <InputField
                label="Invoice Save Format"
                name="invoiceSaveFormat"
                isSelect
                options={[
                  '"Order No" "WAREHOUSE CODE" .pdf',
                  "Simple .pdf",
                  "Complex .zip",
                ]}
                value={formData.invoiceSaveFormat}
                onChange={handleChange}
              />

              <InputField
                label="Exporter Reference"
                name="exporterReference"
                isSelect
                options={[
                  "As it is on Exporter Reference column",
                  "Use Custom Value",
                  "Skip",
                ]}
                value={formData.exporterReference}
                onChange={handleChange}
              />

              <InputField
                label="Wait For Seconds"
                name="waitForSeconds"
                type="number"
                value={formData.waitForSeconds}
                onChange={handleChange}
              />

              <RadioGroup
                label="Run In Test Mode"
                name="runInTestMode"
                options={["Yes", "No"]}
                selectedValue={formData.runInTestMode}
                onChange={handleChange}
              />*/}
            </div>
            {/* Column 2 */}
            {/*
            <div className="space-y-3">
              
              <CheckboxField
                label="Fill Up Exporter Reference"
                name="fillUpExporterReference"
                checked={formData.fillUpExporterReference}
                onChange={handleChange}
              />
               
              <CheckboxField
                label="Run Rex Declaration"
                name="runRexDeclaration"
                checked={formData.runRexDeclaration}
                onChange={handleChange}
              />

              <CheckboxField
                label="Allow Overwrite"
                name="allowOverwrite"
                checked={formData.allowOverwrite}
                onChange={handleChange}
              />

              <CheckboxField
                label="Approve Button"
                name="approveButton"
                checked={formData.approveButton}
                onChange={handleChange}
              />

              <InputField
                label="Inv Date Format"
                name="invDateFormat"
                isSelect
                options={["yyyy-mm-dd", "dd/mm/yyyy", "mm-dd-yyyy"]}
                value={formData.invDateFormat}
                onChange={handleChange}
              />

              <CheckboxField
                label="Use Supplier Address"
                name="useSupplierAddress"
                checked={formData.useSupplierAddress}
                onChange={handleChange}
              />
              
            </div>*/}
          </div>

          <div className="text-center mt-6">
            <button
              type="submit"
              className="px-8 py-3 bg-green-700 text-white rounded-lg shadow hover:bg-green-800"
            >
              Start
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InvoiceSetting;
