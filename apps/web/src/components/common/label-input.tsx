import { memo } from "react";
import { Input, Label } from "@/components/ui";

interface LabeledInputProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  className?: string;
}

export const LabeledInput = memo(function LabeledInput({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  className = "",
}: LabeledInputProps) {
  return (
    <div className={`space-y-1 ${className}`}>
      <Label>{label}</Label>
      <Input
        value={value}
        onChange={onChange}
        type={type}
        placeholder={placeholder}
      />
    </div>
  );
});
