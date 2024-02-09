import { cn } from "~/lib/utils";
import { useEffect } from "react";
import { Form, type FormProps } from "@remix-run/react";
import { useRemixFormContext } from "remix-hook-form";
import { toast } from "sonner";

type CustomFormProps = FormProps & {
  actionData: { message: string; status?: number } | undefined;
};

export const CustomForm = (props: CustomFormProps) => {
  const { actionData, children, className, ...rest } = props;
  const { handleSubmit } = useRemixFormContext();

  useEffect(() => {
    if (!actionData || !actionData.message) return;

    if (actionData.status === 200) {
      toast.success(actionData.message);
      return;
    }

    toast.error(actionData.message);
  }, [actionData]);

  return (
    <Form onSubmit={handleSubmit} className={cn("space-y-8 w-full", className)} {...rest}>
      {children}
    </Form>
  );
};
