interface RadioGroupProps {
  label: string;
  name: string;
  selectedValue: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  options: string[];
}

const RadioGroup: React.FC<RadioGroupProps> = ({
  label,
  name,
  selectedValue,
  onChange,
  options,
}) => (
  <div className="flex items-center space-x-4 py-2">
    <label className="min-w-[150px] font-medium">{label}</label>

    <div className="flex space-x-4">
      {options.map((o) => (
        <label key={o} className="flex items-center">
          <input
            type="radio"
            name={name}
            value={o}
            checked={selectedValue === o}
            onChange={onChange}
            className="mr-2"
          />
          {o}
        </label>
      ))}
    </div>
  </div>
);

export default RadioGroup;
