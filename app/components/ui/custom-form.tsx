import { type FormProps, ValidatedForm, useIsSubmitting } from "remix-validated-form";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { useEffect } from "react";
import { useToast } from "~/components/ui/use-toast";

type CustomFormProps<T> = FormProps<T, string | undefined> & {
  id: string;
  actionData: { message: string } | undefined;
  buttonName: string;
};

export default function CustomForm<T extends { [key: string]: any }>(props: CustomFormProps<T>) {
  const { id, actionData, buttonName, children, validator, className, ...rest } = props;
  const isSubmitting = useIsSubmitting(id);
  const { toast } = useToast();

  useEffect(() => {
    if (!actionData) return;

    toast({ description: actionData.message });
  }, [actionData, toast]);

  return (
    <ValidatedForm
      id={id}
      validator={validator}
      className={cn(className, "space-y-8 w-full")}
      {...rest}
    >
      {children}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Memproses..." : buttonName}
      </Button>
    </ValidatedForm>
  );
}
