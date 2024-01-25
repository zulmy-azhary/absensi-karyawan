import { cn } from "~/lib/utils";
import { Textarea } from "~/components/ui/textarea";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { useRemixFormContext } from "remix-hook-form";

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  name: string;
};

export const CustomTextarea = (props: TextareaProps) => {
  const { label, name, ...rest } = props;
  const { control } = useRemixFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          {label ? <FormLabel>{label}</FormLabel> : null}
          <FormControl>
            <Textarea
              className={cn(
                fieldState.error && "border-red-500",
                "read-only:opacity-75 read-only:bg-slate-100"
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
