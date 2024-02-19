import {
  type MetaFunction,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import { USER_PASS_STRATEGY, authenticator } from "~/actions/auth.server";
import { useActionData } from "@remix-run/react";
import { LoginForm } from "~/components/form/login-form";

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

  return (
    <div className="min-h-screen grid place-items-center">
      <div className="flex flex-col items-center w-10/12 md:w-7/12 lg:w-2/4 xl:w-4/12 px-6 py-8 md:px-10 md:py-12 lg:px-14 lg:py-20 rounded shadow-md border gap-y-6 md:gap-y-12">
        <h1 className="text-3xl md:text-4xl font-semibold">Login</h1>
        <LoginForm actionData={actionData} />
      </div>
    </div>
  );
}
