import React, { useState, useCallback, useEffect } from "react";
import { toast } from "react-toastify";
import XIcon from "../util/setting_form/XIcon";
import InputField from "../util/setting_form/InputField";

export interface ContainerSettingType {
  downloadFolder: string;
}

interface ContainerSettingProps {
  onStart: (data: ContainerSettingType) => void;
  isOpen: boolean;
  onClose: () => void;
}

const initialFormData: ContainerSettingType = {
  downloadFolder: "",
};

const ContainerSetting: React.FC<ContainerSettingProps> = ({
  onStart,
  isOpen,
  onClose,
}) => {
  const [formData, setFormData] =
    useState<ContainerSettingType>(initialFormData);
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
    [formData]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // VALIDATION
    if (!formData.downloadFolder) {
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
          Set Upload and Download Path
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-3">
            <InputField
              label="Download Folder Path"
              name="downloadFolder"
              type="text"
              hasFileIcon
              value={formData.downloadFolder}
              onChange={handleChange}
            />
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

export default ContainerSetting;
