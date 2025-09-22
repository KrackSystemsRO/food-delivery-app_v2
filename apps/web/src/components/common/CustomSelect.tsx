import { memo } from "react";

export interface CustomSelectProps<T extends string | string[]> {
  label: string;
  value: T;
  onValueChange: (value: T) => void;
  options: { value: string; label: string }[];
  multiple?: boolean;
}

export function CustomSelectComponent<T extends string | string[]>({
  label,
  value,
  onValueChange,
  options,
  multiple = false,
}: CustomSelectProps<T>) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (multiple) {
      const selected = Array.from(
        e.target.selectedOptions,
        (option) => option.value
      );
      onValueChange(selected as T);
    } else {
      onValueChange(e.target.value as T);
    }
  };

  return (
    <div className="flex flex-col">
      <label>{label}</label>
      <select
        multiple={multiple}
        value={value as any}
        onChange={handleChange}
        className="border rounded p-1"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// Wrap after defining the generic
export const CustomSelect = memo(
  CustomSelectComponent
) as typeof CustomSelectComponent;
