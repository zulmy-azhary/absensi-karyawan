import {
  type MetaFunction,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import { USER_PASS_STRATEGY, authenticator } from "~/actions/auth.server";
import { useActionData } from "@remix-run/react";
import { RemixFormProvider, useRemixForm } from "remix-hook-form";
import { loginSchema } from "~/schemas/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { CustomInput } from "~/components/ui/custom-input";
import { CustomForm } from "~/components/ui/custom-form";
import { Button } from "~/components/ui/button";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return await authenticator.isAuthenticated(request, {
    successRedirect: "/app",
  });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    return await authenticator.authenticate(USER_PASS_STRATEGY, request, {
      successRedirect: "/app",
    });
  } catch (error: unknown) {
    return error as Error;
  }
};

export const meta: MetaFunction = () => {
  return [
    { title: "Absensi Karyawan | Login" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  const actionData = useActionData<typeof action>();

  const form = useRemixForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    defaultValues: {
      nik: "",
      password: "",
    },
  });

  return (
    <div className="min-h-screen grid place-items-center">
      <div className="flex flex-col items-center w-3/4 lg:w-2/4 xl:w-1/4">
        <RemixFormProvider {...form}>
          <CustomForm actionData={actionData} method="post">
            <CustomInput
              name="nik"
              label="Nomor Induk Karyawan"
              placeholder="Masukkan Nomor Induk Karyawan..."
            />
            <CustomInput
              name="password"
              label="Password"
              type="password"
              placeholder="Masukkan Password..."
            />
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Memproses..." : "Login"}
            </Button>
          </CustomForm>
        </RemixFormProvider>
      </div>
    </div>
  );
}
