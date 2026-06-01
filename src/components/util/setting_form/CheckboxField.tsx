interface CheckboxFieldProps {
  label: string;
  name: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CheckboxField: React.FC<CheckboxFieldProps> = ({
  label,
  name,
  checked,
  onChange,
}) => (
  <div className="flex items-center space-x-2 py-2">
    <input
      type="checkbox"
      name={name}
      checked={checked}
      onChange={onChange}
      className="h-5 w-5"
    />
    <label>{label}</label>
  </div>
);

export default CheckboxField;
