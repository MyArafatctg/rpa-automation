import type { ChangeEvent } from "react";

export interface CheckBoxProps {
  isChecked: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  isDisabled?: boolean;
  levelText: string;
}

const CheckBox = ({
  isChecked,
  onChange,
  isDisabled = false,
  levelText,
}: CheckBoxProps) => {
  return (
    <label
      className={`flex items-center space-x-3 cursor-pointer pr-3 ${
        isDisabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      <input
        type="checkbox"
        checked={isChecked}
        onChange={onChange}
        disabled={isDisabled}
        className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
      />

      <span className="text-white-900 font-medium select-none">
        {levelText}
      </span>
    </label>
  );
};

export default CheckBox;
