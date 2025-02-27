/* eslint-disable */

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface BaseInputProps {
  control: any;
  name: string;
  label?: string;
  placeHolder?: string;
  icon?: React.ReactNode;
  className?: string;
  type?: string;
}

export default function BaseInput({
  control,
  name,
  label,
  placeHolder,
  icon,
  className,
  type = "text",
}: BaseInputProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="relative w-full">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">
                {icon}
              </span>

              <Input
                type={type}
                placeholder={placeHolder}
                className={`${icon ? "pl-10" : ""} ${className}`}
                {...field}
                onChange={(e) => {
                  const value = e.target.value;
                  field.onChange(
                    type === "number" ? (value ? Number(value) : "") : value
                  );
                }}
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
