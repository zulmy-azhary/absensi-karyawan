import { type LoaderFunctionArgs } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { isAdmin } from "~/middlewares/auth.middleware";

export async function loader({ request }: LoaderFunctionArgs) {
  await isAdmin(request);
  return null;
}

export default function UsersRoot() {
  return <Outlet />
}
