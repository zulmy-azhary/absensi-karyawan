import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "./form";
import { useRemixFormContext } from "remix-hook-form";

type DatePickerWithRangeProps = React.ComponentProps<"div"> & {
  name: string;
  label?: string;
};

export default function DatePickerWithRange(props: DatePickerWithRangeProps) {
  const { name, label } = props;
  const { control } = useRemixFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className="grid gap-1.5">
          {label ? <FormLabel>{label}</FormLabel> : null}
          <FormControl>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal",
                    !field.value && "text-muted-foreground",
                    fieldState.error && "border-red-500"
                  )}
                >
                  <CalendarIcon
                    className={cn("mr-2 h-4 w-4", fieldState.error && "text-red-500")}
                  />
                  {field.value?.from ? (
                    field.value.to ? (
                      <>
                        {format(field.value.from, "dd MMMM yyyy")} -{" "}
                        {format(field.value.to, "dd MMMM yyyy")}
                      </>
                    ) : (
                      format(field.value.from, "dd MMMM yyyy")
                    )
                  ) : (
                    <span>Masukkan tanggal pengajuan...</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  numberOfMonths={2}
                  selected={field.value}
                  onSelect={field.onChange}
                />
              </PopoverContent>
            </Popover>
          </FormControl>
          <FormMessage className="text-xs mt-0" />
        </FormItem>
      )}
    />
  );
}
