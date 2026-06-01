import React from "react";
import Select from "react-select";

export interface LovOption {
  value: number | string;
  label: string;
}

interface LovSelectProps {
  label?: string;
  options: LovOption[];
  value: LovOption | null;
  isLoading?: boolean;
  placeholder?: string;
  onInputChange: (input: string) => void;
  onChange: (option: LovOption | null) => void;
}

const LovSelect: React.FC<LovSelectProps> = ({
  label,
  options,
  value,
  isLoading = false,
  placeholder = "Select...",
  onInputChange,
  onChange,
}) => {
  return (
    <div>
      {label && <label className="block mb-1 font-medium">{label}</label>}

      <Select
        options={options}
        value={value}
        isLoading={isLoading}
        placeholder={placeholder}
        onInputChange={onInputChange}
        onChange={onChange}
        isClearable
        classNamePrefix="lov"
        menuPortalTarget={document.body}
        menuPosition="fixed"
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
        }}
      />
    </div>
  );
};

export default LovSelect;
