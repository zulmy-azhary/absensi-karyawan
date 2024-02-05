import { Select, SelectContent, SelectTrigger, SelectValue } from "~/components/ui/select";
import { cn } from "~/lib/utils";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { useRemixFormContext } from "remix-hook-form";

type CustomSelectProps = React.ComponentPropsWithRef<"button"> & {
  name: string;
  label?: string;
  placeholder?: string;
  children: React.ReactNode;
};

export const CustomSelect = (props: CustomSelectProps) => {
  const { name, label, placeholder, children, ...rest } = props;
  const { control } = useRemixFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          {label ? <FormLabel>{label}</FormLabel> : null}
          <FormControl>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger className={cn(fieldState.error && "border-red-500")} {...rest}>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>{children}</SelectContent>
            </Select>
          </FormControl>
          <FormMessage className="text-xs mt-0" />
        </FormItem>
      )}
    />
  );
}
