interface InputFieldProps {
  label: string;
  name: string;
  value: string | number;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  type?: "text" | "number" | "password";
  required?: boolean;
  isSelect?: boolean;
  options?: string[];
  hasFileIcon?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
  isSelect = false,
  options = [],
  hasFileIcon = false,
}) => (
  <div className="flex items-center space-x-4 py-2">
    <label className="text-gray-700 min-w-[150px] font-medium">
      {label} {required && <span className="text-red-500">*</span>}
    </label>

    <div className="grow">
      {isSelect ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="w-full px-3 py-2 border rounded-lg"
        >
          {options.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      ) : (
        <div className="relative">
          <input
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            required={required}
            className={`w-full px-3 py-2 border rounded-lg ${
              hasFileIcon ? "pr-10" : ""
            }`}
          />
        </div>
      )}
    </div>
  </div>
);

export default InputField;
