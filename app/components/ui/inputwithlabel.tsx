import { useField } from "remix-validated-form";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { cn } from "~/lib/utils";

type InputWithLabelProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  input: string;
}

export function InputWithLabel(props: InputWithLabelProps) {
  const { className, label, input, ...rest } = props;
  const { error, getInputProps } = useField(input);

  return (
    <div className={cn("grid w-full max-w-sm items-center gap-1.5", className)}>
      <Label htmlFor={input}>{label}</Label>
      <Input className={cn(error && "border-red-500")} {...getInputProps({ id: input })} {...rest} />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}