import { useRemixFormContext } from "remix-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";

type CustomInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  name: string;
};

export const CustomInput = (props: CustomInputProps) => {
  const { className, label, name, ...rest } = props;
  const { control } = useRemixFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          {label ? <FormLabel>{label}</FormLabel> : null}
          <FormControl>
            <Input
              className={cn(
                "read-only:opacity-75 read-only:bg-slate-100",
                fieldState.error && "border-red-500",
                className
              )}
              {...field}
              {...rest}
            />
          </FormControl>
          <FormMessage className="text-xs mt-0" />
        </FormItem>
      )}
    />
  );
};
