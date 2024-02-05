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
      <div className="flex flex-col items-center w-3/4 lg:w-2/4 xl:w-1/4">
        <LoginForm actionData={actionData} />
      </div>
    </div>
  );
}
