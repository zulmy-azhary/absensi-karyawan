import { cn } from "~/lib/utils";
import { useEffect } from "react";
import { useToast } from "~/components/ui/use-toast";
import { Form, type FormProps } from "@remix-run/react";
import { useRemixFormContext } from "remix-hook-form";

type CustomFormProps = FormProps & {
  actionData: { message: string } | undefined;
};

export const CustomForm = (props: CustomFormProps) => {
  const { actionData, children, className, ...rest } = props;
  const { handleSubmit } = useRemixFormContext();
  const { toast } = useToast();

  useEffect(() => {
    if (!actionData || !actionData.message) return;

    toast({ description: actionData.message });
  }, [actionData, toast]);

  return (
    <Form onSubmit={handleSubmit} className={cn("space-y-8 w-full", className)} {...rest}>
      {children}
    </Form>
  );
}
