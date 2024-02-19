import type { MetaFunction } from "@remix-run/node";
import { Outlet, useRouteLoaderData } from "@remix-run/react";
import type { UserType } from "~/types";

export const meta: MetaFunction = () => {
  return [{ title: "Absensi Karyawan | Profil" }];
};

export default function DashboardProfile() {
  const user = useRouteLoaderData<UserType>("routes/app")!;
  return <Outlet context={user} />;
}
