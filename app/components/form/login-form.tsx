import { RemixFormProvider, useRemixForm } from "remix-hook-form";
import { CustomInput } from "~/components/ui/custom-input";
import { CustomForm } from "~/components/ui/custom-form";
import { Button } from "~/components/ui/button";
import type { z } from "zod";
import { loginSchema } from "~/schemas/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";

type LoginFormProps = {
  actionData: { message: string } | undefined;
};

export const LoginForm = ({ actionData }: LoginFormProps) => {
  const form = useRemixForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      nik: "",
      password: "",
    },
  });
  return (
    <RemixFormProvider {...form}>
      <CustomForm actionData={actionData} method="post">
        <CustomInput
          name="nik"
          label="Nomor Induk Karyawan"
          placeholder="Masukkan Nomor Induk Karyawan..."
          disabled={form.formState.isSubmitting}
        />
        <CustomInput
          name="password"
          label="Password"
          type="password"
          placeholder="Masukkan Password..."
          disabled={form.formState.isSubmitting}
        />
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Memproses..." : "Login"}
        </Button>
      </CustomForm>
    </RemixFormProvider>
  );
};
