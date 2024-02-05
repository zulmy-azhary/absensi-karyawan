import React from "react";
import { type $Enums } from "@prisma/client";
import { authenticator } from "~/actions/auth.server";
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

type RoleGateProps = {
  children: React.ReactNode;
  allowedRole: $Enums.Role;
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request);
  return json(user);
};

export const RoleGate = ({ children, allowedRole }: RoleGateProps) => {
  const user = useLoaderData<typeof loader>();

  if (user?.role !== allowedRole) return;

  return <>{children}</>;
};
